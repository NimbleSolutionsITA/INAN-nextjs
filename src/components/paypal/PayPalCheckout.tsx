import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import { PayPalCardFieldsForm, PayPalMessages } from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import ApplePay from "../icons/payments/ApplePay";
import GooglePay from "../icons/payments/GooglePay";
import CreditCard from "../icons/payments/CreditCard";
import PayPal from "../icons/payments/PayPal";
import usePayPalCheckout from "./PayPalCheckoutProvider";
import {useState} from "react";

type PaymentMethod = 'applepay' | 'googlepay' | 'card' | 'paypal';

const PAYMENT_METHODS = ['applepay', 'googlepay', 'card', 'paypal'];

const PayPalCheckout = () => {
	const { applePayConfig, googlePayConfig } = useSelector((state: RootState) => state.cart);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
	const {isPaying} = usePayPalCheckout()
	const availablePaymentMethods = PAYMENT_METHODS.filter(m => {
		if (m === 'applepay' && (!applePayConfig?.isEligible || !window.ApplePaySession)) return false;
		return !(m === 'googlepay' && !googlePayConfig?.isEligible);
	})
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', mt: '16px'}}>
			<FormControl disabled={isPaying}>
				<FormLabel id="payment-methods-radio-buttons-group" sx={{fontWeight: 500, fontSie: '14px', color: "rgba(0, 0, 0, 0.87)", marginBottom: '8px'}}>
					payment method
				</FormLabel>
				<RadioGroup
					row
					aria-labelledby="demo-controlled-radio-buttons-group"
					name="controlled-radio-buttons-group"
					value={paymentMethod}
					onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
				>
					{availablePaymentMethods.map((method) => (
						<FormControlLabel
							key={method}
							value={method}
							control={<Radio />}
							label={radioButtons(method === paymentMethod, method)}
						/>
					))}
				</RadioGroup>
			</FormControl>
			<PayPalMessages />
			<Box sx={{margin: "20px -6px 20px -6px", display: paymentMethod === "card" ? "block" : "none" }}>
				<PayPalCardFieldsForm />
			</Box>
		</Box>
	);
};

const radioButtonProps = {
	sx: {
		height: 'auto',
		width: '70px'
	}
}

const radioButtons = (selected: boolean, method: string) => ({
	applepay: <ApplePay {...radioButtonProps} selected={selected} />,
	googlepay: <GooglePay {...radioButtonProps} selected={selected} />,
	card: <CreditCard {...radioButtonProps} selected={selected} />,
	paypal: <PayPal {...radioButtonProps} selected={selected} />
}[method])

export default PayPalCheckout;