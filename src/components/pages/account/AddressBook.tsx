import {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {
    Typography,
    CircularProgress,
    Grid, FormGroup, FormControlLabel, FormControl,
} from "@mui/material"
import Button from "../../../components/Button"
import AddressForm from "./AddressForm"
import Checkbox from "../../../components/Checkbox";
import {RootState} from "../../../redux/store";
import {AddressBookPageProps} from "../../../../pages/account/address-book";
import {Customer} from "../../../../@types/woocommerce";
import {API_CUSTOMER_ENDPOINT} from "../../../utils/endpoints";
import {setCustomer} from "../../../redux/customerSlice";

export type ShippingType = {
    firstName: string,
    lastName: string,
    country: string,
    address: string,
    city: string,
    postcode: string,
    company?: string,
    state: string
    vat?: string,
    phone: string
}

export type ShippingErrors = {
    firstName: false | string
    lastName: false | string
    company: false | string
    address: false | string
    city: false | string
    postcode: false | string
    country: false | string
    state: false | string
    vat?: false | string
    phone: false | string
}

export type ShippingData = {
    isShipping: boolean;
    isBilling: boolean;
} & Partial<ShippingType>

const AddressBook = ({ countries }: {countries: AddressBookPageProps['countries']}) => {
    const { customer: {customer}, header: {isMobile} } = useSelector((state: RootState) => state);
    const shippingWP = customer?.shipping as Customer['shipping']
    const billingWP = customer?.billing as Customer['billing']
    const [userUpdated, setUserUpdated] = useState(false)
    const [updatingUser, setUpdatingUser] = useState(false)
    const [vat, setVat] = useState(customer?.meta_data.find(m => m.key === 'vat')?.value ?? '')
    const [errorVat, setErrorVat] = useState<false | string>(false)
    const [error, setError] = useState<boolean | string>(false)
    const dispatch = useDispatch()
    const initialState = (address: Customer['shipping'] | Customer['billing']) => {
        return {
            firstName: address.first_name,
            lastName: address.last_name,
            company: address.company,
            address: address.address_1,
            city: address.city,
            postcode: address.postcode,
            country: address.country,
            state: address.state,
            phone: address.phone
        }
    }
    const errorInitialState: ShippingErrors = {
        firstName: false,
        lastName: false,
        company: false,
        address: false,
        city: false,
        postcode: false,
        country: false,
        state: false,
        phone: false
    }

    const [shippingData, setShippingData] = useState<ShippingType>(initialState(shippingWP))
    const [billingData, setBillingData] = useState<ShippingType>(initialState(billingWP))
    const [shippingError, setShippingError] = useState(errorInitialState)
    const [billingError, setBillingError] = useState(errorInitialState)
    const [current, setCurrent] = useState('shipping')

    const [data, setData] = useState<ShippingData>({
        isShipping: !!shippingWP?.address_1,
        isBilling: !!billingWP?.address_1
    })

    const getErrors = (address: Partial<ShippingType>): ShippingErrors => {
        return {
            firstName: !address.firstName && 'FIRST NAME IS REQUIRED',
            lastName: !address.lastName && 'LAST NAME IS REQUIRED',
            address: !address.address && 'ADDRESS IS REQUIRED',
            city: !address.city && 'CITY IS REQUIRED',
            postcode: !address.postcode && 'POST CODE IS REQUIRED',
            country: !address.country && 'COUNTRY IS REQUIRED',
            phone: false,
            company: false,
            state: false
        }
    }

    const checkAddress = (errors: ShippingErrors) => {
        return (Object.values(errors).every(i => !i))
    }

    const saveData = (address: ShippingType) => {
        return {
            first_name: address.firstName,
            last_name: address.lastName,
            company: address.company,
            address_1: address.address,
            city: address.city,
            postcode: address.postcode,
            country: address.country,
            state: address.state,
        }
    }

    function handleSave() {
        setUpdatingUser(true)
        setShippingError(getErrors(shippingData))
        setBillingError(getErrors(billingData))
        
        !(billingData.country !== 'Italy' || vat) && setErrorVat('VAT ID IS REQUIRED')

        if (customer?.id && checkAddress(getErrors(shippingData)) && (!data.isBilling || checkAddress(getErrors(billingData))) ) {
            const shipping = saveData(shippingData)
            const billing = saveData(billingData)
            fetch(`${API_CUSTOMER_ENDPOINT}/${customer.id}`, {
                method: 'POST',
                headers: [["Content-Type", 'application/json']],
                body: JSON.stringify({
                    shipping,
                    billing,
                    meta_data: [{key: 'vat', value: vat}]
                })
            })
                .then(r => r.json())
                .then((response => {
                    setUserUpdated(true)
                    if (!response.success) {
                        setError(response.message)
                    }
                    dispatch(setCustomer(response.customer))
                }))
                .finally(() => setUpdatingUser(false))
        }
        else {
            if (!checkAddress(getErrors(shippingData))) setCurrent('shipping')
            else setCurrent('billing')
            setUpdatingUser(false)
        }
    }

    function handleBillingClick() {
        if(!data.isBilling) {
            setData({...data, isBilling: true})
            setCurrent('billing')
        }
        else {
            setData({...data, isBilling: false})
            setBillingData({
                firstName: '',
                lastName: '',
                company: '',
                address: '',
                city: '',
                postcode: '',
                country: '',
                state: '',
                phone: ''
            })
            setCurrent('shipping')
        }
    }

    return (
        <form>
            <Typography variant={isMobile ? 'h2' : 'h1'}  component="h1">Address book</Typography>
            {!error && userUpdated && <Typography variant="body1">ADDRESS BOOK SUCCESSFULLY UPDATED</Typography> }
            {userUpdated && <Typography variant="body1" color="error">{error}</Typography> }
            {isMobile && <br />}
            {!data.isShipping && (
                <>
                    <Typography style={{marginBottom: '10px'}} color="secondary" variant="h1" component="h1">No address saved</Typography>
                    <Button variant="contained" color="secondary" fullWidth onClick={() => setData({...data, isShipping: true})}>add new address</Button>
                </>
            )}
            {data.isShipping && current === 'shipping' && (
                <>
                    <Typography style={{marginTop: '20px'}} variant="h2" component="h2">Shipping address</Typography>
                    <AddressForm countries={countries} data={shippingData} setData={setShippingData} dataError={shippingError} setDataError={setShippingError} />
                </>
            )}
            {data.isBilling && current === 'billing' && (
                <>
                    <Typography style={{marginTop: '20px'}} variant="h2" component="h2">Billing address</Typography>
                    <AddressForm
                        countries={countries}
                        data={billingData}
                        setData={setBillingData}
                        dataError={billingError}
                        setDataError={setBillingError}
                        vat={vat}
                        setVat={setVat}
                        errorVat={errorVat}
                        setErrorVat={setErrorVat}
                        isBilling
                    />
                </>
            )}

            <FormControl component="fieldset" style={{width: '100%', padding: '10px 3px'}}>
                <FormGroup aria-label="position" style={{flexDirection: 'row-reverse'}}>
                    {data.isBilling && (
                        <FormControlLabel
                            style={{marginLeft: '20px', marginRight: 0}}
                            value="billing"
                            control={
                                <Checkbox
                                    checked={current === 'billing'}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    onChange={() => setCurrent('billing')}
                                />}
                            label="billing"
                            labelPlacement="end"
                        />
                    )}
                    <FormControlLabel
                        style={{marginRight: 0}}
                        value="shipping"
                        control={
                            <Checkbox
                                checked={current === 'shipping'}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onChange={() => setCurrent('shipping')}
                            />}
                        label="shipping"
                        labelPlacement="end"
                    />
                </FormGroup>
            </FormControl>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button variant="outlined" color="secondary" fullWidth onClick={handleBillingClick}>
                        {data.isBilling ? `Remove billing${isMobile ? '' : ' Address'}`: `Add billing${isMobile ? '' : ' Address'}`}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    {data.isShipping &&
                        <Button variant="contained" color="secondary" fullWidth onClick={handleSave}>
                            {updatingUser ? <CircularProgress size={15} /> : 'save'}
                        </Button>
                    }
                </Grid>
            </Grid>

        </form>
    )
}

export default AddressBook