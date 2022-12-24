export type MenuItem = {
    ID: number
    children?: MenuItem[]
    pageID: number
    pageSlug: string
    title: string
    url: string
}

export type SocialItem = {
    iconName: string
    iconUrl: string
}

export type HcmsResponse = { data: {
        header: {
            favicon: string
            headerMenuItems: string | MenuItem[]
            siteDescription: string
            siteLogoUrl: string
            siteTitle: string
        },
        footer: {
            copyrightText: boolean | string
            footerMenuItems: string | MenuItem[]
            sidebarOne: string
            sidebarTwo: string
            socialLinks: SocialItem[]
        }
    } }