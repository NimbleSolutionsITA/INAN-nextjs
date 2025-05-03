import {
    Typography,
    Divider,
    Grid,
    Collapse,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel
} from "@mui/material"
import Button from "../../../components/Button"
import Checkbox from "../../../components/Checkbox";
import {useIsMobile} from "../../../utils/layout";
import {Controller, useFormContext} from "react-hook-form";
import HookAddressForm from "./HookAddressForm";
import PaymentMethods from "../../paypal/PaymentMethods";
import {FormFields} from "../../paypal/usePayPalFormProvider";
import usePayPalCheckout from "../../paypal/PayPalCheckoutProvider";
import { Country } from "../../../../@types/woocommerce";

type PreProcessAddressProps = {
    countries: Country[];
    isGuest: boolean
}

const LeftTab = ({ isGuest, countries }: PreProcessAddressProps) => {
    const isMobile = useIsMobile()
    const { watch, setValue, control } = useFormContext<FormFields>()
    const { saveAddress, saveAddressError } = usePayPalCheckout()
    const { has_shipping, billing, shipping, address_tab, step } = watch()

    return (
        <>
            <Typography variant="h1" component="h1">{step === "PAYMENT"  ? "Payment" : "Address"}</Typography>
            <Divider />
            {saveAddressError && <Typography variant="body1" color="error">{saveAddressError}</Typography> }
            <br />
            <Typography style={{float: 'right', margin: '10px 0'}} ><b>Billing</b></Typography>
            <Typography style={{margin: '10px 0'}}><b>{billing.first_name && billing.last_name ? `${billing.first_name} ${billing.last_name}${billing.company && `- ${billing.company}`}` : ''}</b></Typography>
            <Typography>{billing.address_1 ? `${billing.address_1}, ${billing.city}, ${billing.postcode},${billing.state && `${billing.state}, `} ${billing.country}` : ''}</Typography>
            {has_shipping && (
                <>
                    <Divider />
                    <br />
                    <Typography style={{float: 'right', margin: '10px 0'}} ><b>Shipping</b></Typography>
                    <Typography style={{margin: '10px 0'}}><b>{shipping?.first_name} {shipping?.last_name} {shipping?.company && `- ${shipping.company}`}</b></Typography>
                    <Typography>{shipping?.address_1 ? `${shipping.address_1}, ${shipping.city}, ${shipping.postcode},${shipping.state && `${shipping.state}, `} ${shipping.country}` : ''}</Typography>
                </>
            )}
            {step === "PAYMENT" && !isMobile
                ? <PaymentMethods />
                : (
                    <>
                        {isGuest &&
                            <>
                                <br />
                                <Controller
                                    control={control}
                                    name="billing.email"
                                    rules={{
                                        required: "EMAIL IS REQUIRED"
                                    }}
                                    render={({
                                                 field: { onChange, value },
                                                 fieldState: { invalid, error }
                                             }) => (
                                        <FormControl fullWidth>
                                            <TextField
                                                disabled={step !== "ADDRESS"}
                                                placeholder="ENTER YOUR EMAIL"
                                                required
                                                autoComplete="email"
                                                error={invalid}
                                                label="EMAIL"
                                                helperText={error?.message}
                                                fullWidth
                                                type="email"
                                                value={value}
                                                onChange={onChange}
                                                InputLabelProps={{
                                                    disableAnimation: true,
                                                    focused: false,
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </>
                        }

                        <Collapse in={step === "ADDRESS"} style={{marginBottom: '20px'}}>
                            <br />
                            <Typography variant="h2">{address_tab}</Typography>
                            <br />

                            <HookAddressForm countries={countries} namespace="billing" />

                            {has_shipping && (<HookAddressForm countries={countries} namespace="shipping" />)}

                            <FormControl component="fieldset" style={{width: '100%', padding: '10px 3px'}}>
                                <FormGroup aria-label="position" style={{flexDirection: 'row-reverse'}}>
                                    {has_shipping && (
                                        <FormControlLabel
                                            style={{marginRight: 0}}
                                            value="shipping"
                                            control={
                                                <Checkbox
                                                    edge="end"
                                                    checked={address_tab === 'shipping'}
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    onChange={() => setValue('address_tab', 'shipping')}

                                                />}
                                            label="shipping"
                                            labelPlacement="start"
                                        />
                                    )}
                                    <FormControlLabel
                                        style={{marginLeft: '20px', marginRight: 0}}
                                        value="billing"
                                        control={
                                            <Checkbox
                                                edge="end"
                                                checked={address_tab === 'billing'}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                onChange={() => setValue('address_tab', 'billing')}
                                            />}
                                        label="billing"
                                        labelPlacement="start"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Collapse>
                        <Divider/>

                        <br />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    disabled={step !== "ADDRESS"}
                                    style={{marginBottom: '20px'}}
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    disableGutters
                                    onClick={() => {
                                        if (has_shipping && address_tab === 'shipping') {
                                            setValue("address_tab", "billing")
                                        }
                                        setValue("has_shipping", !has_shipping)
                                    }}
                                >
                                    {has_shipping
                                        ? `Same as billing${isMobile ? '' : ' Address'}`
                                        : `Different shipping${isMobile ? '' : ' Address'}`}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={async () => step === "ADDRESS"
                                        ? saveAddress()
                                        : setValue('step', "ADDRESS")
                                    }
                                >
                                    <b>{ step === "ADDRESS" ? "Save" : "Edit"}</b>
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )
            }
        </>
    )
}

export default LeftTab