import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {PayPalGooglePayConfig, PayPalWithGooglePay} from "./PayPalProvider";
import PaymentAuthorizationResult = google.payments.api.PaymentAuthorizationResult;
import PaymentData = google.payments.api.PaymentData;
import TransactionInfo = google.payments.api.TransactionInfo;
import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import CallbackIntent = google.payments.api.CallbackIntent;
import {useRouter} from "next/router";
import TotalPriceStatus = google.payments.api.TotalPriceStatus;
import {AppDispatch, RootState} from "../../redux/store";
import {useFormContext} from "react-hook-form";
import {FormFields, Totals} from "./usePayPalFormProvider";
import {getCartTotal, getOrderPayloadFromFields} from "../../utils/helpers";
import { CartItem } from "../../../@types";
import {Country} from "../../../@types/woocommerce";
import {Box} from "@mui/material";
import {destroyCart} from "../../redux/cartSlice";

type PaymentButtonProps = {
	items: CartItem[];
	askForShipping?: boolean;
	updateShippingMethod: (code: string, total: number) => FormFields["shipping_method"];
	countries: Country[];
	totals: Totals
}

const GooglePayButton = ({items, askForShipping = false, updateShippingMethod, countries, totals }: PaymentButtonProps) => {
	const googlePayConfig = useSelector((state: RootState) => state.cart.googlePayConfig);
	const { watch } = useFormContext<FormFields>()
	const fields = watch()
	const [paymentsClient, setPaymentsClient] = useState<google.payments.api.PaymentsClient>();
	const paypal = window.paypal as PayPalWithGooglePay;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const cartTotal = getCartTotal(items)

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
				body: JSON.stringify(getOrderPayloadFromFields(
					{
						...fields,
						...(askForShipping ? mapPaymentDataToOrderAddresses(paymentData) : {})
					},
					items
				)),
			}).then((res) => res.json());

			console.log(paymentData.paymentMethodData)

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

				if (!askForShipping) {
					dispatch(destroyCart(orderData));
				}
				await router.push("/checkout/completed");
				return {transactionState: "SUCCESS"};
			} else {
				return {transactionState: "ERROR"};
			}
		} catch (err: any) {
			console.error(err);
			return {
				transactionState: "ERROR",
				error: {
					message: err.message,
				},
			};
		}

	}, [askForShipping, dispatch, router, fields, items])

	useEffect(() => {
		function onPaymentDataChanged(paymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
			return new Promise(function (resolve, reject) {
				if (askForShipping && googlePayConfig) {
					if (["INITIALIZE", "SHIPPING_ADDRESS"].includes(paymentData.callbackTrigger)) {
						const shipping_method = updateShippingMethod(paymentData.shippingAddress?.countryCode ?? "IT", cartTotal)
						return {
							newTransactionInfo: getGoogleTransactionInfo(items, totals, shipping_method, googlePayConfig, askForShipping ? "ESTIMATED" : "FINAL")
						}
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

	}, [askForShipping, googlePayConfig, paymentsClient, processPayment])

	useEffect(() => {
		const onGooglePaymentButtonClicked = (paymentsClient: google.payments.api.PaymentsClient) => async () => {
			if (googlePayConfig) {
				const { isEligible, countryCode, ...config} = googlePayConfig;
				const paymentRequest = {
					...config,
					emailRequired: askForShipping,
					callbackIntents: (askForShipping ? ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION'] : ["PAYMENT_AUTHORIZATION"]) as CallbackIntent[],
					transactionInfo: getGoogleTransactionInfo(items, totals, fields.shipping_method, googlePayConfig, "FINAL"),
					...getGoogleShippingInfo(askForShipping, countries),
				}
				console.log(paymentRequest)
				await paymentsClient.loadPaymentData(paymentRequest);
			}
		}
		function addGooglePayButton(paymentsClient: google.payments.api.PaymentsClient) {
			const button = paymentsClient.createButton({
				onClick: onGooglePaymentButtonClicked(paymentsClient),
				buttonColor: "black",
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

	}, [askForShipping, googlePayConfig, paymentsClient, router.locale]);

	return <Box id="google-pay-container" sx={{width: '100%', height: "30px", "& button": {minHeight: 0}}} />
}

const getGoogleTransactionInfo = (items: CartItem[], totals: Totals, shipping_method: FormFields["shipping_method"], googlePayConfig: PayPalGooglePayConfig, status: TotalPriceStatus): TransactionInfo => ({
	displayItems: [
		...items.map((item) => ({
			label: item.name,
			type: "LINE_ITEM" as const,
			price: item.price.toString()
		})),
		{
			label: shipping_method.name,
			type: "SHIPPING_OPTION" as const,
			price: totals.shipping.toString()
		},
		...(totals.discount > 0 ? [{
			label: "Coupon discount",
			type: "DISCOUNT" as const,
			price: totals.discount.toString()
		}] : [])
	],
	currencyCode: "EUR",
	countryCode: googlePayConfig?.countryCode,
	totalPriceStatus: status,
	totalPrice: totals.total.toString(),
	totalPriceLabel: "Total",

})

const  getGoogleShippingInfo = (askForShipping: boolean, countries: Country[]): {
	shippingAddressRequired: boolean;
	shippingAddressParameters?: google.payments.api.ShippingAddressParameters;
} => {
	return {
		shippingAddressRequired: !!askForShipping,
		shippingAddressParameters: askForShipping ? {
			allowedCountryCodes: countries.map((country) => country.code),
			phoneNumberRequired: true,
		} : undefined,
	};
}

const mapPaymentDataToOrderAddresses = (paymentData: PaymentData) => {
	const [ firstName, ...lastNameArray] = paymentData.paymentMethodData.info?.billingAddress?.name?.split(" ") ?? [" ", " "]
	const lastName = lastNameArray.join(" ")
	const [ shippingFirstName, ...shippingLastNameArray] = paymentData.paymentMethodData.info?.billingAddress?.name?.split(" ") ?? [" ", " "]
	const shippingLastName = shippingLastNameArray.join(" ")
	return {
		billing: {
			company: "",
			address_1: paymentData.paymentMethodData.info?.billingAddress?.address1 ?? "",
			address_2: paymentData.paymentMethodData.info?.billingAddress?.address2 ?? "",
			city: paymentData.paymentMethodData.info?.billingAddress?.locality ?? "",
			email: paymentData.email ?? "",
			first_name: firstName,
			last_name: lastName,
			country: paymentData.paymentMethodData.info?.billingAddress?.countryCode ?? "",
			postcode: paymentData.paymentMethodData.info?.billingAddress?.postalCode ?? "",
			phone: paymentData.paymentMethodData.info?.billingAddress?.phoneNumber ?? "",
			state: paymentData.paymentMethodData.info?.billingAddress?.administrativeArea ?? ""
		},
		shipping: {
			company: "",
			address_1: paymentData.shippingAddress?.address1 ?? "",
			address_2: paymentData.shippingAddress?.address2 ?? "",
			country: paymentData.shippingAddress?.countryCode ?? "",
			state: paymentData.shippingAddress?.administrativeArea ?? "",
			city: paymentData.shippingAddress?.locality ?? "",
			postcode: paymentData.shippingAddress?.postalCode ?? "",
			first_name: shippingFirstName,
			last_name: shippingLastName,
		}
	}
}

export default GooglePayButton