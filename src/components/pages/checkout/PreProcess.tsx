import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import PreProcessAddress from "./PreProcessAddress";
import SplitLayout from "../../../components/SplitLayout";
import PreProcessPay from "./PreProcessPay";
import PaypalButton from "./PaypalButton";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setHeader} from "../../../redux/headerSlice";
import {API_CUSTOMER_ENDPOINT} from "../../../utils/endpoints";
import {setCustomer} from "../../../redux/customerSlice";
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
    const dispatch = useDispatch()
    useEffect(() => {
        if (user?.id) {
            dispatch(setHeader({loading: true}))
            fetch(`${API_CUSTOMER_ENDPOINT}/${user.id}`, {
                headers: [["Content-Type", 'application/json']]
            })
                .then(r => r.json())
                .then((response => {
                    if (response.success) {
                        dispatch(setCustomer(response.customer))
                    }
                }))
                .finally(() => dispatch(setHeader({loading: false})))
        }
    }, []);
    console.log(currentOrder, loading, isCheckoutReady)
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
                <PreProcessPay setIsCheckoutReady={setIsCheckoutReady} order={currentOrder} />

            }
        />
    ) : <span />
}

export default PreProcess