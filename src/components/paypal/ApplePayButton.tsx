import React, {ElementRef, RefObject, useEffect, useRef} from "react";
import { useSelector} from "react-redux";
import {PayPalApplePayConfig, PayPalWithApplePay} from "./PayPalProvider";
import {useRouter} from "next/router";
import { RootState} from "../../redux/store";
import {CartItem} from "../../../@types";
import {Country} from "../../../@types/woocommerce";
import {FormFields, Totals} from "./usePayPalFormProvider";
import {getCartTotal, getOrderPayloadFromFields} from "../../utils/helpers";
import {useFormContext} from "react-hook-form";

type PaymentButtonProps = {
	items: CartItem[];
	askForShipping?: boolean;
	updateShippingMethod: (code: string, total: number) => FormFields["shipping_method"];
	countries: Country[];
	totals: Totals
}

const ApplePayButton = ({items, askForShipping = false, updateShippingMethod, countries, totals }: PaymentButtonProps) => {
	const applePayConfig = useSelector((state: RootState) => state.cart.applePayConfig);
	const buttonRef = useRef<ElementRef<'div'>>(null);
	const router = useRouter();
	const countryCodes = countries.map(c => c.code);
	const cartTotal = getCartTotal(items)
	const { watch } = useFormContext<FormFields>();
	const fields = watch()

	const onClick = async () => {
		if (!applePayConfig || !applePayConfig.isEligible || !window.paypal) {
			console.error("Apple Pay or PayPal not available");
			return;
		}
		const { Applepay } = window.paypal as PayPalWithApplePay;
		if (!Applepay) {
			console.error("Apple Pay not available");
			return;
		}
		const applepay = new Applepay();

		if (cartTotal === 0) {
			console.error("No cart returned from CoCart");
			return
		}
		const paymentRequest: ApplePayJS.ApplePayPaymentRequest = generatePaymentRequest(applePayConfig, items, fields, totals, askForShipping);
		let session = new window.ApplePaySession(4, paymentRequest) as ApplePaySession;

		session.onvalidatemerchant = (event) => {
			applepay
				.validateMerchant({
					validationUrl: event.validationURL,
				})
				.then((payload) => {
					session.completeMerchantValidation(payload.merchantSession);
				})
				.catch((err: any) => {
					console.error(err);
					session.abort();
				});
		};

		if (askForShipping) {
			session.onshippingcontactselected = async (event) => {
				if (!event.shippingContact.countryCode || !countryCodes.includes(event.shippingContact.countryCode)) {
					const countryError = new ApplePayError("shippingContactInvalid", "countryCode", "Shipping to the selected country is not available.");

					session.completeShippingContactSelection({
						errors: [countryError],
						newShippingMethods: [],
						newTotal: { label: "Total", amount: "0.00", type: "final" },
						newLineItems: [],
					});
				} else {
					const shipping_method = updateShippingMethod(event.shippingContact.countryCode, cartTotal)

					if (!shipping_method) {
						console.error("No shipping rates returned from CoCart");
						session.abort()
						return
					}

					session.completeShippingContactSelection({
						newShippingMethods: [{
							identifier: shipping_method.id,
							label: shipping_method.name,
							detail: "",
							amount: shipping_method.cost.toString(),
						}],
						newLineItems: getLineItems(items),
						newTotal: {
							label: "INANSTUDIO",
							amount: (cartTotal + Number(shipping_method.cost)).toString(),
						},
					})
				}
			}
		}

		session.onpaymentauthorized = async (event) => {
			try {
				/* Create Order on the Server Side */
				const orderResponse = await fetch(`/api/orders`,{
					method:'POST',
					headers : {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(getOrderPayloadFromFields(fields, items))
				})
				if(!orderResponse.ok) {
					session.completePayment({
						status: window.ApplePaySession.STATUS_FAILURE,
					});
				}

				const { id } = await orderResponse.json()
				/**
				 * Confirm Payment
				 */
				await applepay.confirmOrder({
					orderId: id,
					token: event.payment.token,
					billingContact: event.payment.billingContact ,
					shippingContact: event.payment.shippingContact
				});

				/*
				* Capture order (must currently be made on server)
				*/
				const response = await fetch(`/api/orders/${id}/capture`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					session.completePayment({
						status: window.ApplePaySession.STATUS_FAILURE,
					});
				}

				const orderData = await response.json();

				if (!orderData.success) {
					throw new Error(orderData.error);
				}
				const { wooOrder } = orderData;

				// gtagPurchase(wooOrder);
				session.completePayment({
					status: window.ApplePaySession.STATUS_SUCCESS,
				});
				if (!askForShipping) {
					// dispatch(destroyCart());
					router.push('/checkout/completed')
				}
			} catch (err) {
				console.error(err);
				session.completePayment({
					status: window.ApplePaySession.STATUS_FAILURE,
				});
			}
		};

		session.oncancel  = (e) => {
			console.error("Apple Pay Cancelled !!")
			console.error(e)
		}

		session.begin();
	}

	const updateButtonStyle = (
		button?: Element | null,
		disabled?: boolean
	): void => {
		const cursor = disabled === true ? 'not-allowed' : 'pointer';
		const opacity = disabled === true ? '0.5' : '1';
		button?.setAttribute('style', `cursor: ${cursor}; opacity: ${opacity}; height: 30px; width: 100%;`);
	};

	const createApplePayButton = (buttonRef: RefObject<HTMLDivElement>) =>
		React.createElement('apple-pay-button', {
			ref: buttonRef,
			style: {
				display: 'block',
				height: '30px',
			},
			locale: router.locale,
			type: "pay"
		})

	useEffect(() => {
		if (buttonRef.current !== null) {
			buttonRef.current.addEventListener('click', onClick);
		}

		return () => {
			if (buttonRef.current !== null) {
				buttonRef.current.removeEventListener('click', onClick);
			}
		};
	}, [onClick]);

	useEffect(() => {
		// This workaround modifies the cursor and opacity of the button. Due to the button being rendered in a Shadow DOM,
		// we face limitations with CSS and element attributes. Direct style application from the parent element,
		// or using pseudo-classes like :hover or :disabled, is not possible.
		if (
			buttonRef.current?.shadowRoot !== null ||
			buttonRef.current?.shadowRoot !== undefined
		) {
			const button = buttonRef.current?.shadowRoot?.querySelector('div > button');
			updateButtonStyle(button);
		}
	}, [buttonRef.current?.shadowRoot]);

	return (
		<>
			<style dangerouslySetInnerHTML={{__html: `
apple-pay-button {
	--apple-pay-button-width: 100%;
	--apple-pay-button-height: 25px;
	--apple-pay-button-border-radius: 0px;
	--apple-pay-button-padding: 8px 16px;
	--apple-pay-button-box-sizing: border-box;
}	
			`}} />
			{(applePayConfig?.isEligible && window.ApplePaySession) ? createApplePayButton(buttonRef) : null}
		</>
	)
}

const generatePaymentRequest = (applePayConfig: PayPalApplePayConfig, cart: CartItem[], fields: FormFields, totals: Totals, askForShipping: boolean): ApplePayJS.ApplePayPaymentRequest => {
	return {
		countryCode: applePayConfig.countryCode,
		currencyCode: applePayConfig.currencyCode,
		merchantCapabilities: applePayConfig.merchantCapabilities,
		supportedNetworks: applePayConfig.supportedNetworks,
		shippingMethods:  undefined,
		shippingType: undefined,
		shippingContactEditingMode: askForShipping ? 'available' : 'storePickup',
		billingContact: askForShipping ? undefined : {
			phoneNumber: fields.billing.phone,
			emailAddress: fields.billing.email,
			givenName: fields.billing.first_name,
			familyName: fields.billing.last_name,
			addressLines: [
				fields.billing.address_1,
				fields.billing.address_2
			],
			locality: fields.billing.city,
			administrativeArea: fields.billing.state,
			postalCode: fields.billing.postcode,
			country: fields.billing.country ?? "",
		},
		shippingContact: askForShipping ? undefined : {
			givenName: fields.shipping?.first_name ?? "",
			familyName: fields.shipping?.last_name ?? "",
			addressLines: [
				fields.shipping?.address_1 ?? "",
				fields.shipping?.address_2 ?? ""
			],
			locality: fields.shipping?.city ?? "",
			administrativeArea: fields.shipping?.state ?? "",
			postalCode: fields.shipping?.postcode ?? "",
			country: fields.shipping?.country ?? ""
		},
		requiredBillingContactFields: askForShipping ? [
			"name",
			"phone",
			"email",
			"postalAddress",
		] : [],
		requiredShippingContactFields: askForShipping ? [
			"name",
			"phone",
			"postalAddress",
		] : [],
		lineItems: getLineItems(cart),
		total: {
			label: "INANSTUDIO",
			amount: totals.total.toString(),
			type: askForShipping ? "pending" : "final",
			paymentTiming: "immediate",
		},
	}
}

const getLineItems = (cart: CartItem[]): ApplePayJS.ApplePayLineItem[] => cart.map((item) => ({
	type: "final",
	label: item.name,
	amount: item.price.toString(),
	paymentTiming: "immediate",
}))

export default ApplePayButton