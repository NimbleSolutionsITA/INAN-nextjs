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
    shippingR: shippingRcost
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
    }
    const [shippingData, setShippingData] = useState(initialState(shippingWP))
    // @ts-ignore
    const [editShipping, setEditShipping] = useState(!shippingWP.address_1)
    // @ts-ignore
    const [editBilling, setEditBilling] = useState(!!billingWP.address_1)
    const [billingData, setBillingData] = useState(initialState(billingWP))
    const [shippingError, setShippingError] = useState(errorInitialState)
    const [billingError, setBillingError] = useState(errorInitialState)
    const [current, setCurrent] = useState('shipping')
    const [userCreated, setUserCreated] = useState(false)
    const [creatingUser, setCreatingUser] = useState(false)
    const [error, setError] = useState(false)

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
    const saveData = (address, guestEmail = null) => {
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
        }
    }

    function handleSave() {
        setCreatingUser(true)
        {
            // @ts-ignore
            setShippingError(getErrors(shippingData))
        }
        if (editBilling) {
            // @ts-ignore
            setBillingError(getErrors(billingData))
        }

        if (checkAddress(getErrors(shippingData)) && (!editBilling || checkAddress(getErrors(billingData)))) {
            let data: {shipping: Partial<Shipping>, billing?: Partial<Billing>} = {shipping: saveData(shippingData)}
            if (editBilling) {
                data = {...data, billing: saveData(billingData)}
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
            setEditShipping(false)
        } else if (current === 'shipping' && checkAddress(getErrors(shippingData))) {
            setCurrent('billing')
            setCreatingUser(false)
        }
    }

    const handleProceed = async () => {
        setCreatingUser(true)
        let shippingCost
        if (shippingData.country === 'Italy') shippingCost = shippingITcost
        else {
            const continent = continents?.filter(cont => cont.countries.filter(c => c.name === shippingData.country).length > 0)[0]
            if (shippingEU.filter(zone => zone.code === continent.code || zone.code === shippingData.country).length > 0)
                shippingCost = shippingEUcost
            else if (shippingW.filter(zone => zone.code === continent.code || zone.code === shippingData.country).length > 0)
                shippingCost = shippingWcost
            else shippingCost = shippingRcost
        }
        const savedShipping = saveData(shippingData)
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
                    method_id: "flat_rate",
                    method_title: "Flat Rate",
                    total: shippingCost.settings.cost.value
                }]
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
                    method_id: "flat_rate",
                    method_title: "Flat Rate",
                    total: shippingCost.settings.cost.value
                }]})
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
            <Typography style={{float: 'right', margin: '10px 0'}} ><b>Shipping</b></Typography>
            <Typography style={{margin: '10px 0'}}><b>{shippingData.firstName} {shippingData.lastName} {shippingData.company && `- ${shippingData.company}`}</b></Typography>
            <Typography>{shippingData.address ? `${shippingData.address}, ${shippingData.city}, ${shippingData.postcode},${shippingData.state && `${shippingData.state}, `} ${shippingData.country}` : ''}</Typography>
            {billingData.address && (
                <>
                    <Divider />
                    <br />
                    <Typography style={{float: 'right', margin: '10px 0'}} ><b>Billing</b></Typography>
                    <Typography style={{margin: '10px 0'}}><b>{billingData.firstName && billingData.lastName ? `${billingData.firstName} ${billingData.lastName}${billingData.company && `- ${billingData.company}`}` : ''}</b></Typography>
                    <Typography>{billingData.address ? `${billingData.address}, ${billingData.city}, ${billingData.postcode},${billingData.state && `${billingData.state}, `} ${billingData.country}` : ''}</Typography>
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

            <Collapse in={(editShipping && !address.shipping)} style={{marginBottom: '20px'}}>
                <br />
                <Divider />
                <br />
                <Typography variant="h2">{current}</Typography>
                <br />
                {current === 'shipping' && (
                    // @ts-ignore
                    <AddressForm countries={countries} data={shippingData} setData={setShippingData} dataError={shippingError} setDataError={setShippingError} />
                )}
                {current === 'billing' &&
                // @ts-ignore
                <AddressForm countries={countries} data={billingData} setData={setBillingData} dataError={billingError} setDataError={setBillingError} />}
                <FormControl component="fieldset" style={{width: '100%', padding: '10px 3px'}}>
                    <FormGroup aria-label="position" style={{flexDirection: 'row-reverse'}}>
                        {editBilling && (
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
                        )}
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
                            setData({...data, isBilling: !data.isBilling})
                            if (data.isBilling) {
                                setEditBilling(false)
                                setBillingData(emptyAddress)
                                setCurrent('shipping')
                            }
                            else {
                                setCurrent('billing')
                                setEditShipping(true)
                                setEditBilling(true)
                            }
                        }}
                    >
                        {data.isBilling ? `Same as shipping${isMobile ? '' : ' Address'}`: `Different billing${isMobile ? '' : ' Address'}`}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    {editShipping ?
                        <Button disabled={!!address.shipping} fullWidth variant="contained" color="secondary" onClick={handleSave}><b>Save</b></Button> :
                        <Button disabled={!!address.shipping} fullWidth variant="contained" color="secondary"  onClick={() => setEditShipping(true)}><b>Edit</b></Button>
                    }
                </Grid>
            </Grid>
            <Button disabled={!!address.shipping || editShipping} variant="contained" color="secondary" fullWidth onClick={handleProceed}>{creatingUser ? <CircularProgress size={15} /> : 'proceed'}</Button>
        </form>
    )
}

export default PreProcessAddress