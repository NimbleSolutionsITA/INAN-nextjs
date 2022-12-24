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

export type ProductsProps = { products: Product[] }

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
        collection: string | false
        collection2: string | false
        collection3: string | false
        collection4: string | false
        collectionOrder: string | false
        color: {
            count: number
            filter: string
            name: string
            parent: number
            slug: string
            taxonomy: string
            term_group: number
            term_id: number
            term_taxonomy_id: number
        } | false
        hideCollection: boolean
        isTakeOver: boolean
        lookbook: boolean
        lookbook2: boolean
        lookbook3: boolean
        size: string
        video: string
        video_cover: false | ACFMedia
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
    return { products: products.map(mapProduct) };
};

type GetProductsParams = Partial<{
    category: number
    page: number
    per_page: number
    slug: string
    include: number | number[]
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
    return { products: products.map(mapProduct) };
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

export const mapProduct = (product: ShopProduct) => ({
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
    stock_quantity: product.stock_quantity || 0,
    stock_status: product.stock_status,
    upsell_ids: product.upsell_ids,
    variations: product.variations,
    type: product.type
})