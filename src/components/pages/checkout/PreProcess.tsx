import {useState} from 'react'
import PreProcessAddress from "./PreProcessAddress";
import SplitLayout from "../../../components/SplitLayout";
import PreProcessPay from "./PreProcessPay";
import {CheckoutPageProps} from "../../../../pages/checkout";
import PayPalCheckout from "../../paypal/PayPalCheckout";
import {PayPalCheckoutProvider} from "../../paypal/PayPalCheckoutProvider";
import {FormProvider, useForm} from "react-hook-form";
import {Billing, Shipping} from "../../../../@types/woocommerce";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type PreProcessProps = {
    isGuest: boolean
    woocommerce: CheckoutPageProps['woocommerce']
}

export type PaymentMethod = "applepay" | "googlepay" | "card" | "paypal"

export type FormFields = {
    has_shipping: boolean,
    billing: Billing,
    shipping?: Shipping
    step: Step,
    payment_method: PaymentMethod
    vat: ""
};

export type Step = 'ADDRESS'|'RECAP'|'PAYMENT'

const PreProcess = ({currentOrder, setCurrentOrder, isGuest, woocommerce}: PreProcessProps) => {
    const customer = useSelector((state: RootState) => state.customer.customer);

    const form = useForm<FormFields>({
        defaultValues: {
            step: 'ADDRESS',
            has_shipping: false,
            payment_method: 'paypal',
            vat: '',
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
        }
    })
    const [isCheckoutReady, setIsCheckoutReady] = useState(false)

    return (
        <FormProvider {...form}>
            <PayPalCheckoutProvider order={}>
                <SplitLayout
                    left={
                        <PreProcessAddress
                            userInfo={isGuest ? null : customer}
                            address={address}
                            setAddress={setAddress}
                            isGuest={isGuest}
                            woocommerce={woocommerce}
                            setOrder={setCurrentOrder}
                        />
                    }
                    right={isCheckoutReady ?
                        <PayPalCheckout /> :
                        <PreProcessPay
                            setIsCheckoutReady={setIsCheckoutReady}
                            order={currentOrder}
                            setOrder={setCurrentOrder}
                        />
                    }
                />
            </PayPalCheckoutProvider>
        </FormProvider>
    )
}

export default PreProcess