import {HcmsResponse} from "../../@types/wordpress";
import {HEADER_FOOTER_ENDPOINT, NEWS_FEED_ENDPOINT, WORDPRESS_API_ENDPOINT} from "./endpoints";
import {WP_REST_API_Posts, WP_REST_API_Post} from "wp-types/index";
import {ShopProduct, Variation} from "./products";
import {CategoryProps} from "./shop";
import {ProductAttribute} from "../../@types/woocommerce";
import {WordpressPage} from "../../@types";

export type Cover = {
    id: number
    title: string
    color: string
    colorMobile: string
    ctaLink: string
    ctaText: string
    bg: string
    bgMobile: string
    isCover: boolean
    isCoverMobile: boolean
    video: string
    loop: boolean
    autoplay: boolean
    mute: boolean
}

export type CoverPostACF = WP_REST_API_Post & { acf: {
        title: string
        color: string
        color_mobile: string
        cta_link: string
        cta_text: string
        image: string
        image_mobile: string
        is_cover: boolean
        is_cover_mobile: boolean
        video: string
        loop: boolean
        autoplay: boolean
        mute: boolean
    }}

export type ACFMedia = {
    ID: number
    alt: string
    author: string
    caption: string
    date: string
    description: string
    filename: string
    filesize: number
    height: number
    icon: string
    id: number
    link: string
    menu_order: number
    mime_type: string
    modified: string
    name: string
    sizes: {
        '1536x1536': string
        '1536x1536-height': number
        '1536x1536-width': number
        '2048x2048': string
        '2048x2048-height': number
        '2048x2048-width': number
        large: string
        'large-height': number
        'large-width': number
        medium: string
        'medium-height': number
        'medium-width': number
        medium_large: string
        'medium_large-height': number
        'medium_large-width': number
        'post-thumbnail': string
        'post-thumbnail-height': number
        'post-thumbnail-width': number
        thumbnail: string
        'thumbnail-width': number
        'thumbnail-height': number
        'woocommerce_gallery_thumbnail': string
        'woocommerce_gallery_thumbnail-height': number
        'woocommerce_gallery_thumbnail-width': number
        woocommerce_single: string
        'woocommerce_single-height': number
        'woocommerce_single-width': number
        woocommerce_thumbnail: string
        'woocommerce_thumbnail-height': number
        'woocommerce_thumbnail-width': number
    }
    status: string
    subtype: string
    title: string
    type: string
    uploaded_to: string
    url: string
    width: number
}

export type CollectionACFProduct = {
    image: ACFMedia
    product: {
        ID: number
        post_name: string
        post_status: string
        post_title: string
    }
}

export type StockistsPostACF = WordpressPage & { acf: {
        city: string
        website: string
        contacts: string
    }}

export type CollectionPostACF = WordpressPage & { acf: {
        gallery: ACFMedia[]
        products: CollectionACFProduct[]
        lookbook: CollectionACFProduct[]
        video: {
            video: string
            video_poster: ACFMedia
        }
        video_poster: ACFMedia | false
        gallery1: string | false
        gallery2: string | false
        gallery3: string | false
        gallery4: string | false
        gallery5: string | false
        gallery6: string | false
        gallery7: string | false
        gallery8: string | false
        gallery9: string | false

    }}

export type SizeGuidePost = WordpressPage & { acf: {
        adj_measures: string
        wearability: string
        matching_size: string
    }}

export type NewsFeed = {
    id: number
    title: string
}

export type LayoutProps = { layoutProps: HcmsResponse['data'], news: NewsFeed[] }
export type HomePageProps = { covers: Cover[] }
export type PageProps = { page: WP_REST_API_Post }
export type ShopPageProps = { products:  ShopProduct[], productCategories: CategoryProps[] }
export type CollectionPageProps = { collection:  CollectionPostACF }
export type ProductPageProps = { product:  ShopProduct, relatedProducts: ShopProduct[], productCategories: CategoryProps[], colors: ProductAttribute[], sizeGuide: SizeGuidePost[], variations: Variation[] }

export const getLayoutProps = async (): Promise<LayoutProps> => {
    const [
        news,
        { data: layoutProps }
    ]: [ WP_REST_API_Posts, HcmsResponse ] = await Promise.all([
        fetch(NEWS_FEED_ENDPOINT).then(response => response.json()),
        fetch(HEADER_FOOTER_ENDPOINT).then(response => response.json())
    ])
    return ({
        layoutProps,
        news: news.map((n) => ({ title: n.title.rendered, id: n.id }))
    })
};

export const getHomeProps = async (): Promise<HomePageProps> => {
    const covers: CoverPostACF[] = await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v2/home_covers`).then(response => response.json())
    return { covers: covers.map(cover => ({
            id: cover.id,
            title: cover.title.rendered,
            color: cover.acf.color,
            colorMobile: cover.acf.color_mobile || cover.acf.color,
            ctaLink: cover.acf.cta_link,
            ctaText: cover.acf.cta_text,
            bg: cover.acf.image,
            bgMobile: cover.acf.image_mobile || cover.acf.image,
            isCover: cover.acf.is_cover,
            isCoverMobile: cover.acf.is_cover_mobile,
            video: cover.acf.video,
            loop: cover.acf.loop || false,
            autoplay: cover.acf.autoplay || false,
            mute: cover.acf.mute || false
        }))}
}

export const getPageProps = async<T> (slug: string): Promise<PageProps> => {
    const page: WordpressPage = (await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v2/pages?slug=${slug}`).then(response => response.json()))[0]
    return { page }
}

export const getProductPageProps = async<T> (slug: string): Promise<PageProps> => {
    const page: WordpressPage = (await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v3/product?slug=${slug}`).then(response => response.json()))[0]
    return { page }
}

export const getCollectionProps = async (): Promise<{ collections:  CollectionPostACF[]}> => {
    const collections: CollectionPostACF[] = await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v2/collection`).then(response => response.json())
    return { collections: collections.map(collection => ({
            ...collection
        }))}
}

export const getStockistsProps = async (): Promise<{ stockists:  StockistsPostACF[]}> => {
    const stockists: StockistsPostACF[] = await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v2/stockist`).then(response => response.json())
    return { stockists }
}

export const getAllCollectionIds = async () => {
    const {collections} = await getCollectionProps()
    return collections.map(collection => ({
        params: {
            cslug: collection.slug,
        }
    }))
}