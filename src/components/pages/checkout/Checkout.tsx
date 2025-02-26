import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Container from "../../../components/Container";
import {RootState} from "../../../redux/store";
import PreProcess from "./PreProcess";
import PaymentError from "./PaymentError";
import PaymentSuccess from "./PaymentSuccess";
import {ShippingProps} from "../../../utils/shop";
import {Order, OrderPayload} from "../../../../@types/woocommerce";
import {useIsMobile} from "../../../utils/layout";
import PayPalProvider from "../../paypal/PayPalProvider";
import {PayPalCheckoutProvider} from "../../paypal/PayPalCheckoutProvider";
import AccessCheckout from "./AccessCheckout";
import {useQuery} from "@tanstack/react-query";

type CheckoutProps = {
    woocommerce: ShippingProps
}

const Checkout = ({woocommerce}: CheckoutProps) => {
    const cart = useSelector((state: RootState) => state.customer);
    const customer = useSelector((state: RootState) => state.customer.customer);
    const isMobile = useIsMobile()
    const [isGuest, setIsGuest] = useState(false)
    const [currentOrder, setCurrentOrder] = useState<OrderPayload>({
        customer_id: isGuest ? 0 : 123,
        payment_method: '',
        payment_method_title: '',
        currency: "EUR",
        billing: {
            email: customer?.email ?? '',
            first_name: customer?.billing.first_name ?? '',
            last_name: customer?.billing.last_name ?? '',
            company: customer?.billing.company ?? '',
            address_1: customer?.billing.address_1 ?? '',
            address_2: customer?.billing.address_2 ?? '',
            city: customer?.billing.city ?? '',
            postcode: customer?.billing.postcode ?? '',
            country: customer?.billing.country ?? '',
            state: customer?.billing.state ?? '',
            phone: customer?.billing.phone ?? ''
        },
        shipping: {
            first_name: customer?.shipping.first_name ?? '',
            last_name: customer?.shipping.last_name ?? '',
            company: customer?.shipping.company ?? '',
            address_1: customer?.shipping.address_1 ?? '',
            address_2: customer?.shipping.address_2 ?? '',
            city: customer?.shipping.city ?? '',
            postcode: customer?.shipping.postcode ?? '',
            country: customer?.shipping.country ?? '',
            state: customer?.shipping.state ?? '',
        },
        line_items: cart.map(item => ({
            product_id: item.id,
            quantity: item.qty,
        })),
        shipping_lines: [],
        coupon_lines: [],
    });


    console.log(cart, currentOrder)

    return (
        <Container headerPadding>
            {!isMobile  && <br/>}
            {!isGuest && !customer ?
                <AccessCheckout setIsGuest={setIsGuest} /> :
                <PreProcess
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                    woocommerce={woocommerce}
                    isGuest={isGuest}
                />
            }
        </Container>
    )
}

export default Checkout