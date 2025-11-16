import {
    Typography,
    Divider,
    Grid,
    Collapse,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel, Autocomplete, Box
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
import React, {useState} from "react";

type PreProcessAddressProps = {
    countries: Country[];
    isGuest: boolean
}

const LeftTab = ({ isGuest, countries }: PreProcessAddressProps) => {
    const isMobile = useIsMobile()
    const { watch, setValue, control, trigger } = useFormContext<FormFields>()
    const { saveAddress, saveAddressError } = usePayPalCheckout()
    const { has_shipping, billing, shipping, address_tab, step } = watch()
    const shipTo = has_shipping ? shipping : billing
    return (
        <>
            <Typography variant="h1" component="h1">{step === "PAYMENT"  ? "Payment" : "Address"}</Typography>
            <Divider />
            {saveAddressError && <Typography variant="body1" color="error">{saveAddressError}</Typography> }
            <br />

            {step !== 'EMAIL' && (
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography><b>Email: {billing.email}</b></Typography>
                    <Button
                        variant="text"
                        style={{color: 'black'}}
                        onClick={() => setValue("step", "EMAIL")}
                    >
                        EDIT
                    </Button>
                </Box>
            )}

            {!['EMAIL', 'COUNTRY'].includes(step) && (
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography><b>Ship to: {countries.find(c => c.code === billing.country)?.name}</b></Typography>
                    <Button
                        variant="text"
                        style={{color: 'black'}}
                        onClick={() => setValue("step", "COUNTRY")}
                    >
                        EDIT
                    </Button>
                </Box>
            )}

            {!['EMAIL', 'COUNTRY', 'ADDRESS', 'BILLING'].includes(step) && (
                <>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography><b>Address</b></Typography>
                        <Button
                            variant="text"
                            style={{color: 'black'}}
                            onClick={() => setValue("step", "ADDRESS")}
                        >
                            EDIT
                        </Button>
                    </Box>
                    <Typography>
                        {shipTo?.first_name } {billing.last_name}<br />
                        {shipTo?.company}<br />
                        {shipTo?.address_1}<br />
                        {shipTo?.city} {shipTo?.state}<br />
                        {countries.find(c => c.code === shipTo?.country)?.name}<br />
                        {billing.phone}
                    </Typography>
                    {has_shipping && (
                        <>
                            <Divider style={{marginBottom: '10px'}} />
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography><b>Bill to</b></Typography>
                                <Button
                                    variant="text"
                                    style={{color: 'black'}}
                                    onClick={() => setValue("step", "BILLING")}
                                >
                                    EDIT
                                </Button>
                            </Box>
                            <Typography>
                                {billing.first_name } {billing.last_name}<br />
                                {billing.company}<br />
                                {billing.address_1}<br />
                                {billing.city} {billing.state}<br />
                                {countries.find(c => c.code === billing.country)?.name}<br />
                                {billing.phone}
                            </Typography>
                        </>
                    )}
                </>
            )}
            {step === "PAYMENT" && !isMobile
                ? <PaymentMethods />
                : (
                    <>
                        {isGuest &&
                            <Collapse in={step === "EMAIL"}>
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
                            </Collapse>
                        }

                        <Collapse in={step === 'COUNTRY'}>
                            <Controller
                                control={control}
                                name={`${has_shipping ? 'shipping' : 'billing'}.country`}
                                rules={{
                                    required: "COUNTRY IS REQUIRED"
                                }}
                                render={({
                                             field: { onChange, value },
                                             fieldState: { invalid, error }
                                         }) => (
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            autoComplete
                                            autoSelect
                                            value={countries.find(c => c.code === value) ?? null}
                                            options={countries}
                                            getOptionKey={(option) => option.code}
                                            getOptionLabel={(option) => option.name}
                                            isOptionEqualToValue={(option, value) => option.code === value.code}
                                            onChange={(event,value ) => {
                                                onChange(value?.code ?? '')
                                                setValue(`${has_shipping ? 'shipping' : 'billing'}.state`, "")
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    autoComplete="off"
                                                    placeholder="ENTER YOUR COUNTRY"
                                                    required
                                                    error={invalid}
                                                    label="SHIPPING COUNTRY"
                                                    helperText={error?.message}
                                                    fullWidth
                                                    type="text"
                                                    InputLabelProps={{
                                                        disableAnimation: true,
                                                        focused: false,
                                                        shrink: true,
                                                    }}
                                                />
                                            }
                                        />
                                    </FormControl>
                                )}
                            />
                        </Collapse>

                        <Collapse in={step === "ADDRESS" || step === "BILLING"}>
                            <br />
                            <Typography variant="h2">{step}</Typography>
                            <br />
                            <HookAddressForm countries={countries} />
                        </Collapse>

                        <Grid container spacing={2}>
                            {(step === 'COUPON' || step === 'BILLING')  && (
                                <Grid item xs={step === 'COUPON' ? 12 : 6} style={{marginTop: '20px'}}>
                                    <FormControlLabel
                                        value={has_shipping}
                                        control={
                                            <Checkbox
                                                checked={has_shipping}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                onChange={() => {
                                                    if (has_shipping) {
                                                        setValue('billing', {
                                                            ...billing,
                                                            ...shipping
                                                        })
                                                    } else {
                                                        setValue('shipping', {
                                                            ...billing
                                                        })
                                                    }
                                                    setValue('step', has_shipping ? 'COUPON' : 'BILLING')
                                                    setValue("has_shipping", !has_shipping)
                                                }}
                                                isCrossed
                                            />}
                                        label={"USE A DIFFERENT ADDRESS FOR BILLING"}
                                        labelPlacement="end"
                                        sx={has_shipping ? {
                                            '& .FormControlLabel-label': {
                                                textDecoration: 'line-through'
                                            }
                                        } : undefined}
                                    />
                                </Grid>
                            )}
                            {step !== 'COUPON' && (
                                <Grid item xs={12}>
                                    <Button
                                        sx={{ mt: '10px'}}
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={async () => {
                                            if (step === "ADDRESS" || step === "BILLING") {
                                                saveAddress()
                                            } else if (step === "EMAIL") {
                                                const isValid = await trigger(['billing.email'])
                                                if (!isValid) {
                                                    return
                                                }
                                                setValue("step", "COUNTRY")
                                            } else if (step === "COUNTRY") {
                                                const isValid = await trigger([`${has_shipping ? 'shipping' : 'billing'}.country`])
                                                if (!isValid) {
                                                    return
                                                }
                                                setValue("step", "ADDRESS")
                                            }
                                        }}
                                    >
                                        <b>
                                            { step === "EMAIL" && "shipping country"}
                                            { step === "COUNTRY" && "address"}
                                            { step === "ADDRESS" && "save"}
                                            { step === "BILLING" && "save"}
                                        </b>
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </>
                )
            }
        </>
    )
}

export default LeftTab