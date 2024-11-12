import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Grid, Typography, Divider} from "@mui/material";
import Container from "../../../components/Container";
import Button from "../../../components/Button";
import LoginForm from "../login/LoginForm";
import {RootState} from "../../../redux/store";
import PreProcess from "./PreProcess";
import PaymentError from "./PaymentError";
import PaymentSuccess from "./PaymentSuccess";
import {ShippingProps} from "../../../utils/shop";
import {Order} from "../../../../@types/woocommerce";
import {useIsMobile} from "../../../utils/layout";

type CheckoutProps = {
    woocommerce: ShippingProps
}

const Checkout = ({woocommerce}: CheckoutProps) => {
    const { cart: {items: cart}, auth: {authenticated} } = useSelector((state: RootState) => state);
    const isMobile = useIsMobile()
    const [isGuest, setIsGuest] = useState(false)
    const [paypalSuccess, setPaypalSuccess] = useState<false | Partial<Order>>(false);
    const [paypalError, setPaypalError] = useState<false | string>(false);
    const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({});

    useEffect(() => {
        if (!cart.length && !paypalSuccess) {
           // router.back()
            console.log('no cart')
        }
    }, [])

    return (
        <Container headerPadding>
            {!isMobile  && <br/>}
            {!isGuest && !authenticated ?
                cart.length &&
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} style={{display: 'flex', flexDirection: 'column'}}>
                        {isMobile  && <br/>}
                        {isMobile  && <br/>}
                        {isMobile  && <br/>}
                        <Typography variant="h2">CONTINUE AS GUEST</Typography>
                        {!isMobile && (
                            <>
                                <Divider />
                                <br />
                            </>
                        )}
                        <Typography>CONTINUE WITHOUT REGISTRATION.</Typography>
                        <div style={{flexGrow: 1}}/>
                        <br />
                        <Button fullWidth variant="contained" color="secondary" onClick={() => setIsGuest(true)}>continue as guest</Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {isMobile  && <br/>}
                        {isMobile  && <br/>}
                        <Typography variant="h2">LOGIN</Typography>
                        {!isMobile  && <Divider/>}
                        <LoginForm />
                    </Grid>
                    <Grid item xs={12} md={4} style={{display: 'flex', flexDirection: 'column'}}>
                        {isMobile  && <br/>}
                        {isMobile  && <br/>}
                        <Typography variant="h2">REGISTER</Typography>
                        {!isMobile  && <Divider/>}
                        <br />
                        <Typography>REGISTER TO COMPLETE CHECKOUT MORE QUICKLY, REVIEW ORDER INFORMATION and much more.</Typography>
                        <div style={{flexGrow: 1, minHeight: '10px'}}/>
                        <Button fullWidth variant="contained" color="secondary" href="/register?origin=checkout">register</Button>
                    </Grid>
                </Grid> :
                <>
                    {!paypalSuccess && !paypalError && <PreProcess currentOrder={currentOrder} setCurrentOrder={setCurrentOrder} woocommerce={woocommerce} isGuest={isGuest} setPaypalSuccess={setPaypalSuccess} setPaypalError={setPaypalError} />}
                    {paypalError && <PaymentError setPaypalError={setPaypalError} />}
                    {paypalSuccess && <PaymentSuccess order={paypalSuccess} />}
                </>
            }
        </Container>
    )
}

export default Checkout