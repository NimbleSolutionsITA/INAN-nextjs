// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Product, Variation} from "../../../@types/woocommerce";
import {getProductVariations, mapProd, ShopProduct} from "../../../src/utils/products";


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
  const { per_page, page, category, include, stock_status, status = 'publish' } = req?.query ?? {};
  try {
    const { data } = await api.get(
        'products',
        {
          status,
          per_page: per_page || 10,
          page: page || 1,
          include,
          category,
          stock_status,
        }
    )
    responseData.success = true
    responseData.products = await Promise.all(data.map(mapProduct))
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

const mapProduct = async (product: ShopProduct) => {
    let stockStatus: {
        manage_stock: ShopProduct['manage_stock'],
        stock_quantity: ShopProduct['stock_quantity'],
        stock_status: ShopProduct['stock_status'],
    } = {
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity || 0,
        stock_status: product.stock_status,
    }
    if (product.type === 'variable' && !product.manage_stock) {
        const {data}: {data: Variation[]} =  await api.get(`products/${product.id}/variations`)
        if (data.length > 0) {
            const variation = data.find(p => p.manage_stock && p.stock_status === 'instock') ?? data[0] ?? false
            if (variation) {
                stockStatus = {
                    manage_stock: variation.manage_stock,
                    stock_quantity: variation.stock_quantity,
                    stock_status: variation.stock_status,
                }
            }
        }
    }
    return mapProd({...product, ...stockStatus})
}