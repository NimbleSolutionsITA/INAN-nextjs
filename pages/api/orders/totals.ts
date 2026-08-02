import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";


export type GetCouponResponse = {
    success: boolean
    totals?: {
        shipping: string
        tax: string
        total: string
        discount: string
    }
    error?: string
}

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
    consumerKey: process.env.WC_CONSUMER_KEY ?? '',
    consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
    version: "wc/v3"
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GetCouponResponse>
) {
    const responseData: GetCouponResponse = {
        success: false,
    }
    try {
        if (req.method === 'POST') {
            const { data } = await api.post(`orders`, req.body.order)
            const { id, total, total_tax, shipping_total, discount_total } = data
            responseData.totals = {
                shipping: shipping_total,
                tax: total_tax,
                total,
                discount: discount_total
            }
            responseData.success = true
            await api.delete(`orders/${id}`, { force: true })
        }
    } catch (error) {
        responseData.success = false
        // WooCommerce rejects invalid coupons (expired, min-spend, sale-item
        // exclusion, usage limit, ...) with an HTTP 400 whose real reason is in
        // response.data.message. Axios only exposes a generic "Request failed
        // with status code 400" on error.message, so surface the upstream body.
        const wcError = error as { response?: { status?: number; data?: { message?: string } } }
        const wcMessage = wcError?.response?.data?.message
        if (wcMessage) {
            responseData.error = wcMessage
        } else if (typeof error === "string") {
            responseData.error = error
        } else if (error instanceof Error) {
            responseData.error = error.message
        }
        res.status(wcError?.response?.status ?? 500)
    }
    return res.json(responseData)
}
