import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useForm} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Billing, Shipping} from "../../../@types/woocommerce";
import {getCartTotal, getOrderPayloadFromFields, getShippingMethod} from "../../utils/helpers";
import {API_CUSTOMER_ENDPOINT} from "../../utils/endpoints";
import {setCustomer} from "../../redux/customerSlice";
import {ShippingProps} from "../../utils/shop";
import {CartItem} from "../../../@types";

export type PaymentMethod = "applepay" | "googlepay" | "card" | "paypal"

export type FormFields = {
    has_shipping: boolean,
    billing: Billing,
    shipping?: Shipping
    step: Step,
    payment_method: PaymentMethod
    vat: string
    address_tab: "billing" | "shipping"
    shipping_method: { id: string, cost: string, name: string }
    coupon: string
    discount: string
    customer_id: number
};

export type Totals = {
    shipping: number,
    tax: number,
    discount: number
    total: number,
    subtotal: number
}

export type Step = 'ADDRESS'|'RECAP'|'COUPON'|'PAYMENT'

const usePayPalFormProvider = (woocommerce: ShippingProps, cart: CartItem[]) => {
    const customer = useSelector((state: RootState) => state.customer.customer);
    const user = useSelector((state: RootState) => state.auth.user);
    const cartTotal = getCartTotal(cart)
    const dispatch = useDispatch()

    const methods = useForm<FormFields>({
        defaultValues: {
            customer_id: user?.id ?? 0,
            step: 'ADDRESS',
            has_shipping: false,
            payment_method: 'paypal',
            vat: customer?.meta_data.find(m => m.key === 'vat')?.value ?? '',
            address_tab: "billing" as const,
            shipping_method: getShippingMethod(woocommerce, customer?.billing.country ?? 'IT'),
            coupon: "",
            billing: {
                email: customer?.email ?? '',
                first_name: customer?.billing.first_name ?? '',
                last_name: customer?.billing.last_name ?? '',
                company: customer?.billing.company ?? '',
                address_1: customer?.billing.address_1 ?? '',
                address_2: customer?.billing.address_2 ?? '',
                city: customer?.billing.city ?? '',
                postcode: customer?.billing.postcode ?? '',
                country: customer?.billing.country ?? 'IT',
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
                country: customer?.shipping.country ?? 'IT',
                state: customer?.shipping.state ?? '',
            },
        }
    })

    const fields = methods.watch()
    const { step, has_shipping, billing, shipping, vat, shipping_method } = fields
    const initialData =  { shipping: Number(shipping_method.cost), tax: 0, discount: 0, total: cartTotal + Number(shipping_method.cost), subtotal: cartTotal }

    const getTotals = useQuery({
        queryKey: ["get-order-totals", fields, cart],
        queryFn: async () => {
            const response = await fetch("/api/orders/totals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getOrderPayloadFromFields(fields, cart))
            })
            const { totals, success } = await response.json();
            if (success) {
                return {
                    subtotal: Number(totals.total) - Number(totals.tax) - Number(totals.shipping) + Number(totals.discount),
                    tax: Number(totals.tax),
                    shipping: Number(totals.shipping),
                    discount: Number(totals.discount),
                    total: Number(totals.total),
                }
            }
            return  initialData
        },
        enabled: step === "COUPON",
        initialData
    })

    const saveAddressMutation = useMutation({
        mutationFn: async () => {
            const isBillingValid = await methods.trigger(['billing', 'vat'])
            if (!isBillingValid) {
                methods.setValue("address_tab", "billing")
                return
            }
            if (has_shipping) {
                const isShippingValid = await methods.trigger('shipping')
                if (!isShippingValid) {
                    methods.setValue("address_tab", "shipping")
                    return
                }
            }
            if (user) {
                const response = await fetch(`${API_CUSTOMER_ENDPOINT}/${user.id}`, {
                    method: 'POST',
                    headers: [["Content-Type", 'application/json']],
                    body: JSON.stringify({
                        billing,
                        shipping,
                        meta_data: [{key: 'vat', value: vat}]
                    })
                })
                if (!response.ok) {
                    const { customer } = await response.json()
                    dispatch(setCustomer(customer))
                }
            }
            methods.setValue("shipping_method", getShippingMethod(woocommerce, (has_shipping ? shipping?.country : billing.country) as string))
            methods.setValue('step', "COUPON")
        }
    })

    return {
        ...methods,
        getTotals: {getTotals: getTotals.refetch, totals: getTotals.data, getTotalsIsLoading: getTotals.isLoading},
        saveAddress: { saveAddress: saveAddressMutation.mutateAsync, saveAddressIsLoading: saveAddressMutation.isLoading, saveAddressError: saveAddressMutation.error?.toString() ?? "" },
        updateShippingMethod: (code: string) => {
            const method = getShippingMethod(woocommerce, code)
            methods.setValue("shipping_method", method)
            return method
        },
    }
}

export default usePayPalFormProvider