import {
    Typography,
    Divider,
    CircularProgress, FormControl, TextField,
} from "@mui/material";
import {formatPrice} from "../../../utils/helpers";
import Button from "../../../components/Button";
import CartItems from "./CartItems";
import {Controller, useFormContext} from "react-hook-form";
import usePayPalCheckout from "../../paypal/PayPalCheckoutProvider";
import {FormFields} from "../../paypal/usePayPalFormProvider";
import PaymentMethods from "../../paypal/PaymentMethods";
import {useIsMobile} from "../../../utils/layout";
import Image from "next/image";

const RightTab = () => {
    const { watch, setValue, control, clearErrors } = useFormContext<FormFields>()
    const { step } = watch()
    const {getTotals, totals, getTotalsIsLoading } = usePayPalCheckout()
    const isMobile = useIsMobile()

    const handleCheckout = () => {
        if (isMobile) {
            setTimeout(() => {
                const position = step === "PAYMENT"
                    ? 0
                    : (document.getElementById("payment-methods")?.getBoundingClientRect().top ?? 0) - 110 + window.scrollY
                window.scrollTo({ top: position, behavior: "smooth" });
            }, 100);
        }
        setValue("step", step === "PAYMENT" ? "ADDRESS" : "PAYMENT")
    }

    return <>
        <Typography variant="h2">Products</Typography>
        <br />
        <CartItems />
        <br />
        <Typography variant="h2">Summary</Typography>
        <Controller
            control={control}
            name="coupon"
            render={({
                         field: { onChange, value },
                         fieldState: { invalid, error }
                     }) => (
                <FormControl fullWidth>
                    <TextField
                        disabled={step !== "COUPON" || totals.discount > 0}
                        placeholder="ENTER YOUR CODE"
                        autoComplete="off"
                        error={invalid}
                        label="PROMOTIONAL CODE"
                        helperText={error?.message}
                        fullWidth
                        type="text"
                        value={value}
                        onChange={(e) => {
                            clearErrors("coupon")
                            onChange(e)
                        }}
                        InputLabelProps={{
                            disableAnimation: true,
                            focused: false,
                            shrink: true,
                        }}
                    />
                </FormControl>
            )}
        />
        <div style={{width: '100%', height: '50px'}}>
            <Button
                style={{float: 'right', margin: '10px 0', minWidth: '100px'}}
                variant="outlined"
                color="secondary"
                disabled={step !== "COUPON" || totals.discount > 0}
                onClick={getTotals}
            >
                {getTotalsIsLoading
                    ? <CircularProgress color="secondary" size={15} />
                    : 'apply code'
                }
            </Button>
        </div>
        <div>
            <Typography variant="h2">Signature gift box included</Typography>
            <Typography variant="body2">ALL ORDERS ON INANSTUDIO.COM ARE SHIPPED IN OUR SIGNATURE GIFT BOX.</Typography>
            <Image
                src="/images/INAN-GIFT-BOX-VISUAL.jpg"
                alt="gift box"
                width={640}
                height={427}
                style={{width: '100%', height: 'auto', marginTop: '10px', marginBottom: '16px'}}
            />
        </div>
        <div style={{width: '100%'}}>
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1}}>SUBTOTAL</div>
                <div>{formatPrice(totals.subtotal)}</div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1}}>SHIPPING <span style={{fontStyle: 'italic', color: "#878787"}}>[FREE SHIPPING TO ITALY]</span></div>
                <div>{formatPrice(totals.shipping)}</div>
            </div>
            {Number(totals?.tax) > 0 && (
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>TAX</div>
                    <div>{formatPrice(totals?.tax)}</div>
                </div>
            )}
            {totals.discount > 0 && (
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>DISCOUNT</div>
                    <div>- {formatPrice(totals.discount)}</div>
                </div>
            )}
            <Divider style={{marginTop: '10px', marginBottom: '5px'}} />
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1}}><Typography variant="h2">TOTAL</Typography></div>
                <div><Typography variant="h2">{formatPrice(totals.total)}</Typography></div>
            </div>
        </div>
        {step === "PAYMENT" && isMobile && <PaymentMethods />}
        <Button
            disabled={!["COUPON", "PAYMENT"].includes(step)}
            fullWidth
            variant={isMobile && step === "PAYMENT" ? "outlined" : "contained"}
            onClick={handleCheckout}
            color="secondary"
            style={{margin: '30px 0 20px'}}
        >
            {step === "PAYMENT" ? "Edit" : "Checkout"}
        </Button>
        <Button disabled={step !== "COUPON"} inactive disableGutters disablePadding href="/returns">
            Shipping and returns
        </Button>
        <br />
        <Button disabled={step !== "COUPON"} inactive disableGutters disablePadding href="/customer-service">
            need help?
        </Button>
    </>
}

export default RightTab