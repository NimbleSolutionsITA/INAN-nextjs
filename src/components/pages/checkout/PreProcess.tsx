import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import PreProcessAddress from "./PreProcessAddress";
import SplitLayout from "../../../components/SplitLayout";
import PreProcessPay from "./PreProcessPay";
import PaypalButton from "./PaypalButton";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {Billing, Order, Shipping} from "../../../../@types/woocommerce";
import {CheckoutPageProps} from "../../../../pages/checkout";

type PreProcessProps = {
    isGuest: boolean
    setPaypalSuccess: Dispatch<SetStateAction<false | Partial<Order>>>
    setPaypalError: Dispatch<SetStateAction<false | string>>
    woocommerce: CheckoutPageProps['woocommerce']
    currentOrder: Partial<Order>,
    setCurrentOrder: Dispatch<SetStateAction<Partial<Order>>>
}

export type PreProcessAdress = {
    shipping: Partial<Shipping>;
    billing: Partial<Billing>;
}

const PreProcess = ({currentOrder, setCurrentOrder, isGuest, setPaypalSuccess, setPaypalError, woocommerce}: PreProcessProps) => {
    const { header: {loading}, auth: {user}, customer: {customer} } = useSelector((state: RootState) => state);
    // @ts-ignore
    const [address, setAddress] = useState<PreProcessAdress>({shipping: null, billing: null})
    const [isCheckoutReady, setIsCheckoutReady] = useState(false)
    return (isGuest || customer) ? (
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
                (!loading && currentOrder &&
                <PaypalButton
                    order={currentOrder}
                    setOrder={setCurrentOrder}
                    setPaypalSuccess={setPaypalSuccess}
                    setPaypalError={setPaypalError}
                />) :
                <PreProcessPay setIsCheckoutReady={setIsCheckoutReady} order={currentOrder} setOrder={setCurrentOrder} />

            }
        />
    ) : <span />
}

export default PreProcess