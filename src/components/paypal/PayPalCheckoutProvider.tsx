import React, {createContext, useContext, useEffect, useState} from "react";
import {OnApproveActions, OnApproveData, PayPalCardFieldsStyleOptions} from "@paypal/paypal-js";
import {PayPalCardFieldsProvider} from "@paypal/react-paypal-js";
import {ShippingData} from "../redux/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {useFormContext} from "react-hook-form";
import {gtagPurchase} from "../utils/utils";
import {useRouter} from "next/router";
import {destroyCart} from "../redux/cartSlice";
import useAuth from "../utils/useAuth";
import PaymentErrorDialog from "../pages/checkout/PaymentErrorDialog";
import {useMutation} from "@tanstack/react-query";

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
	shipping: ShippingData
}


const PayPalCheckoutContext = createContext({
	createOrder: async () => { return ""},
	onApprove: async (data: OnApproveData) => {},
	onError: (error: any) => {},
	shipping: {} as ShippingData,
	isPaying: false,
	setIsPaying: (isPaying: boolean) => {},
});

export const PayPalCheckoutProvider = ({children, shipping}: PayPalProviderProps) => {
	const [error, setError] = useState<string>();
	const [orderId, setOrderId] = useState<string>();
	const [isPaying, setIsPaying] = useState(false);
	const [checkoutCompleted, setCheckoutCompleted] = useState(false);
	const { user } = useAuth();
	const { cart } = useSelector((state: RootState) => state.cart);
	const { watch } = useFormContext()
	const { invoice, customerNote } = watch()
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>()

	const createOrder = useMutation({
		mutationFn: async () => {
			setOrderId(undefined);
			setIsPaying(true);
			try {
				const response = await fetch("/api/orders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ cart, customerNote, invoice, customerId: user?.user_id }),
				});
				const orderData = await response.json();
				if (!orderData.success) {
					throw new Error(orderData.error);
				}
				setOrderId(orderData.wooId);
				return orderData.id;
			} catch (error: any) {
				await onError(error);
			}
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
				dispatch(destroyCart());
				gtagPurchase(wooOrder);
				setCheckoutCompleted(true);
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
	// Redirect when checkout is completed
	useEffect(() => {
		if (checkoutCompleted) {
			router.push("/checkout/completed");
		}
	}, [checkoutCompleted, router]);

	return (
		<PayPalCardFieldsProvider
			createOrder={createOrder.mutateAsync}
			onApprove={onApprove}
			onError={onError}
			style={{
				'input': {
					'font-size': '14px',
					'font-family': 'Apercu, sans-serif',
					'font-weight': "300",
					'padding': '16.5px 14px',
					'border-radius': '0',
					'border': '1px solid rgba(0, 0, 0, 0.23)',
				},
				":focus": {
					"box-shadow": "none",
					'border': '2px solid #000',
					'padding': '15.5px 13px',
				},
				"input:hover": {
					'border': '2px solid #000',
					'padding': '15.5px 13px',
				},
				"input.invalid:hover": {
					'border': '1px solid #d9360b',
					'padding': '16.5px 14px',
				},
			} as Record<string, PayPalCardFieldsStyleOptions>}
		>
			<PayPalCheckoutContext.Provider value={{createOrder: createOrder.mutateAsync, onApprove, onError, shipping, isPaying, setIsPaying}}>
				{children}
			</PayPalCheckoutContext.Provider>
			<PaymentErrorDialog setError={(value) => {
				setIsPaying(false)
				setError(value)
			}} error={error} />
		</PayPalCardFieldsProvider>
	)
}

const usePayPalCheckout = () => useContext(PayPalCheckoutContext);

export default usePayPalCheckout;