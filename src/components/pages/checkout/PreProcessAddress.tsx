import {Dispatch, SetStateAction, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {
    Typography,
    Divider,
    CircularProgress,
    Grid,
    Collapse,
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel
} from "@mui/material"
import Button from "../../../components/Button"
import AddressForm from "../account/AddressForm";
import {regExpEmail} from "../../../utils/helpers";
import Checkbox from "../../../components/Checkbox";
import {RootState} from "../../../redux/store";
import {PreProcessAdress} from "./PreProcess";
import {CheckoutPageProps} from "../../../../pages/checkout";
import {Billing, Customer, Order, Shipping} from "../../../../@types/woocommerce";
import {API_CUSTOMER_ENDPOINT} from "../../../utils/endpoints";
import {setCustomer} from "../../../redux/customerSlice";
import {createOrder} from "../../../utils/helpers";

type PreProcessAddressProps = {
    isGuest: boolean
    address: PreProcessAdress
    setAddress: Dispatch<SetStateAction<PreProcessAdress>>
    userInfo?:  Customer | null
    woocommerce: CheckoutPageProps['woocommerce']
    setOrder: Dispatch<SetStateAction<Partial<Order>>>
}

const PreProcessAddress = ({isGuest, address, setAddress, userInfo, setOrder, woocommerce: {
    continents,
    countries,
    shippingLocationsEU: shippingEU,
    shippingLocationsW: shippingW,
    shippingIT: shippingITcost,
    shippingEU: shippingEUcost,
    shippingW: shippingWcost,
    shippingR: shippingRcost,
    shippingUK: shippingUKcost
}}: PreProcessAddressProps) => {
    const { header: {isMobile}, cart: {items: cart}, auth: {user} } = useSelector((state: RootState) => state);

    const dispatch = useDispatch()

    const emptyAddress = {
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        city: '',
        postcode: '',
        country: '',
        state: '',
        phone: ''
    }
    // @ts-ignore
    const shippingWP = isGuest ? emptyAddress : userInfo.shipping
    // @ts-ignore
    const billingWP = isGuest ? emptyAddress : userInfo.billing
    // @ts-ignore
    const initialState = (address) => {
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
    const errorInitialState = {
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
    const [shippingData, setShippingData] = useState(initialState(shippingWP))
    // @ts-ignore
    const [editShipping, setEditShipping] = useState(!!shippingWP.address_1)
    // @ts-ignore
    const [editBilling, setEditBilling] = useState(!billingWP.address_1)
    const [billingData, setBillingData] = useState(initialState(billingWP))
    const [shippingError, setShippingError] = useState(errorInitialState)
    const [billingError, setBillingError] = useState(errorInitialState)
    const [current, setCurrent] = useState('billing')
    const [userCreated, setUserCreated] = useState(false)
    const [creatingUser, setCreatingUser] = useState(false)
    const [error, setError] = useState(false)
    const [vat, setVat] = useState(userInfo?.meta_data.find(m => m.key === 'vat')?.value ?? '')
    const [errorVat, setErrorVat] = useState<false | string>(false)

    const vatProps = {vat, setVat, errorVat, setErrorVat}

    const [guestEmail, setGuestEmail] = useState('')
    const [guestEmailError, setGuestEmailError] = useState(false)

    const [data, setData] = useState({
        // @ts-ignore
        isShipping: !!shippingWP.address_1,
        // @ts-ignore
        isBilling: !!billingWP.address_1,
        honeypot: false,
    })

    const cartItems = cart.map(i => {
        return {product_id: i.id, quantity: i.qty}
    })
    // @ts-ignore
    const getErrors = (address) => {
        return {
            firstName: !address.firstName && 'FIRST NAME IS REQUIRED',
            lastName: !address.lastName && 'LAST NAME IS REQUIRED',
            address: !address.address && 'ADDRESS IS REQUIRED',
            city: !address.city && 'CITY IS REQUIRED',
            postcode: !address.postcode && 'POST CODE IS REQUIRED',
            country: !address.country && 'COUNTRY IS REQUIRED',
        }
    }

    // @ts-ignore
    const checkAddress = (errors) => {
        return (Object.values(errors).every(i => !i))
    }

    // @ts-ignore
    const saveData = (address) => {
        return {
            first_name: address.firstName,
            last_name: address.lastName,
            company: address.company,
            address_1: address.address,
            city: address.city,
            postcode: address.postcode,
            country: address.country,
            state: address.state,
            // @ts-ignore
            email: guestEmail || user.email,
            phone: address.phone
        }
    }

    function handleSave() {
        setCreatingUser(true)

        // @ts-ignore
        setBillingError(getErrors(billingData))
        if (editShipping) {
            // @ts-ignore
            setShippingError(getErrors(shippingData))
        }

        !(billingData.country !== 'Italy' || vat) && setErrorVat('VAT ID IS REQUIRED')

        if (checkAddress(getErrors(billingData)) && (!editShipping || checkAddress(getErrors(shippingData))) && (billingData.country !== 'Italy' || vat)) {
            let data: {shipping?: Partial<Shipping>, billing: Partial<Billing>, meta_data: {key: string, value: string}[]} = {
                billing: saveData(billingData),
                shipping: saveData(billingData),
                meta_data: [{key: 'vat', value: vat}]
            }
            if (editShipping) {
                data = {...data, shipping: saveData(shippingData)}
            }
            !isGuest && user && fetch(`${API_CUSTOMER_ENDPOINT}/${user.id}`, {
                method: 'POST',
                headers: [["Content-Type", 'application/json']],
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then((response => {
                    setUserCreated(true)
                    if (!response.success) {
                        setError(response.message)
                    }
                    dispatch(setCustomer(response.customer))
                }))
                .finally(() => setCreatingUser(false))
            setEditBilling(false)
        } else if (current === 'billing' && !checkAddress(getErrors(billingData)) && (billingData.country !== 'Italy' || vat)) {
            setCurrent('shipping')
        } else if (current === 'shipping' && !checkAddress(getErrors(shippingData))) {
            setCurrent('billing')
        }
        setCreatingUser(false)
    }

    const getCountries = (code: string) => continents.find((c) => c.code === code)?.countries ?? []


    function getShippingMethodByCountryCode(countryCode: string | undefined) {

        // Find the country object based on the countryCode
        const country = countries.find((c) => c.code === countryCode);

        if (!country) {
            return null; // Country not found, handle this case as needed
        }

        const countriesEU = getCountries('EU');
        const countriesW = [...getCountries('A'), ...getCountries('NA')];

        // Check for the shipping method based on the country code
        if (countryCode === 'IT') {
            return shippingITcost;
        } else if (countryCode === 'GB') {
            return shippingUKcost;
        } else if (countriesEU.some((location) => location.code === countryCode)) {
            return shippingEUcost;
        } else if (countriesW.some((location) => location.code === countryCode)) {
            return shippingWcost;
        } else {
            return shippingRcost; // Default shipping method
        }
    }

    const handleProceed = async () => {
        setCreatingUser(true)
        let shippingCost
        const country = data.isShipping ? shippingData.country : billingData.country
        const countryCode = countries.find(c => c.name === country)?.code
        const shippingClass = getShippingMethodByCountryCode(countryCode)

        /*if (country === 'Italy') shippingCost = shippingITcost
        else {
            const continent = continents?.find(cont => cont.countries.find(c => c.name === country))
            if (shippingEU.filter(zone => zone.code === continent?.code || zone.code === country).length > 0)
                shippingCost = shippingEUcost
            else if (shippingW.filter(zone => zone.code === continent?.code || zone.code === country).length > 0)
                shippingCost = shippingWcost
            else shippingCost = shippingRcost
        }*/
        const savedShipping = saveData(shippingData ?? billingData)
        if (isGuest) {
            // @ts-ignore
            setGuestEmailError((!guestEmail.match(regExpEmail) || !guestEmail) && 'PLEASE ENTER A VALID EMAIL')
            if (!guestEmail.match(regExpEmail))
                return
            setAddress({shipping: savedShipping, billing: saveData(billingData)})
            const {order: newOrder} = await createOrder({
                shipping: saveData(shippingData),
                billing: saveData(billingData),
                line_items: cartItems,
                shipping_lines: [{
                    method_id: shippingClass?.method_id ?? "flat_rate",
                    method_title: shippingClass?.method_id ?? "Flat Rate",
                    total: shippingClass?.settings.cost.value
                }],
                // @ts-ignore
                meta_data: [{key: 'vat', value: vat}]
            })
            setOrder(newOrder)
            setCreatingUser(false)
            return
        }
        setAddress({shipping: savedShipping, billing: billingData.address ? saveData(billingData) : {}})
        if (user) {
            const {order: newOrder} =  await createOrder({
                shipping: saveData(shippingData),
                billing: billingData.address && saveData(billingData) || undefined,
                line_items: cartItems,
                customer_id: user.id,
                shipping_lines: [{
                    id: shippingClass?.id,
                    method_id: shippingClass?.method_id ?? "flat_rate",
                    method_title: shippingClass?.method_id ?? "Flat Rate",
                    total: shippingClass?.settings.cost.value
                }],
                // @ts-ignore
                meta_data: [{key: 'vat', value: vat}]
            })
            setOrder(newOrder)
        }
        setCreatingUser(false)
    }
    return (
        <form>
            <Typography variant="h1" component="h1">Address</Typography>
            <Divider />
            {userCreated && <Typography variant="body1" color="error">{error}</Typography> }
            <br />
            <Typography style={{float: 'right', margin: '10px 0'}} ><b>Billing</b></Typography>
            <Typography style={{margin: '10px 0'}}><b>{billingData.firstName && billingData.lastName ? `${billingData.firstName} ${billingData.lastName}${billingData.company && `- ${billingData.company}`}` : ''}</b></Typography>
            <Typography>{billingData.address ? `${billingData.address}, ${billingData.city}, ${billingData.postcode},${billingData.state && `${billingData.state}, `} ${billingData.country}` : ''}</Typography>
            {shippingData.address && (
                <>
                    <Divider />
                    <br />
                    <Typography style={{float: 'right', margin: '10px 0'}} ><b>Shipping</b></Typography>
                    <Typography style={{margin: '10px 0'}}><b>{shippingData.firstName} {shippingData.lastName} {shippingData.company && `- ${shippingData.company}`}</b></Typography>
                    <Typography>{shippingData.address ? `${shippingData.address}, ${shippingData.city}, ${shippingData.postcode},${shippingData.state && `${shippingData.state}, `} ${shippingData.country}` : ''}</Typography>
                </>
            )}
            {isGuest &&
                <>
                    <br />
                    <FormControl fullWidth>
                        <TextField
                            disabled={!!address.shipping}
                            placeholder="ENTER YOUR EMAIL"
                            required
                            autoComplete="email"
                            error={!!guestEmailError}
                            label="EMAIL"
                            helperText={guestEmailError}
                            fullWidth
                            type="email"
                            value={guestEmail}
                            onChange={(event) => setGuestEmail(event.target.value)}
                            InputLabelProps={{
                                disableAnimation: true,
                                focused: false,
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </>
            }

            <Collapse in={(editBilling && !address.billing)} style={{marginBottom: '20px'}}>
                <br />
                <Divider />
                <br />
                <Typography variant="h2">{current}</Typography>
                <br />
                {current === 'billing' &&
                // @ts-ignore
                <AddressForm countries={countries} data={billingData} setData={setBillingData} dataError={billingError} setDataError={setBillingError} isBilling {...vatProps} />
                }
                {current === 'shipping' && (
                    // @ts-ignore
                    <AddressForm countries={countries} data={shippingData} setData={setShippingData} dataError={shippingError} setDataError={setShippingError} />
                )}
                <FormControl component="fieldset" style={{width: '100%', padding: '10px 3px'}}>
                    <FormGroup aria-label="position" style={{flexDirection: 'row-reverse'}}>
                        {editShipping && (
                            <FormControlLabel
                                style={{marginRight: 0}}
                                value="shipping"
                                control={
                                    <Checkbox
                                        edge="end"
                                        checked={current === 'shipping'}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        onChange={() => setCurrent('shipping')}

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
                                    checked={current === 'billing'}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    onChange={() => setCurrent('billing')}
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
                        style={{marginBottom: '20px'}}
                        disabled={!!address.shipping}
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disableGutters
                        onClick={() => {
                            setData({...data, isShipping: !data.isShipping})
                            if (data.isShipping) {
                                setEditShipping(false)
                                setShippingData(emptyAddress)
                                setCurrent('billing')
                            }
                            else {
                                setCurrent('shipping')
                                setEditBilling(true)
                                setEditShipping(true)
                            }
                        }}
                    >
                        {data.isShipping ? `Same as billing${isMobile ? '' : ' Address'}`: `Different shipping${isMobile ? '' : ' Address'}`}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    {editBilling ?
                        <Button disabled={!!address.billing} fullWidth variant="contained" color="secondary" onClick={handleSave}><b>Save</b></Button> :
                        <Button disabled={!!address.billing} fullWidth variant="contained" color="secondary"  onClick={() => setEditBilling(true)}><b>Edit</b></Button>
                    }
                </Grid>
            </Grid>
            <Button disabled={!!address.billing || editBilling} variant="contained" color="secondary" fullWidth onClick={handleProceed}>{creatingUser ? <CircularProgress size={15} /> : 'proceed'}</Button>
        </form>
    )
}

export default PreProcessAddress