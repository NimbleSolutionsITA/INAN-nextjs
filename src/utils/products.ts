import {Product as Prod, Variation as WooVariation} from "../../@types/woocommerce";
import {ACFMedia} from "./layout";

export type Product = {
    id: number,
    type: Prod["type"],
    acf: ShopProduct["acf"],
    attributes: Prod["attributes"],
    categories: Prod["categories"],
    cross_sell_ids: Prod["cross_sell_ids"],
    description: Prod["description"],
    featured: Prod["featured"],
    images: Prod["images"],
    name: Prod["name"],
    price: Prod["price"],
    on_sale: Prod["on_sale"],
    price_html: Prod["price_html"],
    regular_price: Prod["regular_price"],
    related_ids: Prod["related_ids"],
    sale_price: Prod["sale_price"],
    short_description: Prod["short_description"],
    sku: Prod["sku"],
    slug: Prod["slug"],
    stock_quantity: number,
    stock_status: ShopProduct["stock_status"],
    upsell_ids: Prod["upsell_ids"],
    variations: Prod["variations"]
}

export type Variation = WooVariation & {
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
}

export type ProductsProps = { products: ShopProduct[] }

// Define the type for a single term (option)
export interface AttributeTerm {
    id: number;
    name: string;
    slug: string;
    count: number; // Number of products associated with this term
    description?: string;
}

// Define the type for an attribute
export interface Attribute {
    id: number;
    name: string;
    slug: string;
    type: string; // e.g., 'select'
    order_by: string; // e.g., 'menu_order'
    has_archives: boolean;
    options: AttributeTerm[]; // Array of terms associated with this attribute
}

const WooCommerceRestApi = require( '@woocommerce/woocommerce-rest-api' ).default;

const api = new WooCommerceRestApi( {
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: 'wc/v3',
} );

export type ShopProduct = Prod & {
    stock_status: string,
    acf: {
        pre_order?: string
        size: string
        video: string
        video_cover: false | ACFMedia
        color_variations?: number[]
    }
}

/**
 * Get Products.
 *
 * @return {Promise<ProductsProps>}
 */
export const getProductsProps = async ( category: number, perPage = 100, page = 1): Promise<ProductsProps> => {
    const { data: products } =  await api.get(
        'products',
        {
            per_page: perPage,
            page,
            status: 'publish',
            category,
        },
    );
        return { products: await Promise.all(products.map(mapProduct)) };
};

