import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Container from "../../../components/Container";
import {RootState} from "../../../redux/store";
import {ShippingProps} from "../../../utils/shop";
import {useIsMobile} from "../../../utils/layout";
import {PayPalCheckoutProvider} from "../../paypal/PayPalCheckoutProvider";
import AccessCheckout from "./AccessCheckout";
import SplitLayout from "../../SplitLayout";
import LeftTab from "./LeftTab";
import RightTab from "./RightTab";
import {gtagEcommerceEvent} from "../../../utils/helpers";

type CheckoutProps = {
    woocommerce: ShippingProps
}

const Checkout = ({woocommerce}: CheckoutProps) => {
    const customer = useSelector((state: RootState) => state.customer.customer);
    const items = useSelector((state: RootState) => state.cart.items);
    const isMobile = useIsMobile()
    const [isGuest, setIsGuest] = useState(false)

    useEffect(() => {
        gtagEcommerceEvent(items, 'begin_checkout')
    }, []);

    return (
        <Container headerPadding>
            {!isMobile  && <br/>}
            {isGuest || customer ?
                <PayPalCheckoutProvider woocommerce={woocommerce}>
                    <SplitLayout
                        left={<LeftTab countries={woocommerce.countries} isGuest={isGuest} />}
                        right={<RightTab />}
                    />
                </PayPalCheckoutProvider> :
                <AccessCheckout setIsGuest={setIsGuest} />
            }
        </Container>
    )
}

export default Checkout