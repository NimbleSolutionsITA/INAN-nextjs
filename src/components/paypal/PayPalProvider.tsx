import {PayPalScriptProvider, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import Script from "next/script";
import {PayPalNamespace} from "@paypal/paypal-js";
import ApplePayPaymentToken = ApplePayJS.ApplePayPaymentToken;
import ApplePayMerchantCapability = ApplePayJS.ApplePayMerchantCapability;
import MerchantInfo = google.payments.api.MerchantInfo;
import PaymentMethodSpecification = google.payments.api.PaymentMethodSpecification;
import {AppDispatch} from "../../redux/store";
import {setApplePayConfig, setGooglePayConfig} from "../../redux/cartSlice";

export type PayPalGooglePayConfig = {
	allowedPaymentMethods: PaymentMethodSpecification[]
	merchantInfo: MerchantInfo
	apiVersion: number
	apiVersionMinor: number
	isEligible: boolean
	countryCode: string
}

export type PayPalApplePayConfig = {
	countryCode: string
	currencyCode: string
	isEligible: boolean
	merchantCapabilities: ApplePayMerchantCapability[]
	merchantCountry: string
	supportedNetworks: string[]
	tokenNotificationURL: string
}

interface ValidateMerchantPayload {
	validationUrl: string,
	displayName?: string
}
interface ValidateMerchantResult {
	merchantSession: any
}
interface ConfirmOrderPayloadGooglePay {
	orderId: string,
	paymentMethodData: google.payments.api.PaymentMethodData
}
interface ConfirmOrderPayload {
	orderId: string,
	token: ApplePayPaymentToken,
	billingContact: any,
	shippingContact: any
}
interface ConfirmOrderResponse {
	id: string
	status: string
	payment_source: {

	}
}
interface ApplePayInstance {
	config: () => Promise<PayPalApplePayConfig>;
	validateMerchant: (options: ValidateMerchantPayload) => Promise<ValidateMerchantResult>;
	confirmOrder: (options: ConfirmOrderPayload) => Promise<ConfirmOrderResponse>;
}

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
}

interface ApplePayConstructor {
	new (): ApplePayInstance;
}

interface GooglePayInstance {
	config: () => Promise<PayPalGooglePayConfig>;
	validateMerchant: (options: ValidateMerchantPayload) => Promise<ValidateMerchantResult>;
	confirmOrder: (options: ConfirmOrderPayloadGooglePay) => Promise<ConfirmOrderResponse>;
}

interface GooglePayConstructor {
	new (): GooglePayInstance;
}

export type PayPalWithApplePay = PayPalNamespace & {
	Applepay?: ApplePayConstructor;
};

export type PayPalWithGooglePay = PayPalNamespace & {
	Googlepay?: GooglePayConstructor;
};

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const PayPalProvider = ({ children }: PayPalProviderProps) => {
	return PAYPAL_CLIENT_ID ? (
		<PayPalScriptProvider options={{
			clientId: PAYPAL_CLIENT_ID,
			components: "buttons,applepay,googlepay,card-fields,messages",
			currency: "EUR",
			locale: "en_US"
		}}>
			<PayPalApplePayConfig/>
			<PayPalGooglePayConfig />
			{children}
		</PayPalScriptProvider>
	) : <div>Missing PAYPAL CLIENT ID variable</div>;
}

const PayPalGooglePayConfig = () => {
	const [{ isResolved }] = usePayPalScriptReducer();
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const paypal = window.paypal as PayPalWithGooglePay;
		if (isResolved && paypal && paypal.Googlepay) {
			const googlepay = new paypal.Googlepay();
			googlepay.config().then((config) => {
				dispatch(setGooglePayConfig(config))
			})
		}
	}, [dispatch, isResolved]);

	return <Script src="https://pay.google.com/gp/p/js/pay.js" />;
}

const PayPalApplePayConfig = () => {
	const [{ isResolved }] = usePayPalScriptReducer();
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const paypal = window.paypal as PayPalWithApplePay;
		if (isResolved && paypal && paypal.Applepay) {
			const applepay = new paypal.Applepay();
			applepay.config().then((config) => {
				dispatch(setApplePayConfig(config))
			})
		}
	}, [dispatch, isResolved]);

	return <Script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js" />
}

export default PayPalProvider;