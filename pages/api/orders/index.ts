import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {Order} from "../../../@types/woocommerce";

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

export type CreateOrderResponse = {
	success: boolean
	id?: string
	error?: string
	wooId?: number
}

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
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
	}
	try {
		if (req.method === 'POST') {
			const { order: orderRequest, paymentMethod }: {order: Order, paymentMethod: string} = req.body

			if (!orderRequest) {
				throw new Error('Order data is missing')
			}
			const cartAmount = Number(orderRequest.total) / 100
			if (cartAmount === 0) {
				throw new Error('Cart amount is 0')
			}
			// const orderPayload = await prepareOrderPayload(cart, invoice, customerNote, customerId, paymentMethod)
			const { data: order } = await api.post("orders", orderRequest)
			responseData.wooId = order.id
			const amount = Number(order.total)
			if (amount === 0) {
				await api.delete(`/api/orders/${order.id}`, { force: true })
				throw new Error('Order amount is 0')
			}
			console.log('ORDER', amount, "CART", orderRequest.total)
			const paypalOrder = await createOrder(order, paymentMethod)
			responseData.id = paypalOrder.id

			responseData.success = true
			return res.json(responseData)
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
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (order: Order, paymentMethod: string) => {
	const { billing, shipping, line_items, id, total, shipping_lines, shipping_total, discount_total, shipping_tax, discount_tax } = order
	const accessToken = await generateAccessToken();
	const requiredFields = [
		'first_name',
		'last_name',
		'address_1',
		'city',
		'country',
		'postcode'
	] as const;
	const shippingAddress = requiredFields.every(field => shipping[field]) ? shipping : billing;
	const discountTotal = Number(discount_total) + Number(discount_tax);
	const shippingTotal = Number(shipping_total) + Number(shipping_tax);
	const itemTotal = Number(order.total) - shippingTotal + discountTotal;
	const payload = {
		intent: "CAPTURE",
		purchase_units: [
			{
				reference_id: id,
				amount: {
					currency_code: "EUR",
					value: total,
					breakdown: {
						item_total: {
							currency_code: "EUR",
							value: itemTotal + "",
						},
						shipping: {
							currency_code: "EUR",
							value: shippingTotal + "",
						},
						discount: {
							currency_code: "EUR",
							value: discountTotal + "",
						}
					}
				},
				items: line_items.map((item) => ({
					name: item.name,
					sku: item.sku,
					unit_amount: {
						currency_code: "EUR",
						value: (Number(item.subtotal) + Number(item.subtotal_tax)) + "",
					},
					quantity: item.quantity + ""

				})),
				shipping: {
					type: shipping_lines[0].method_id === "local_pickup" ? "PICKUP_IN_STORE" : "SHIPPING",
					name: {
						full_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
					},
					email_address: billing.email,
					address: {
						address_line_1: shippingAddress.address_1,
						address_line_2: shippingAddress.address_2,
						admin_area_2: shippingAddress.city,
						admin_area_1: shippingAddress.state,
						postal_code: shippingAddress.postcode,
						country_code: shippingAddress.country
					}
				}
			},
		],
		...(["PayPal", "PayPal - carta di credito"].includes(paymentMethod) ? {
			payment_source: paymentMethod === "PayPal" ? {
				paypal: {
					experience_context: {
						brand_name: "Bottega di Sguardi",
						shipping_preference: "SET_PROVIDED_ADDRESS",
						user_action: "PAY_NOW"
					}
				}
			} : {
				card: {
					attributes: {
						customer: {
							email_address: billing.email,
						}
					}
				}
			}
		} : {})
	};
	console.log(payload.payment_source)
	const response = await fetch(`${base}/v2/checkout/orders`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
		method: "POST",
		body: JSON.stringify(payload),
	});

	return await response.json();
};

const prepareOrderPayload = async (cart: any, invoice?: any, customerNote?: string, customerId?: string, paymentMethod: string = "PayPal") => {
	const selectedShipping = cart.shipping?.packages.default.rates[cart.shipping.packages.default.chosen_method]

	return ({
		customer_id: customerId,
		currency: "EUR",
		payment_method: 'ppcp-gateway',
		payment_method_title: paymentMethod,
		billing: mapAddress(cart.customer.billing_address, 'billing'),
		shipping: mapAddress(cart.customer.shipping_address, 'shipping'),
		line_items: await Promise.all(cart.items.map(prepareOrderLineItem(api))),
		shipping_lines: [
			{
				method_id: selectedShipping?.method_id,
				method_title: selectedShipping?.label,
				total: (Number(selectedShipping?.cost) / 1.22 / 100) + '',
			}
		],
		coupon_lines:  cart.coupons?.[0] ? [{ code: cart.coupons[0].coupon ?? '' }] : [],
		customer_note: customerNote,
		meta_data: invoice ? [
			{ key: '_billing_choice_type', value: invoice.billingChoice ?? "receipt" },
			{ key: '_billing_invoice_type', value: invoice.invoiceType ?? "private" },
			{ key: '_billing_sdi_type', value: invoice.sdi ?? "" },
			{ key: '_billing_vat_number', value: invoice.vat ?? "" },
			{ key: '_billing_tax_code', value: (!invoice.tax || invoice.tax === "") ?
					(cart.customer.billing_address.billing_country === 'IT' ?
						"" :
						`${cart.customer.billing_address.billing_first_name}${cart.customer.billing_address.billing_last_name}`.slice(0,11).toUpperCase().padEnd(11, '0')) :
					invoice.tax
			},
		] : []
	})
}

const mapAddress = (address: any, type: 'billing' | 'shipping') =>
	Object.fromEntries(Object.entries(address).map(([key, value]) => [key.replace(`${type}_`, ''), value]))

const prepareOrderLineItem = (api: any) => async (item: any) => {
	const {data: product} = await api.get("products/" + item.id)
	const itemPrice = product.price
	const total = ((Number(itemPrice) * item.quantity.value) / 1.22) + ''
	return {
		product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
		variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
		quantity: item.quantity.value,
		total,
	}
}

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
export const generateAccessToken = async () => {
	try {
		if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
			throw new Error("MISSING_API_CREDENTIALS");
		}
		const auth = Buffer.from(
			PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
		).toString("base64");
		const response = await fetch(`${base}/v1/oauth2/token`, {
			method: "POST",
			body: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Failed to generate Access Token:", error);
	}
};