import {
    Category,
    Continent, Country, Order,
    Product,
    ProductAttribute,
    ShippingLocation,
    ShippingMethod
} from "../../@types/woocommerce";
import {SizeGuidePost} from "./layout";
import {CUSTOM_PAGES, WORDPRESS_API_ENDPOINT} from "./endpoints";
import {WordpressPage} from "../../@types";

export type ProductProps = {
    productCategories: Category[]
    color: ProductAttribute[]
    leather: ProductAttribute[]
    size: ProductAttribute[]
}

export type ShippingProps = {
    countries: Country[],
    continents: Continent[],
    shippingLocationsEU: ShippingLocation[],
    shippingLocationsW: ShippingLocation[],
    shippingR: ShippingMethod,
    shippingEU: ShippingMethod,
    shippingIT: ShippingMethod,
    shippingW: ShippingMethod,
    shippingGIFT: ShippingMethod,
    shippingUK: ShippingMethod,
}

export type CategoryProps = {
    id: number
    name: string
    slug: string
}
const WooCommerceRestApi = require( '@woocommerce/woocommerce-rest-api' ).default;

const api = new WooCommerceRestApi( {
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: 'wc/v3',
} );

export const getCategoriesProps = async (): Promise<CategoryProps[]> => {
    const { data: categories } = await api.get('products/categories', { per_page: 100})
    return categories.sort((a: Category, b: Category) => {
        if ( a.menu_order < b.menu_order ){ return -1; }
        if ( a.menu_order > b.menu_order ){ return 1; }
        return 0;
    }).map((category: Category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug
    }))
}

export const getProductColorsProps = async (): Promise<ProductAttribute[]> => {
    const { data: colors } = await api.get('products/attributes/4/terms', { per_page: 100})
    return colors
}

export const getCountries = async (): Promise<Country[]> => {
    const { data: countries } = await api.get('data/countries')
    return countries
}

export const getAllPagesIds = async () => {
    const pages = await getCategoriesProps()
    return pages.filter(({slug}) => !CUSTOM_PAGES.includes(slug)).map(page => ({
        params: {
            page: page.slug,
        }
    }))
}

export const getAllProductCategoriesIds = async () => {
    const categories = await getCategoriesProps()
    return categories.map(category => ({
        params: {
            category: category.slug,
        }
    }))
}

export const getAllProductsIds = async () => {
    let page = 1;
    let products: Product[] = [];
    let allProducts: Product[] = [];
    do {
        products =  (await api.get(
            'products',
            {
                per_page: 100,
                page,
                status: 'publish',
            },
        )).data;
        allProducts = [...allProducts, ...products]
        page = page + 1
    }
    while (products.length > 0);

    return allProducts.map(product => ({
        params: {
            product: product.slug,
        }
    }))
}

export const getSizeGuideProps = async (): Promise<SizeGuidePost[]> => {
    return await fetch(`${WORDPRESS_API_ENDPOINT}/wp/v2/size_guide?per_page=99`).then(response => response.json())
}

/**
 * Get Shop data.
 *
 * @return {Promise<ProductsProps>}
 */
export const getProductProps = async ( ): Promise<ProductProps> => {
    const woocommerceEndpoints: Array<{ name: keyof ProductProps, endpoint: string }> = [
        { name: 'productCategories', endpoint: 'products/categories'},
        { name: 'color', endpoint: 'products/attributes/4/terms'},
        { name: 'leather', endpoint: 'products/attributes/3/terms'},
        { name: 'size', endpoint: 'products/attributes/2/terms'},
    ]
    let props: Partial<ProductProps> = {}
    const promises = woocommerceEndpoints.map(async entity => {
        const response = await api.get(entity.endpoint, { per_page: 100})
        props[entity.name] = response.data;
    })

    await Promise.all(promises)

    return props as ProductProps;
};

/**
 * shipping zones
 * 0: Rest of the World
 * 1: EU
 * 2: Italy
 * 3: World
 * 5: All
 * 6: UK
 *
 */
export const getCheckoutProps = async ( ): Promise<ShippingProps> => {
    const woocommerceEndpoints: Array<{ name: keyof ShippingProps, endpoint: string }> = [
        { name: 'countries', endpoint: 'data/countries'},
        { name: 'continents', endpoint: 'data/continents'},
        { name: 'shippingLocationsEU', endpoint: 'shipping/zones/1/locations'},
        { name: 'shippingLocationsW', endpoint: 'shipping/zones/3/locations'},
        { name: 'shippingR', endpoint: 'shipping/zones/0/methods/12'},
        { name: 'shippingEU', endpoint: 'shipping/zones/1/methods/9'},
        { name: 'shippingIT', endpoint: 'shipping/zones/2/methods/5'},
        { name: 'shippingW', endpoint: 'shipping/zones/3/methods/6'},
        { name: 'shippingGIFT', endpoint: 'shipping/zones/5/methods/13'},
        { name: 'shippingUK', endpoint: 'shipping/zones/6/methods/17'},
    ]
    let props: Partial<ShippingProps> = {}
    const promises = woocommerceEndpoints.map(async entity => {
        const response = await api.get(entity.endpoint, { per_page: 100})
        props[entity.name] = response.data;
    })

    await Promise.all(promises)

    return props as ShippingProps;
};