export const WORDPRESS_API_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json`
export const HEADER_FOOTER_ENDPOINT = `${ WORDPRESS_API_ENDPOINT}/rae/v1/header-footer?header_location_id=hcms-menu-header&footer_location_id=hcms-menu-footer`
export const NEWS_FEED_ENDPOINT = `${ WORDPRESS_API_ENDPOINT}/wp/v2/news_feed`
export const API_GET_PRODUCTS_ENDPOINT = `${ process.env.NEXT_PUBLIC_SITE_URL}/api/products`
export const API_CUSTOMER_ENDPOINT = `${ process.env.NEXT_PUBLIC_SITE_URL}/api/customer`
export const API_ORDER_ENDPOINT = `${ process.env.NEXT_PUBLIC_SITE_URL}/api/orders`
export const WORDPRESS_USER_INFO_ENDPOINT = `${WORDPRESS_API_ENDPOINT}/wp/v2/users/me`
export const WORDPRESS_LOGIN_ENDPOINT = `${WORDPRESS_API_ENDPOINT}/jwt-auth/v1/token`
export const WORDPRESS_RESET_PASSWORD_ENDPOINT = `${WORDPRESS_API_ENDPOINT}/bdpwr/v1/reset-password`
export const WORDPRESS_SET_NEW_PASSWORD_ENDPOINT = `${WORDPRESS_API_ENDPOINT}/bdpwr/v1/set-password`
export const WORDPRESS_RESET_PASSWORD_VALIDATE_CODE_ENDPOINT = `${WORDPRESS_API_ENDPOINT}/bdpwr/v1/validate-code`

export const CUSTOM_PAGES = [
    'stockists',
    'wishlist',
    'about',
    'checkout',
    'collection',
    'shopping-bag',
    'home',
    'account',
    'made-to-order',
    'contact',
    'product-care',
    'shop',
    'shipping',
    'cookie-policy',
    'privacy-policy',
    'terms-and-conditions',
    'returns',
]