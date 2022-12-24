import React from "react";
import {Typography, Divider, Grid} from "@mui/material"
import CartItems from "./CartItems";
import Button from "../../../components/Button";
import {formatPrice} from "../../../utils/helpers";
import {Order} from "../../../../@types/woocommerce";

const PaymentSuccess = ({order}: {order: Partial<Order>}) => {
    return (
        <>
            <Typography variant="h1">
                THANK YOU.<br />
                YOUR ORDER {order.id}<br />
                IS CONFIRMED.
            </Typography>
            <Divider />
            <Typography variant="h2">Order details:</Typography>
            <br />
            <Typography>
                <b>TO:</b><br />
                {order.shipping?.first_name} {order.shipping?.last_name}
            </Typography>
            <br />
            <Typography>
                <b>ADDRESS:</b><br />
                {order.shipping?.address_1} - {order.shipping?.postcode} - {order.shipping?.city}{order.shipping?.state && order.shipping?.state !== order.shipping?.city && ` - ${order.shipping?.state}`} - {order.shipping?.country}
            </Typography>
            <br />
            <Typography>
                <b>DATE:</b><br />
                {order.date_created?.toString().slice(0,10)}
            </Typography>
            <br />
            <Divider light />
            <div style={{display: 'flex'}}>
                <Typography style={{margin: '4px 0'}}>SHIPPING</Typography>
                <div style={{flexGrow: 1}} />
                <Typography style={{margin: '4px 0'}}>{formatPrice(Number(order.shipping_total))}</Typography>
            </div>
            <Divider />
            <div style={{display: 'flex'}}>
                <div style={{flexGrow: 1}} />
                <Typography variant="h2">TOTAL: {formatPrice(Number(order.total))}</Typography>
            </div>
            <Divider />
            <Grid container>
                <Grid item xs={6} sm={3} style={{marginTop: '20px'}}>
                    <CartItems />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={6}>
                    <Button fullWidth variant="contained" href="/" color="secondary" style={{marginTop: '10px'}}>Back to homepage</Button>
                </Grid>
            </Grid>
        </>
    )
}

export default PaymentSuccess