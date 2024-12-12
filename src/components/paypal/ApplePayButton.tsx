import React, {ElementRef, RefObject, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {PayPalApplePayConfig, PayPalWithApplePay} from "./PayPalProvider";
import {Cart, Shipping} from "../types/cart-type";
import {ShippingData} from "../redux/layoutSlice";
import {getCartItemPrice, getCartTotals, getIsEU, gtagPurchase} from "../utils/utils";
import {callCart, PaymentButtonProps} from "./AppleGooglePayButtons";
import {destroyCart} from "../redux/cartSlice";
import {useRouter} from "next/router";
import useAuth from "../utils/useAuth";

const ApplePayButton = ({cart: checkoutCart, shipping, invoice, customerNote, askForShipping}: PaymentButtonProps) => {
	const { applePayConfig } = useSelector((state: RootState) => state.cart);
	const { user } = useAuth();
	const buttonRef = useRef<ElementRef<'div'>>(null);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const countryCodes = shipping.countries.map(c => c.code);

	const onClick = async () => {
		if (!applePayConfig || !applePayConfig.isEligible || !window.paypal || !checkoutCart?.cart_key) {
			console.error("Apple Pay or PayPal not available");
			return;
		}
		const cartKey = checkoutCart.cart_key;
		const { Applepay } = window.paypal as PayPalWithApplePay;
		if (!Applepay) {
			console.error("Apple Pay not available");
			return;
		}
		const applepay = new Applepay();

		if (!checkoutCart || parseFloat(checkoutCart.totals.total.toString()) === 0) {
			console.error("No cart returned from CoCart");
			return
		}
		const paymentRequest: ApplePayJS.ApplePayPaymentRequest = generatePaymentRequest(applePayConfig, checkoutCart, shipping, askForShipping);
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
					const cart = await callCart(cartKey, '/v2/cart/update', "POST", { namespace: "update-customer"}, {
						first_name: event.shippingContact.givenName,
						last_name: event.shippingContact.familyName,
						state: event.shippingContact.administrativeArea,
						postcode: event.shippingContact.postalCode,
						country: event.shippingContact.countryCode,
						city: event.shippingContact.locality,
						s_first_name: event.shippingContact.givenName,
						s_last_name: event.shippingContact.familyName,
						s_state: event.shippingContact.administrativeArea,
						s_postcode: event.shippingContact.postalCode,
						s_country: event.shippingContact.countryCode,
						s_city: event.shippingContact.locality,
					})
					if (!cart.shipping?.packages.default.rates) {
						console.error("No shipping rates returned from CoCart");
						session.abort()
						return
					}

					session.completeShippingContactSelection({
						newShippingMethods: mapShippingMethods(cart.shipping),
						newLineItems: getLineItems(cart),
						newTotal: {
							label: "Bottega di Sguardi",
							amount: getCartTotals(cart).total.toString(),
						},
					})
				}
			}

			session.onshippingmethodselected = async (event) => {
				await callCart(cartKey, '/v1/shipping-methods', "POST", undefined, {
					key: event.shippingMethod.identifier
				})
				const cart = await callCart(cartKey)
				if (!cart.totals?.total) {
					console.error("No total returned from CoCart");
					session.abort()
					return
				}
				session.completeShippingMethodSelection({
					newTotal: {
						label: "Bottega di Sguardi",
						amount: getCartTotals(cart).total.toString(),
					},
				})
			}
		}

		session.onpaymentauthorized = async (event) => {
			try {
				const cart = askForShipping ? await callCart(cartKey, '/v2/cart', "GET") : checkoutCart
				/* Create Order on the Server Side */
				const orderResponse = await fetch(`/api/orders`,{
					method:'POST',
					headers : {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ cart, customerNote, invoice, customerId: user?.user_id, paymentMethod: 'PayPal - ApplePay' })
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

				gtagPurchase(wooOrder);
				session.completePayment({
					status: window.ApplePaySession.STATUS_SUCCESS,
				});
				if (!askForShipping) {
					dispatch(destroyCart());
					router.push('/checkout/completed')
				}
			} catch (err) {
				console.error(err);
				session.completePayment({
					status: window.ApplePaySession.STATUS_FAILURE,
				});
			}
		};

		session.oncancel  = () => {
			console.error("Apple Pay Cancelled !!")
		}

		session.begin();
	}

	const updateButtonStyle = (
		button?: Element | null,
		disabled?: boolean
	): void => {
		const cursor = disabled === true ? 'not-allowed' : 'pointer';
		const opacity = disabled === true ? '0.5' : '1';
		button?.setAttribute('style', `cursor: ${cursor}; opacity: ${opacity}; height: 48px; width: 100%;`);
	};

	const createApplePayButton = (buttonRef: RefObject<HTMLDivElement>) =>
		React.createElement('apple-pay-button', {
			ref: buttonRef,
			style: {
				display: 'block',
				height: '48px',
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
	--apple-pay-button-height: 48px;
	--apple-pay-button-border-radius: 0px;
	--apple-pay-button-padding: 8px 16px;
	--apple-pay-button-box-sizing: border-box;
}			
			`}} />
			{(applePayConfig?.isEligible && window.ApplePaySession) ? createApplePayButton(buttonRef) : null}
		</>
	)
}

const mapShippingMethods = (shipping: Shipping) => Object.values(shipping.packages.default.rates).map((rate) => ({
	identifier: rate.key,
	label: rate.label,
	detail: rate.html,
	amount: (Number(rate.cost) / 100).toString(),
}))

const generatePaymentRequest = (applePayConfig: PayPalApplePayConfig, cart: Cart, shipping: ShippingData, askForShipping: boolean): ApplePayJS.ApplePayPaymentRequest => {
	const totals = getCartTotals(cart)
	return {
		countryCode: applePayConfig.countryCode,
		currencyCode: applePayConfig.currencyCode,
		merchantCapabilities: applePayConfig.merchantCapabilities,
		supportedNetworks: applePayConfig.supportedNetworks,
		shippingMethods:  (askForShipping && cart.shipping) ? mapShippingMethods(cart.shipping) : undefined,
		shippingType: undefined,
		shippingContactEditingMode: askForShipping ? 'available' : 'storePickup',
		billingContact: askForShipping ? undefined : {
			phoneNumber: cart.customer.billing_address.billing_phone,
			emailAddress: cart.customer.billing_address.billing_email,
			givenName: cart.customer.billing_address.billing_first_name,
			familyName: cart.customer.billing_address.billing_last_name,
			addressLines: [
				cart.customer.billing_address.billing_address_1,
				cart.customer.billing_address.billing_address_2
			],
			locality: cart.customer.billing_address.billing_city,
			administrativeArea: cart.customer.billing_address.billing_state,
			postalCode: cart.customer.billing_address.billing_postcode,
			country: cart.customer.billing_address.billing_country,
		},
		shippingContact: askForShipping ? undefined : {
			givenName: cart.customer.shipping_address.shipping_first_name,
			familyName: cart.customer.shipping_address.shipping_last_name,
			addressLines: [
				cart.customer.shipping_address.shipping_address_1,
				cart.customer.shipping_address.shipping_address_2
			],
			locality: cart.customer.shipping_address.shipping_city,
			administrativeArea: cart.customer.shipping_address.shipping_state,
			postalCode: cart.customer.shipping_address.shipping_postcode,
			country: cart.customer.shipping_address.shipping_country
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
			label: "Bottega di Sguardi",
			amount: totals.total.toString(),
			type: askForShipping ? "pending" : "final",
			paymentTiming: "immediate",
		},
	}
}

const getLineItems = (cart: Cart): ApplePayJS.ApplePayLineItem[] => cart.items.map((item) => ({
	type: "final",
	label: item.name,
	amount: getCartItemPrice(item, getIsEU(cart.customer)).toString(),
	paymentTiming: "immediate",
}))

export default ApplePayButton