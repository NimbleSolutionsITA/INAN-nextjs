import React, {createContext, useContext, useState} from "react";
import {OnApproveActions, OnApproveData, PayPalCardFieldsStyleOptions} from "@paypal/paypal-js";
import {PayPalCardFieldsProvider} from "@paypal/react-paypal-js";
import {useRouter} from "next/router";
import {useMutation} from "@tanstack/react-query";
import PaymentErrorDialog from "./PaymentErrorDialog";
import {FormProvider} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import usePayPalFormProvider from "./usePayPalFormProvider";
import {getOrderPayloadFromFields, gtagPurchase} from "../../utils/helpers";
import {ShippingProps} from "../../utils/shop";
import {Country} from "../../../@types/woocommerce";
import {CartItem} from "../../../@types";
import {destroyCart} from "../../redux/cartSlice";

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
	woocommerce: ShippingProps
}


const PayPalCheckoutContext = createContext({
	createOrder: async () => { return ""},
	onApprove: async (data: OnApproveData) => {},
	onError: (error: any) => {},
	isPaying: false,
	setIsPaying: (isPaying: boolean) => {},
	getTotals: () => new Promise(resolve => resolve({ shipping: 0, tax: 0, discount: 0, total: 0, subtotal: 0 })),
	totals: { shipping: 0, tax: 0, discount: 0, total: 0, subtotal: 0 },
	getTotalsIsLoading: false,
	saveAddress: () => {},
	saveAddressIsLoading: false,
	saveAddressError: "",
	countries: [] as Country[],
	updateShippingMethod: (code: string, total: number) => ({id: "free_shipping", cost: "0", name: "Free shipping"})
});

export const PayPalCheckoutProvider = ({children, woocommerce}: PayPalProviderProps) => {
	const cart = useSelector((state: RootState) => state.cart.items);
	const { getTotals, saveAddress, updateShippingMethod, ...methods } = usePayPalFormProvider(woocommerce, cart)
	const [error, setError] = useState<string>();
	const [orderId, setOrderId] = useState<string>();
	const [isPaying, setIsPaying] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const fields = methods.watch()

	const createOrder = useMutation({
		mutationFn: async (items: CartItem[]) => {
			setOrderId(undefined);
			setIsPaying(true);
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(getOrderPayloadFromFields(fields, items)),
			});
			const orderData = await response.json();
			if (!orderData.success) {
				throw new Error(orderData.error);
			}
			setOrderId(orderData.wooId);
			return orderData.id;
		}
	})

	async function onApprove(data: OnApproveData, actions?: OnApproveActions) {
		try {
			const response = await fetch(`/api/orders/${data.orderID}/capture`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				await onError(new Error(`Server error: ${response.statusText}`));
			}
			setOrderId(undefined);

			const { wooOrder, success, error = null } = await response.json();

			if (success) {
				// empty cart
				dispatch(destroyCart());
				gtagPurchase(wooOrder);
				await router.push("/checkout/completed");
			} else {
				await onError(new Error(error ?? "An error occurred"));
			}
		} catch (error: any) {
			await onError(error);
		}
	}

	const {mutateAsync: onError} = useMutation({
		mutationFn: async (error:  Record<string, any>)=> {
			console.log(error, orderId)
			if (orderId) {
				await fetch(`/api/orders/${orderId}/abort`, {
					method: "PUT",
				});
			}
			setOrderId(undefined);
			setError(error.message ?? error.details?.[0]?.description ?? "An error occurred");
		}
	})

	const createCartOrder = async () => await createOrder.mutateAsync(cart)

	return (
		<FormProvider {...methods}>
			<PayPalCardFieldsProvider
				createOrder={createCartOrder}
				onApprove={onApprove}
				onError={onError}
				style={{
					'body': {
						'padding': '0.375rem 0'
					},
					'input': {
						'font-size': '10px',
						'font-family': "'Helvetica Neue',Helvetica,Arial,sans-serif",
						'font-weight': "300",
						'padding': '1px 0',
						'border-radius': '0',
						'border': 'none',
						'box-shadow': '0px 1px 0px rgba(0, 0, 0, 0.23)'
					},
					"input.card-field-number.display-icon": {
					"padding-left": "calc(1.2rem + 50px) !important"
					},
					":focus": {
						'box-shadow': '0px 1px 0px black',
					},
					"input:hover": {
						'box-shadow': '0px 1px 0px black',
					},
					"input.invalid": {
						'box-shadow': '0px 1px 0px #d9360b',
					},
					"input.invalid:hover": {
						'box-shadow': '0px 1px 0px black',
					},
				} as Record<string, PayPalCardFieldsStyleOptions>}
			>
				<PayPalCheckoutContext.Provider value={{createOrder: createCartOrder, onApprove, onError, isPaying, setIsPaying, ...getTotals, ...saveAddress, updateShippingMethod, countries: woocommerce.countries}}>
					{children}
				</PayPalCheckoutContext.Provider>
				<PaymentErrorDialog setError={(value) => {
					setIsPaying(false)
					setError(value)
				}} error={error} />
			</PayPalCardFieldsProvider>
		</FormProvider>
	)
}

const usePayPalCheckout = () => useContext(PayPalCheckoutContext);

export default usePayPalCheckout;