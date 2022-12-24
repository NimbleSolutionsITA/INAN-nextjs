// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Customer, Order} from "../../../@types/woocommerce";

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
  if (req.method === 'POST') {
    const responseData: Data = {
      success: false,
    }

    try {
      const { data } = await api.post(
          'orders',
          req.body
      )
      responseData.order = data
      responseData.success = true
      res.json(responseData)
    }
    catch ( error ) {
      console.log(error)
      if (typeof error === "string") {
        responseData.error = error
      } else if (error instanceof Error) {
        responseData.error = error.message
      }
      res.status(500).json(responseData)
    }
  }

}