import type { NextApiRequest, NextApiResponse } from 'next';
import { Product, Variation } from "../../../@types/woocommerce";
import { mapProd, ShopProduct, variablePriceFields } from "../../../src/utils/products";

type Data = {
    success: boolean;
    products?: Product[];
    error?: string;
};

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3"
});

const generateAuthHeader = () => {
    const key = process.env.WC_CONSUMER_KEY;
    const secret = process.env.WC_CONSUMER_SECRET;
    const credentials = `${key}:${secret}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const responseData: Data = {
        success: false,
    };

    const {
        per_page,
        page,
        categories,
        include,
        stock_status,
        pa_color,
        pa_size,
        "pa_leather-type": leather_type, // Added leather_type filter
        status = 'publish',
        name
    } = req.query;

    try {
        // Construct query string for the WooCommerce endpoint
        let query: Record<string, any> = {
            per_page: per_page || 9,
            page: page || 1,
            stock_status,
            status,
            include,
            name,
            categories: Array.isArray(categories) ? categories.join(',') : categories,
            pa_color: Array.isArray(pa_color) ? pa_color.join(',') : pa_color,
            "pa_leather-type": Array.isArray(leather_type) ? leather_type.join(',') : leather_type,
            pa_size: Array.isArray(pa_size) ? pa_size.join(',') : pa_size
        };

        // remove undefined values
        Object.keys(query).forEach((key) => query[key] === undefined && delete query[key]);

        const queryString = new URLSearchParams(query).toString();

        // Fetch data from WooCommerce
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nimble/v1/products?${queryString}`,
            {
                method: 'GET',
                headers: {
                    Authorization: generateAuthHeader(),
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();

        // The custom nimble endpoint doesn't reliably return the schedule-aware
        // sale fields (on_sale / regular_price), so the grid couldn't show the
        // struck-out regular price next to the discounted one. Enrich each
        // product with the authoritative price fields from wc/v3 (the same
        // source the product page uses) in a single batched request.
        const priceById: Record<number, Partial<Product>> = {};
        const ids = (Array.isArray(data) ? data : [])
            .map((product: Product) => product.id)
            .filter(Boolean);
        if (ids.length) {
            try {
                const { data: authoritative }: { data: Product[] } = await api.get('products', {
                    include: ids.join(','),
                    per_page: ids.length,
                    status,
                });
                authoritative.forEach((product) => {
                    priceById[product.id] = {
                        price: product.price,
                        regular_price: product.regular_price,
                        sale_price: product.sale_price,
                        on_sale: product.on_sale,
                    };
                });
            } catch {
                // fall back to the nimble price fields if the batch lookup fails
            }
        }

        // Map the response products
        responseData.success = true;
        responseData.products = await Promise.all(
            data.map((product: ShopProduct) => mapProduct({ ...product, ...priceById[product.id] }))
        );
        res.json(responseData);
    } catch (error) {
        responseData.error = error instanceof Error ? error.message : String(error);
        res.status(500).json(responseData);
    }
}

// Map product utility function
const mapProduct = async (product: ShopProduct) => {
    let stockStatus: {
        manage_stock: ShopProduct['manage_stock'];
        stock_quantity: ShopProduct['stock_quantity'];
        stock_status: ShopProduct['stock_status'];
    } = {
        manage_stock: product.manage_stock,
        stock_quantity: product.stock_quantity || 0,
        stock_status: product.stock_status,
    };

    let priceFields: Partial<ShopProduct> = {};
    const needsStock = product.type === 'variable' && !product.manage_stock;
    const needsPrice = product.type === 'variable' && product.on_sale && !product.regular_price;
    if (needsStock || needsPrice) {
        const { data }: { data: Variation[] } = await api.get(`products/${product.id}/variations`);
        if (data.length > 0 && needsStock) {
            const variation = data.find(p => p.manage_stock && p.stock_status === 'instock') ?? data[0] ?? false;
            if (variation) {
                stockStatus = {
                    manage_stock: variation.manage_stock,
                    stock_quantity: variation.stock_quantity,
                    stock_status: variation.stock_status,
                };
            }
        }
        priceFields = variablePriceFields(product, data);
    }
    return mapProd({ ...product, ...stockStatus, ...priceFields });
};

