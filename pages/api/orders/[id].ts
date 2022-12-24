// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Order} from "../../../@types/woocommerce";


type Data = {
  success: boolean
  error?: string
  order?: Order
}

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  const responseData: Data = {
    success: false,
  }
  const endpoint = `orders/${req.query.id}`
  try {
    const {data} = req.method === 'PUT' ?
        await api.post(
            endpoint,
            req.body
        ) :
        req.method === 'DELETE' &&
          await api.delete(endpoint)

    responseData.order = data
    responseData.success = true
    res.json(responseData)
  } catch (error) {
    if (typeof error === "string") {
      responseData.error = error
    } else if (error instanceof Error) {
      responseData.error = error.message
    }
    res.status(500).json(responseData)
  }
}