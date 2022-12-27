import {LayoutProps} from "../src/utils/layout";

export type LinkItem = {
    id: number
    name: string
    slug: string
    url: string
}

export type BasePageProps = LayoutProps & { links?: LinkItem[]}

export type CartItem = {
    id: number
    name: string
    price: number
    leather: string | null
    size: string | null
    color: string | false | null
    image: string
    slug: string
    qty: number
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
    isMobile: boolean
    loading: boolean
}

export type User = {
    id: number
    email: string
    first_name: string
    last_name: string
    username: string
    registered_date: string
    roles: string[]
    avatar_url: {
        '24': string
        '48': string
        '96': string
    }
}

export type Auth = {
    authenticated: boolean
    authenticating: boolean
    user: User | undefined
}

export type PageSettings = {
    bgColor: string,
    headerColor: string,
    headerColorMobile: string,
    pageTitle: string | null
}