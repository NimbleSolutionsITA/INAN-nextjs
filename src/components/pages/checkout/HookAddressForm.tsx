import {FormControl, Grid, TextField, Autocomplete} from "@mui/material";
import {AddressBookPageProps} from "../../../../pages/account/address-book";
import {Control, Controller, useFormContext} from "react-hook-form";
import {FormFields} from "../../paypal/usePayPalFormProvider";


type AddressFormProps = {
    countries: AddressBookPageProps['countries']
    namespace: "billing" | "shipping"
}

const HookAddressForm = ({ countries, namespace }: AddressFormProps) => {
    const { control, watch, setValue } = useFormContext<FormFields>()

    const selectedCountry = watch(`${namespace}.country`)
    const address_tab = watch("address_tab")
    const states = countries.find(c => c.code === selectedCountry)?.states ?? []

    return (
        <div style={{ display: address_tab === namespace ? 'block' : 'none' }}>
            <Grid container spacing={2} direction="row">
                <Grid item xs={12} lg={6}>
                    <ControlledField
                        name={`${namespace}.first_name`}
                        control={control}
                        label="FIRST NAME"
                        placeholder="ENTER YOUR FIRST NAME"
                        autocomplete="given-name"
                        rules={{
                            required: "FIRST NAME IS REQUIRED"
                        }}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <ControlledField
                        name={`${namespace}.last_name`}
                        control={control}
                        label="LAST NAME"
                        placeholder="ENTER YOUR LAST NAME"
                        autocomplete="family-name"
                        rules={{
                            required: "LAST NAME IS REQUIRED"
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ControlledField
                        name={`${namespace}.company`}
                        control={control}
                        label="COMPANY"
                        placeholder="ENTER YOUR COMPANY NAME"
                        autocomplete="organization"
                    />
                </Grid>
                {namespace === "billing" && (
                    <Grid item xs={12}>
                        <ControlledField
                            name="vat"
                            control={control}
                            label={selectedCountry === 'IT' ? 'CODICE FISCALE / P.IVA' : 'VAT ID'}
                            placeholder={selectedCountry === 'IT' ? 'ENTER YOUR CODICE FISCALE OR PARTITA IVA' : 'ENTER YOUR VAT ID'}
                            autocomplete="organization"
                            rules={{
                                required: selectedCountry === 'IT' && "PARTITA IVA IS REQUIRED",
                            }}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <ControlledField
                        name={`${namespace}.address_1`}
                        control={control}
                        label="ADDRESS"
                        placeholder="ENTER YOUR ADDRESS"
                        autocomplete="street-address"
                        rules={{
                            required: "ADDRESS IS REQUIRED"
                        }}
                    />
                </Grid>
                <Grid item xs={12} lg={states?.length > 0  ? 6 : 12}>
                    <Controller
                        control={control}
                        name={`${namespace}.country`}
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
                                        setValue(`${namespace}.state`, "")
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            autoComplete="off"
                                            placeholder="ENTER YOUR COUNTRY"
                                            required
                                            error={invalid}
                                            label="COUNTRY"
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
                </Grid>

                {states?.length > 0 && (
                    <Grid item xs={12} lg={6}>
                        <Controller
                            control={control}
                            name={`${namespace}.state`}
                            rules={{
                                required: "STATE OR PROVINCE IS REQUIRED"
                            }}
                            render={({
                                         field: { onChange, value },
                                         fieldState: { invalid, error }
                                     }) => (
                                <FormControl fullWidth>
                                    <Autocomplete
                                        autoComplete
                                        autoCapitalize="characters"
                                        autoSelect
                                        value={states.find(s => s.code === value) ?? null}
                                        options={states}
                                        getOptionKey={(option) => option.code}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) => option.code === value.code}
                                        onChange={(event,value ) => {
                                            onChange(value?.code ?? '')
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                autoComplete="off"
                                                placeholder="ENTER YOUR STATE OR PROVINCE"
                                                required
                                                error={invalid}
                                                label="STATE OR PROVINCE"
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
                    </Grid>
                )}
                <Grid item xs={12} lg={6}>
                    <ControlledField
                        name={`${namespace}.city`}
                        control={control}
                        label="CITY"
                        placeholder="ENTER YOUR CITY"
                        autocomplete="city"
                        rules={{
                            required: "CITY IS REQUIRED"
                        }}
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <ControlledField
                        name={`${namespace}.postcode`}
                        control={control}
                        label="POST CODE"
                        placeholder="ENTER YOUR POST CODE"
                        autocomplete="postal-code"
                        rules={{
                            required: "POST CODE IS REQUIRED"
                        }}
                    />
                </Grid>
                {namespace === "billing" && (
                    <Grid item xs={12}>
                        <ControlledField
                            name={`${namespace}.phone`}
                            control={control}
                            label="PHONE NUMBER"
                            placeholder="ENTER YOUR PHONE NUMBER"
                            autocomplete="phone"
                        />
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

type ControlledFieldProps = {
    control: Control<FormFields>
    placeholder: string
    autocomplete: string
    label: string
    rules?: any
    name: string
    type?: string
}

const ControlledField = ({control, placeholder, autocomplete, label, rules, name, type = "text"}: ControlledFieldProps) => (
    <Controller
        control={control}
        name={name as unknown as any}
        rules={rules}
        render={({
                     field: { onChange, value },
                     fieldState: { invalid, error }
                 }) => (
            <FormControl fullWidth>
                <TextField
                    placeholder={placeholder}
                    required={!!rules?.required}
                    autoComplete={autocomplete}
                    error={invalid}
                    label={label}
                    helperText={error?.message}
                    fullWidth
                    type={type}
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
)

export default HookAddressForm