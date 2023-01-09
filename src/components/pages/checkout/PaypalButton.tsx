import {Typography} from "@mui/material"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {Order} from "../../../../@types/woocommerce";
import {Dispatch, SetStateAction} from "react";
import {updateOrder} from "../../../utils/helpers";
import {destroyCart} from "../../../redux/cartSlice";

type PaypalButtonProps = {
    order: Partial<Order>
    setOrder: Dispatch<SetStateAction<Partial<Order>>>
    setPaypalError: Dispatch<SetStateAction<false | string>>
    setPaypalSuccess: Dispatch<SetStateAction<false | Partial<Order>>>
}

const CLIENT_ID = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION : process.env.NEXT_PUBLIC_PAYPAL_SANDBOX;

const PaypalButton = ({order, setOrder, setPaypalError, setPaypalSuccess}: PaypalButtonProps) => {
    return CLIENT_ID ? (
        <PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "EUR" }}>
            <Typography variant="h2">Select your payment method</Typography>
            <br />
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: order.total || '',
                            },
                        }],
                    });
                }}
                onApprove={(data, actions) => {
                    // This function captures the funds from the transaction.
                    // @ts-ignore
                    return actions.order.capture().then((payPal) => {
                        setPaypalSuccess(order);
                        order.id && updateOrder({set_paid: true, transaction_id: payPal.id}, order.id)
                        destroyCart()
                    });
                }}
                onError={(err) => {
                    setPaypalError(err.toString());
                    console.error(err);
                }}
            />
        </PayPalScriptProvider>

    ) : <span />
}

export default PaypalButton;