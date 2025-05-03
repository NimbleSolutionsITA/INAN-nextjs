import {LayoutProps} from "../src/utils/layout";
import {WP_REST_API_Post} from "wp-types";

export type LinkItem = {
    id: number
    name: string
    slug: string
    url: string
}

export type WordpressPage = WP_REST_API_Post & {
    acf:[],
    yoast_head: string,
    yoast_head_json: Yoast
}

export type BasePageProps = LayoutProps & { links?: LinkItem[], page: WordpressPage}

export type CartItem = {
    id: number
    name: string
    price: number
    leather: string | null
    size: string | null
    color: string | false | null
    image: string
    slug: string
    qty: number,
    private?: boolean
    stockQuantity?: number
}

export type Cart = CartItem[] | undefined

export type Header = {
    height: number
    heightMobile: number
    headerColorMobile: string
    headerColor: string
    open: boolean
    sizeGuideOpen: boolean
    bgColor: string
    pageTitle: string | null
    loading: boolean
}

export type User = {
    id: number
    email: string
    first_name: string
    last_name: string
    username: string
}

export type Auth = {
    authenticated: boolean
    authenticating: boolean
    user: User | undefined
    privateSalesAccess: boolean
    cookieModalOpen: boolean
}

export type PageSettings = {
    bgColor: string,
    headerColor: string,
    headerColorMobile: string,
    pageTitle: string | null
}

export interface Yoast {
    title: string
    robots: Robots
    og_locale: string
    og_type: string
    og_title: string
    og_url: string
    og_site_name: string
    article_modified_time: string
    twitter_card: string
    schema: Schema
}

export interface Robots {
    index: string
    follow: string
    "max-snippet": string
    "max-image-preview": string
    "max-video-preview": string
}

export interface Schema {
    "@context": string
    "@graph": Graph[]
}

export interface Graph {
    "@type": string
    "@id": string
    url?: string
    name?: string
    isPartOf?: IsPartOf
    datePublished?: string
    dateModified?: string
    breadcrumb?: Breadcrumb
    inLanguage?: string
    potentialAction?: PotentialAction[]
    itemListElement?: ItemListElement[]
    description?: string
}

export interface IsPartOf {
    "@id": string
}

export interface Breadcrumb {
    "@id": string
}

export interface PotentialAction {
    "@type": string
    target: any
    "query-input"?: string
}

export interface ItemListElement {
    "@type": string
    position: number
    name: string
    item?: string
}