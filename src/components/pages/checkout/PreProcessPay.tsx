import {Dispatch, SetStateAction, useState} from 'react'
import {
    Typography,
    Divider,
    TextField,
    FormControl,
    CircularProgress,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {formatPrice} from "../../../utils/helpers";
import Button from "../../../components/Button";
import CartItems from "./CartItems";
import {updateOrder} from "../../../utils/helpers";
import {RootState} from "../../../redux/store";
import {Order} from "../../../../@types/woocommerce";

type PreProcessPayProps = {
    order: Partial<Order>
    setIsCheckoutReady: Dispatch<SetStateAction<boolean>>
}

const PreProcessPay = ({order, setIsCheckoutReady}: PreProcessPayProps) => {
    const [coupon, setCoupon] = useState('')
    const [isGift, setIsGift] = useState(false)
    const [error, setError] = useState<false | string>(false)
    const [loading, setLoading] = useState(false)
    const {items: cart} = useSelector((state: RootState) => state.cart);
    const giftBoxCost = '0' // useSelector(state => state.woocommerce['shipping-GIFT']).settings.cost.value
    const shippingCost = order?.shipping_total ?? '0'
    const totalShipping = isGift ? parseInt(shippingCost) + parseInt(giftBoxCost) : shippingCost
    const total = isGift ? parseInt(order?.total ?? '0') + parseInt(giftBoxCost) : order?.total
    const subtotal = formatPrice(cart.map(i => i.qty * i.price).reduce((i, sum) =>  i + sum))

    const handleCheckout = () => {
        /*if(isGift) {
            dispatch(updateOrder(order.id, {
                shipping_lines: [{method_id: "flat_rate", method_title: "Gift Box", total: giftBoxCost}]
            }))
        }*/
        setIsCheckoutReady(true)
    }

    const handleApplyCoupon = async () => {
        setLoading(true)
        // @ts-ignore
        updateOrder({coupon_lines: [{code: coupon}]}, order.id)
            .catch(error => setError(error.message))
            .finally(() => setIsCheckoutReady(true))
    }
    console.log(order?.id)
    console.log(!order?.id)
    return order ? (
        <>
            <Typography variant="h2">Products</Typography>
            <br />
            <CartItems />
            <br />
            <Typography variant="h2">Summary</Typography>
            <FormControl fullWidth>
                <TextField
                    disabled={!order?.id && !coupon}
                    placeholder="ENTER YOUR CODE"
                    required
                    autoComplete="off"
                    error={!!order && !!coupon && !!error}
                    label="PROMOTIONAL CODE"
                    helperText={order && coupon && error}
                    fullWidth
                    type="text"
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    InputLabelProps={{
                        disableAnimation: true,
                        focused: false,
                        shrink: true,
                    }}
                />
            </FormControl>
            <div style={{width: '100%', height: '50px'}}>
                <Button
                    style={{float: 'right', margin: '10px 0', minWidth: '100px'}}
                    variant="outlined"
                    color="secondary"
                    disabled={!order?.id && !coupon}
                    onClick={handleApplyCoupon}
                >
                    {order && coupon && loading ? <CircularProgress color="secondary" size={15} /> : 'apply code'}
                </Button>
            </div>
            {/*<FormControl component="fieldset" style={{width: '100%', padding: ''}}>
                <FormGroup aria-label="position" style={{marginTop: '-20px', marginBottom: '20px'}}>
                    <FormControlLabel
                        style={{marginRight: 0}}
                        value="Gift Box"
                        control={
                            <Checkbox
                                disabled={!order?.id}
                                fill
                                checked={isGift}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onChange={() => setIsGift(!isGift)}
                            />}
                        label="Gift Box"
                        labelPlacement="end"
                    />
                </FormGroup>
            </FormControl>*/}
            <div style={{width: '100%'}}>
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>SUBTOTAL</div>
                    <div>{subtotal}</div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>SHIPPING</div>
                    <div>{formatPrice(order.id ? Number(totalShipping) : 0)}</div>
                </div>
                {Number(order?.total_tax) > 0 && (
                    <div style={{display: 'flex'}}>
                        <div style={{flexGrow: 1}}>TAX</div>
                        <div>{formatPrice(order.id ? Number(order.total_tax) : 0)}</div>
                    </div>
                )}
                {order && order.discount_total !== '0.00' && (
                    <div style={{display: 'flex'}}>
                        <div style={{flexGrow: 1}}>DISCOUNT</div>
                        <div>- {formatPrice(Number(order.discount_total ?? '0'))}</div>
                    </div>
                )}
                <Divider style={{marginTop: '10px', marginBottom: '5px'}} />
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}><Typography variant="h2">TOTAL</Typography></div>
                    <div><Typography variant="h2">{formatPrice(order?.id ? Number(total) : cart.map(i => i.qty * i.price).reduce((i, sum) =>  i + sum))}</Typography></div>
                </div>
            </div>
            <div style={{margin: '20px 0'}}>
                <Button disabled={!order?.id} fullWidth variant="contained" onClick={handleCheckout} color="secondary" style={{marginTop: '10px'}}>Checkout</Button>
            </div>
            <Button disabled={!order?.id} inactive disableGutters disablePadding href="/returns">Shipping and returns</Button><br />
            <Button disabled={!order?.id} inactive disableGutters disablePadding href="/customer-service">need help?</Button>
        </>
    ) : <span />
}

export default PreProcessPay