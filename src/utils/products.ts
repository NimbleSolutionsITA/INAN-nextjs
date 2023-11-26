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
    if (product.type === 'variable' && !product.manage_stock) {
        const {products} = await getProductVariations(product.id)
        if (products.length > 0) {
            const variation = products.find(p => p.manage_stock && p.stock_status === 'instock') ?? products[0]
            stockStatus = {
                manage_stock: variation.manage_stock,
                stock_quantity: variation.stock_quantity,
                stock_status: variation.stock_status,
            }
        }
    }
    return mapProd({...product, ...stockStatus})
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