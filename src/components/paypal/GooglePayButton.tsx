import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {PayPalWithGooglePay} from "./PayPalProvider";
import PaymentAuthorizationResult = google.payments.api.PaymentAuthorizationResult;
import PaymentData = google.payments.api.PaymentData;
import {callCart, PaymentButtonProps} from "./AppleGooglePayButtons";
import TransactionInfo = google.payments.api.TransactionInfo;
import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import {Cart, Customer, Package} from "../types/cart-type";
import {CartState, destroyCart} from "../redux/cartSlice";
import {Country} from "../types/woocommerce";
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import CallbackIntent = google.payments.api.CallbackIntent;
import {useRouter} from "next/router";
import {getCartItemPrice, getCartTotals, getIsEU, gtagPurchase} from "../utils/utils";
import TotalPriceStatus = google.payments.api.TotalPriceStatus;
import useAuth from "../utils/useAuth";

const GooglePayButton = ({cart, shipping, invoice, customerNote, askForShipping}: PaymentButtonProps) => {
	const { googlePayConfig } = useSelector((state: RootState) => state.cart);
	const { user } = useAuth();
	const [paymentsClient, setPaymentsClient] = useState<google.payments.api.PaymentsClient>();
	const paypal = window.paypal as PayPalWithGooglePay;
	const cartKey = cart.cart_key;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const processPayment = useCallback(async (paymentData: PaymentData) => {
		try {
			if (!paypal.Googlepay) {
				throw new Error("Google Pay not available");
			}
			const googlePay = new paypal.Googlepay();
			/* Create Order */
			const {id} = await fetch(`/api/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cart: {
						...cart,
						customer: askForShipping ? mapPaymentDataToCartCustomer(paymentData) : cart.customer
					},
					invoice,
					customerNote,
					customerId: user?.user_id,
					paymentMethod: "PayPal - GooglePay",
				}),
			}).then((res) => res.json());

			const {status} = await googlePay.confirmOrder({
				orderId: id,
				paymentMethodData: paymentData.paymentMethodData,
			});

			if (status === "APPROVED") {
				/* Capture the Order */
				const response = await fetch(`/api/orders/${id}/capture`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					return {
						transactionState: "ERROR",
						error: {
							message: `Server error: ${response.statusText}`
						},
					};
				}

				const orderData = await response.json();

				if (!orderData.success) {
					return {
						transactionState: "ERROR",
						error: {
							message: orderData.error ?? `Server error: ${response.statusText}`
						},
					};
				}
				const { wooOrder } = orderData;

				gtagPurchase(wooOrder);
				if (!askForShipping) {
					dispatch(destroyCart());
				}
				router.push('/checkout/completed')
				return {transactionState: "SUCCESS"};
			} else {
				return {transactionState: "ERROR"};
			}
		} catch (err: any) {
			return {
				transactionState: "ERROR",
				error: {
					message: err.message,
				},
			};
		}

	}, [askForShipping, cart, customerNote, dispatch, invoice, paypal.Googlepay, router, user?.user_id])

	useEffect(() => {
		function onPaymentDataChanged(paymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
			const getResponse = async () => {
				const updatedCart = await callCart(cartKey)
				if (!updatedCart.totals?.total || !updatedCart.shipping?.packages.default) {
					console.error("No total returned from CoCart");
					throw new Error("No total returned from CoCart");
				}
				return {
					newTransactionInfo: getGoogleTransactionInfo(updatedCart, googlePayConfig, askForShipping ? "ESTIMATED" : "FINAL"),
					newShippingOptionParameters: getShippingOptionParameters(updatedCart.shipping.packages.default),
				}
			}
			return new Promise(function (resolve, reject) {
				if (askForShipping) {
					if (["INITIALIZE", "SHIPPING_ADDRESS"].includes(paymentData.callbackTrigger)) {
						callCart(cartKey, '/v2/cart/update', "POST", { namespace: "update-customer"}, {
							state: paymentData.shippingAddress?.administrativeArea,
							postcode: paymentData.shippingAddress?.postalCode,
							country: paymentData.shippingAddress?.countryCode,
							city: paymentData.shippingAddress?.locality,
							s_state: paymentData.shippingAddress?.administrativeArea,
							s_postcode: paymentData.shippingAddress?.postalCode,
							s_country: paymentData.shippingAddress?.countryCode,
							s_city: paymentData.shippingAddress?.locality,
						}).then(() => {
							getResponse().then((data) => {
								resolve(data)
							}).catch(reject)
						})
					}
					else if (paymentData.callbackTrigger === "SHIPPING_OPTION") {
						callCart(cartKey, '/v1/shipping-methods', "POST", undefined, {
							key: paymentData.shippingOptionData?.id
						}).then(() => {
							getResponse().then((data) => {
								resolve(data)
							}).catch(reject)
						})
					}
				}
				else {
					resolve({})
				}
			});
		}
		function onPaymentAuthorized(paymentData: PaymentData): Promise<PaymentAuthorizationResult> {
			return new Promise(function (resolve, reject) {
				processPayment(paymentData)
					.then(function (data) {
						resolve({ transactionState: "SUCCESS" });
					})
					.catch(function (errDetails) {
						resolve({ transactionState: "ERROR" });
					});
			});
		}
		function getGooglePaymentsClient() {
			if (paymentsClient) {
				return paymentsClient;
			}
			const paymentsClientObject = new google.payments.api.PaymentsClient({
				environment: process.env.NEXT_PUBLIC_ENV === "prod" ? 'PRODUCTION' : 'TEST',
				paymentDataCallbacks: {
					onPaymentAuthorized,
					onPaymentDataChanged: askForShipping ? onPaymentDataChanged : undefined,
				},
			});
			setPaymentsClient(paymentsClientObject)
			return paymentsClientObject;
		}
		if (googlePayConfig && !paymentsClient) {
			getGooglePaymentsClient();
		}

	}, [askForShipping, cartKey, googlePayConfig, paymentsClient, processPayment])

	useEffect(() => {
		const onGooglePaymentButtonClicked = (paymentsClient: google.payments.api.PaymentsClient) => async () => {
			if (googlePayConfig && cart.shipping) {
				const { isEligible, countryCode, ...config} = googlePayConfig;
				const paymentRequest = {
					...config,
					emailRequired: askForShipping,
					callbackIntents: (askForShipping ? ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION'] : ["PAYMENT_AUTHORIZATION"]) as CallbackIntent[],
					transactionInfo: getGoogleTransactionInfo(cart, googlePayConfig, "FINAL"),
					...getGoogleShippingInfo(cart.shipping?.packages.default, askForShipping, shipping.countries),
				}
				await paymentsClient.loadPaymentData(paymentRequest);
			}
		}
		function addGooglePayButton(paymentsClient: google.payments.api.PaymentsClient) {
			const button = paymentsClient.createButton({
				onClick: onGooglePaymentButtonClicked(paymentsClient),
				buttonSizeMode: "fill",
				buttonType: "pay",
				buttonRadius: 0,
				buttonLocale: router.locale,
			});
			const element = document.getElementById("google-pay-container")
			if (element) {
				element.innerHTML = "";
				element.appendChild(button);
			}
		}
		if (!googlePayConfig || !paymentsClient) { return }
		const { allowedPaymentMethods, apiVersion, apiVersionMinor } = googlePayConfig;
		paymentsClient
			.isReadyToPay({ allowedPaymentMethods, apiVersion, apiVersionMinor })
			.then(function (response) {
				if (response.result) {
					addGooglePayButton(paymentsClient);
				}
			})
			.catch(function (err) {
				console.error(err);
			});

	}, [askForShipping, cart, googlePayConfig, paymentsClient, router.locale, shipping.countries]);

	return <div id="google-pay-container" style={{width: '100%', height: "47px"}} />
}

const getGoogleTransactionInfo = (cart: Cart, googlePayConfig: CartState['googlePayConfig'], status: TotalPriceStatus): TransactionInfo => ({
	displayItems: [
		...cart.items.map((item) => ({
			label: item.name,
			type: "LINE_ITEM" as const,
			price: getCartItemPrice(item, getIsEU(cart.customer)).toString()
		})),
		{
			label: cart.shipping?.packages.default.package_name ?? "Shipping",
			type: "SHIPPING_OPTION" as const,
			price: (Number(cart.totals.shipping_total) / 100).toString(),
		},
		{
			label: "Tax",
			type: "LINE_ITEM" as const,
			price: (Number(cart.totals.total_tax) / 100).toString(),
		},
	],
	currencyCode: "EUR",
	countryCode: googlePayConfig?.countryCode,
	totalPriceStatus: status,
	totalPrice: getCartTotals(cart).total.toString(),
	totalPriceLabel: "Total",

})

const  getGoogleShippingInfo = (shippingPackage: Package, askForShipping: boolean, countries: Country[]): {
	shippingAddressRequired: boolean;
	shippingAddressParameters?: google.payments.api.ShippingAddressParameters;
	shippingOptionRequired: boolean;
	shippingOptionParameters?: google.payments.api.ShippingOptionParameters;
} => {
	return {
		shippingAddressRequired: !!askForShipping,
		shippingAddressParameters: askForShipping ? {
			allowedCountryCodes: countries.map((country) => country.code),
			phoneNumberRequired: true,
		} : undefined,
		shippingOptionRequired: !!askForShipping,
		shippingOptionParameters: askForShipping ? getShippingOptionParameters(shippingPackage) : undefined,
	};
}

const getShippingOptionParameters = (shippingPackage: Package) => ({
	defaultSelectedOptionId: shippingPackage.chosen_method,
	shippingOptions: Object.values(shippingPackage.rates ?? {})?.map((rate) => ({
		id: rate.key,
		label: rate.label,
		description: rate.html,
	})),
})

const mapPaymentDataToCartCustomer = (paymentData: PaymentData): Customer => {
	const [ firstName, ...lastNameArray] = paymentData.paymentMethodData.info?.billingAddress?.name?.split(" ") ?? [" ", " "]
	const lastName = lastNameArray.join(" ")
	const [ shippingFirstName, ...shippingLastNameArray] = paymentData.paymentMethodData.info?.billingAddress?.name?.split(" ") ?? [" ", " "]
	const shippingLastName = shippingLastNameArray.join(" ")
	return {
		billing_address: {
			billing_company: "",
			billing_address_1: paymentData.paymentMethodData.info?.billingAddress?.address1 ?? "",
			billing_address_2: paymentData.paymentMethodData.info?.billingAddress?.address2 ?? "",
			billing_city: paymentData.paymentMethodData.info?.billingAddress?.locality ?? "",
			billing_email: paymentData.email ?? "",
			billing_first_name: firstName,
			billing_last_name: lastName,
			billing_country: paymentData.paymentMethodData.info?.billingAddress?.countryCode ?? "",
			billing_postcode: paymentData.paymentMethodData.info?.billingAddress?.postalCode ?? "",
			billing_phone: paymentData.paymentMethodData.info?.billingAddress?.phoneNumber ?? "",
			billing_state: paymentData.paymentMethodData.info?.billingAddress?.administrativeArea ?? ""
		},
		shipping_address: {
			shipping_company: "",
			shipping_address_1: paymentData.shippingAddress?.address1 ?? "",
			shipping_address_2: paymentData.shippingAddress?.address2 ?? "",
			shipping_country: paymentData.shippingAddress?.countryCode ?? "",
			shipping_state: paymentData.shippingAddress?.administrativeArea ?? "",
			shipping_city: paymentData.shippingAddress?.locality ?? "",
			shipping_postcode: paymentData.shippingAddress?.postalCode ?? "",
			shipping_first_name: shippingFirstName,
			shipping_last_name: shippingLastName,
		}
	}
}

export default GooglePayButton