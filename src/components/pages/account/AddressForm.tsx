import {FormControl, Grid, TextField, Autocomplete} from "@mui/material";
import {Dispatch, SetStateAction} from "react";
import {ShippingErrors, ShippingType} from "./AddressBook";
import {AddressBookPageProps} from "../../../../pages/account/address-book";


type AddressFormProps = {
    data: ShippingType
    setData: Dispatch<SetStateAction<ShippingType>>,
    dataError: ShippingErrors
    setDataError: Dispatch<SetStateAction<ShippingErrors>>
    countries: AddressBookPageProps['countries']
    vat?: string
    setVat?: Dispatch<SetStateAction<string>>
    errorVat?: false | string
    setErrorVat?: Dispatch<SetStateAction<false | string>>
}

const AddressForm = ({data, setData, dataError, setDataError, countries, vat, setVat, errorVat, setErrorVat}: AddressFormProps) => {
    const countryList = countries?.map(c => {
        return {name: c.name, code: c.code, states: c.states}
    })
    const country = countryList?.filter(c => c.name === data.country)[0]

    const handleChange = (event: { target: { value: string } }, field: string) => {
        setDataError({...dataError, [field]: false})
        if (field === 'country') {
            event.target.value && setData((data) => ({
                ...data,
                country: event.target.value,
                state: countries.filter(c => c.name === event.target.value)[0].states[0]?.name || ''
            }))
        }
        else {
            setData((data) => ({
                ...data,
                [field]: event.target.value
            }))
        }
    }

    return (
        <>
            <Grid container spacing={2} direction="row">
                <Grid item xs={12} lg={6}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="ENTER YOUR FIRST NAME"
                            required
                            autoComplete="off"
                            error={!!dataError.firstName}
                            label="FIRST NAME"
                            helperText={dataError.firstName}
                            fullWidth
                            type="text"
                            value={data.firstName}
                            onChange={(event) => handleChange(event, 'firstName')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="ENTER YOUR LAST NAME"
                            required
                            autoComplete="family-name"
                            error={!!dataError.lastName}
                            label="LAST NAME"
                            helperText={dataError.lastName}
                            fullWidth
                            type="text"
                            value={data.lastName}
                            onChange={(event) => handleChange(event, 'lastName')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="ENTER YOUR COMPANY NAME"
                            autoComplete="organization"
                            error={!!dataError.company}
                            label="COMPANY"
                            helperText={dataError.company}
                            fullWidth
                            type="text"
                            value={data.company}
                            onChange={(event) => handleChange(event, 'company')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                {setErrorVat && setVat && (
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                placeholder="ENTER YOUR VAT ID"
                                required
                                autoComplete="vat"
                                error={!!errorVat}
                                label="VAT ID"
                                helperText={errorVat}
                                fullWidth
                                type="text"
                                value={vat}
                                onChange={(event) => {
                                    setErrorVat(false)
                                    setVat(event.target.value)
                                }}
                                InputLabelProps={{
                                    disableAnimation: true,
                                    focused: false,
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="ENTER YOUR ADDRESS"
                            required
                            autoComplete="street-address"
                            error={!!dataError.address}
                            label="ADDRESS"
                            helperText={dataError.address}
                            fullWidth
                            type="text"
                            value={data.address}
                            onChange={(event) => handleChange(event, 'address')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                {countryList?.length &&
                <>
                    <Grid item xs={12} lg={6}>
                        <FormControl fullWidth>
                            <Autocomplete
                                autoComplete
                                autoSelect
                                value={data.country}
                                options={countryList.map(c => c.name)}
                                onChange={(event,v ) => handleChange({target: {value: v || ''}}, 'country')}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        placeholder="ENTER YOUR COUNTRY"
                                        required
                                        error={!!dataError.country}
                                        label="COUNTRY"
                                        helperText={dataError.country}
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
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <FormControl fullWidth>
                            <Autocomplete
                                autoComplete
                                autoSelect
                                autoCapitalize="characters"
                                value={data.state}
                                options={country?.states.map(c => c.name) || []}
                                onChange={(event, v) => handleChange({target: {value: v || ''}}, 'state')}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        placeholder="ENTER YOUR STATE OR PROVINCE"
                                        error={!!dataError.state}
                                        label="STATE OR PROVINCE"
                                        helperText={dataError.state}
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
                    </Grid>
                </>}
                <Grid item xs={12} lg={6}>
                    <FormControl fullWidth>
                        <TextField
                            autoComplete="city"
                            placeholder="ENTER YOUR CITY"
                            required
                            error={!!dataError.city}
                            label="CITY"
                            helperText={dataError.city}
                            fullWidth
                            type="text"
                            value={data.city}
                            onChange={(event) => handleChange(event, 'city')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <FormControl fullWidth>
                        <TextField
                            placeholder="ENTER YOUR POST CODE"
                            required
                            autoComplete="postal-code"
                            error={!!dataError.postcode}
                            label="POST CODE"
                            helperText={dataError.postcode}
                            fullWidth
                            type="text"
                            value={data.postcode}
                            onChange={(event) => handleChange(event, 'postcode')}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}

export default AddressForm