import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../../src/utils/endpoints";
import {generateAccessToken} from "../index";

const base = process.env.PAYPAL_API_URL;

export type CreateOrderResponse = {
	success: boolean
	error?: string
	wooOrder?: any
}

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
		wooOrder: null,
	}
	try {
		if (req.method === 'POST') {
			const paypalOrderId = req.query.id as string;
			if (!paypalOrderId) {
				throw new Error('Paypal Order ID is missing')
			}
			const captureData = await captureOrder(paypalOrderId)
			const purchaseUnit = captureData?.purchase_units?.[0]
			const capture = purchaseUnit?.payments?.captures?.[0]
			const wooOrderId = purchaseUnit?.reference_id

			if (wooOrderId && capture?.status === 'COMPLETED') {
				const { data: order} = await api.put(`orders/${wooOrderId}`, {
					set_paid: true,
					transaction_id: paypalOrderId,
					payment_data: [
						{ key: "ppcp_paypal_order_id", value: paypalOrderId },
						{ key: "ppcp_billing_token", value: "" },
						{ key: "wc-ppcp-new-payment-method", value: false }
					]
				})
				responseData.success = true
				responseData.wooOrder = order
			} else {
				if (wooOrderId) {
					await api.put(`orders/${wooOrderId}`, {
						status: 'failed'
					})
				}
				responseData.error = captureData.details?.[0]?.description ?? (capture ?
					`Transaction ${capture.status}: ${capture.id}` :
					'Payment capture was not successful.');
			}
		}
	} catch (error) {
		console.error(error)
		responseData.success = false
		if (typeof error === "string") {
			responseData.error = error
		} else if (error instanceof Error) {
			responseData.error = error.message
		}
		res.status(500)
	}
	return res.json(responseData)
}

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: string) => {
	const accessToken = await generateAccessToken();

	const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to capture order: ${response.statusText}`);
	}

	return await response.json();
};