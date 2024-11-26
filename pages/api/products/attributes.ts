import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	success: boolean;
	attributes?: any[]; // Replace `any[]` with a specific type if needed
	error?: string;
};

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
	consumerKey: process.env.WC_CONSUMER_KEY,
	consumerSecret: process.env.WC_CONSUMER_SECRET,
	version: "wc/v3",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const responseData: Data = {
		success: false,
	};

	try {
		const attributesWithOptions = await getAttributes();

		responseData.success = true;
		responseData.attributes = attributesWithOptions;
		res.status(200).json(responseData);
	} catch (error) {
		responseData.error = error instanceof Error ? error.message : String(error);
		res.status(500).json(responseData);
	}
}

export const getAttributes = async () => {
	const { data: attributes } = await api.get('products/attributes');
	// Fetch terms for each attribute
	return await Promise.all(
		attributes.map(async (attribute: { id: number; name: string; slug: string }) => {
			try {
				const { data: terms } = await api.get(`products/attributes/${attribute.id}/terms?per_page=100`);
				return {
					...attribute,
					options: terms, // Add terms (options) to the attribute
				};
			} catch (err) {
				// Handle error for fetching terms
				console.error(`Error fetching terms for attribute ${attribute.name}:`, err);
				return {
					...attribute,
					options: [], // If terms fail to load, return empty options
				};
			}
		})
	);
}