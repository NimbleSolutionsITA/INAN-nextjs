// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Product} from "../../../@types/woocommerce";
import {mapProduct} from "../../../src/utils/products";


type Data = {
  success: boolean
  products?: Product[]
  error?: string
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
  const { per_page, page, category, include } = req?.query ?? {};
  try {
    const { data } = await api.get(
        'products',
        {
          status: 'publish',
          per_page: per_page || 10,
          page: page || 1,
          include
        }
    )
    responseData.success = true
    responseData.products = data.map(mapProduct)
    console.log(req?.query, responseData)
    res.json(responseData)
  }
  catch ( error ) {
    if (typeof error === "string") {
      responseData.error = error
    } else if (error instanceof Error) {
      responseData.error = error.message
    }
    res.status(500).json(responseData)
  }
}