type GetProductsParams = Partial<{
    category: number
    page: number
    per_page: number
    slug: string
    include: number | number[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder',
    status: 'publish' | 'private' | 'draft' | 'pending'
    on_sale: boolean
}>

export const getProducts = async (params: GetProductsParams): Promise<ProductsProps> => {
    const { data: products } =  await api.get(
        'products',
        {
            per_page: 100,
            page: 1,
            status: 'publish',
            ...params,
        },
    );
    return { products: await Promise.all(products.map(mapProduct)) };
};

/**
 * Get all products currently on sale (respecting the WooCommerce sale schedule).
 *
 * WooCommerce computes `on_sale` from the sale price AND the scheduled
 * date_on_sale_from / date_on_sale_to, so a product with a future-scheduled
 * sale is correctly excluded until its start date. We also pass `on_sale: true`
 * to let WooCommerce pre-filter, then re-filter in JS as a safety net in case
 * the param is ignored by the endpoint.
 *
 * @return {Promise<ProductsProps>}
 */
export const getSaleProducts = async (): Promise<ProductsProps> => {
    let page = 1;
    let batch: any = [];
    let all: any = [];
    do {
        const { data } = await api.get(
            'products',
            {
                per_page: 100,
                page,
                status: 'publish',
                on_sale: true,
            },
        );
        batch = data;
        all = [...all, ...batch];
        page = page + 1;
    } while (batch.length > 0);

    const onSale = all.filter((product: ShopProduct) => product.on_sale);
    return { products: await Promise.all(onSale.map(mapProduct)) };
};

/**
 * Whether there is at least one product currently on sale (schedule-aware).
 * Lightweight check used to decide if the "SALES" nav tab should be shown.
 * Short-circuits as soon as an on_sale product is found.
 */
export const hasSaleProducts = async (): Promise<boolean> => {
    let page = 1;
    let batch: any = [];
    do {
        const { data } = await api.get(
            'products',
            {
                per_page: 100,
                page,
                status: 'publish',
                on_sale: true,
            },
        );
        batch = data;
        if (batch.some((product: ShopProduct) => product.on_sale)) return true;
        page = page + 1;
    } while (batch.length > 0);

    return false;
};

export const getProductVariations = async (id: number): Promise<ProductsProps> => {
    const { data: products } =  await api.get(
        `products/${id}/variations`,
        {
            per_page: 100,
            page: 1,
            status: 'publish',
        },
    );
    return { products };
};

export const mapProduct = async (product: ShopProduct) => {
    let stockStatus: {
        manage_stock: ShopProduct['manage_stock'],
        stock_quantity: ShopProduct['stock_quantity'],
        stock_status: ShopProduct['stock_status'],
    } = {
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity || 0,
        stock_status: product.stock_status,
    }
    let priceFields: Partial<ShopProduct> = {}
    // Variable products need their variations for stock (when the parent doesn't
    // manage it) and, when on sale, to derive the struck-out regular price the
    // parent leaves empty. Skip the fetch for non-sale products — their parent
    // `price` already renders correctly.
    const needsStock = product.type === 'variable' && !product.manage_stock
    const needsPrice = product.type === 'variable' && product.on_sale && !product.regular_price
    if (needsStock || needsPrice) {
        const {products} = await getProductVariations(product.id)
        if (products.length > 0 && needsStock) {
            const variation = products.find(p => p.manage_stock && p.stock_status === 'instock') ?? products[0]
            stockStatus = {
                manage_stock: variation.manage_stock,
                stock_quantity: variation.stock_quantity,
                stock_status: variation.stock_status,
            }
        }
        priceFields = variablePriceFields(product, products)
    }
    return mapProd({...product, ...stockStatus, ...priceFields})
}

/**
 * Variable products keep the regular/sale price empty on the parent (the price
 * lives on the variations), so on-sale cards would render "€ - €". Derive the
 * display price from the on-sale variation so the struck-out regular + sale
 * price shows correctly. Returns nothing when the parent already has a price or
 * no variation is on sale, leaving non-sale products untouched.
 */
export const variablePriceFields = (
    product: Pick<ShopProduct, 'regular_price'>,
    variations: Array<Pick<ShopProduct, 'price' | 'regular_price' | 'sale_price' | 'on_sale'>>,
): Partial<ShopProduct> => {
    if (product.regular_price) return {}
    const variation = variations.find(v => v.on_sale)
    if (!variation) return {}
    return {
        price: variation.price,
        regular_price: variation.regular_price,
        sale_price: variation.sale_price,
        on_sale: variation.on_sale,
    }
}

export const mapProd = (product: ShopProduct) => ({
    attributes: product.attributes,
    id: product.id,
    acf: product.acf,
    categories: product.categories,
    cross_sell_ids: product.cross_sell_ids,
    description: product.description,
    featured: product.featured,
    images: product.images,
    name: product.name,
    price: product.price,
    on_sale: product.on_sale,
    price_html: product.price_html,
    regular_price: product.regular_price,
    related_ids: product.related_ids,
    sale_price: product.sale_price,
    short_description: product.short_description,
    sku: product.sku,
    slug: product.slug,
    upsell_ids: product.upsell_ids,
    variations: product.variations,
    type: product.type,
    manage_stock: product.manage_stock,
    stock_quantity: product.stock_quantity,
    stock_status: product.stock_status,
    default_attributes: product.default_attributes
})