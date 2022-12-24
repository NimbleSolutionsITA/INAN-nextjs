import React, {useEffect, useState} from "react";
import {Grid, Typography, Divider, Collapse} from "@mui/material"
import Button from "../../../components/Button";
import {formatPrice} from "../../../utils/helpers";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {Order} from "../../../../@types/woocommerce";
import {API_GET_PRODUCTS_ENDPOINT} from "../../../utils/endpoints";
import ItemCard from "./ItemCard";
import {ShopProduct} from "../../../utils/products";

const Orders = () => {
    const { header: {isMobile}, auth: {user} } = useSelector((state: RootState) => state);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [currentOrder, setCurrentOrder] = useState<number | null>(null)
    useEffect(() => {
        if (user) {
            fetch(`/api/customer/${user.id}/orders`)
                .then(r => r.json())
                .then(response => setOrders(response.orders))
        }
    }, []);
    useEffect(() => {
        if (orders.length) {
            const params = new URLSearchParams()
            orders.map(o => o.line_items.map(i => params.append('include', i.product_id.toString())))
            fetch(API_GET_PRODUCTS_ENDPOINT + '?' + params.toString(),
                {headers: { 'Accept-Encoding': 'application/json', 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(response => setProducts(response.products))
        }
    }, [orders]);

    return (
        <>
            <Typography variant={isMobile ? 'h2' : 'h1'} component="h1">Orders</Typography>
            {isMobile && <br />}
            {orders?.map((order, i) => (
                <>
                    {!isMobile && i !== 0 && <br />}
                    {!isMobile && <br />}
                    <Collapse key={order.id} in={currentOrder === order.id} collapsedSize={isMobile ? '37px' : '230px'} orientation="vertical">
                        <div style={{display: 'flex', margin: isMobile ? '5px 0' : undefined}}>
                            <Button color="secondary" lineThrough disablePadding disableGutters disableHover onClick={() => setCurrentOrder(currentOrder === order.id ? null : order.id)}>
                                <Typography component="div" variant={isMobile ? 'body1' : 'h3'}>ORDER ID {order.id}</Typography>
                            </Button>
                            <div style={{flexGrow: 1}} />
                            <Typography component="div" style={{padding: '4px 0'}}>DATE: {order.date_created.toString().slice(0,10)} | <b>{order.status}</b></Typography>
                        </div>
                        <Divider />
                        <Grid container spacing={2}>
                            {products.length && order.line_items.map((item, i) => (
                                <Grid key={item.id} item xs={12} md={4}>
                                    <ItemCard product={products.find(p => p.id === item.product_id)} item={item} />
                                    {isMobile && i !== order.line_items.length - 1 && <Divider light />}
                                </Grid>
                            ))}
                        </Grid>
                        <br />
                        <Divider light />
                        <div style={{display: 'flex', padding: '5px 0'}}>
                            <Typography component="div">SHIPPING</Typography>
                            <div style={{flexGrow: 1}} />
                            <Typography component="div">{formatPrice(Number(order.shipping_total))}</Typography>
                        </div>
                        <Divider light />
                        <div style={{display: 'flex', padding: '5px 0'}}>
                            <div style={{flexGrow: 1}} />
                            <Typography variant="h3" component="div">TOTAL: {formatPrice(Number(order.total))}</Typography>
                        </div>
                        <Divider light />
                        <Typography style={{margin: '5px 0 10px'}}><b>ORDER DETAILS:</b></Typography>
                        <Typography>
                            <b>TO:</b><br />
                            {order.shipping.first_name} {order.shipping.last_name}
                        </Typography>
                        <br />
                        <Typography>
                            <b>ADDRESS:</b><br />
                            {order.shipping.address_1} - {order.shipping.postcode} - {order.shipping.city}{order.shipping.state && order.shipping.state !== order.shipping.city && ` - ${order.shipping.state}`} - {order.shipping.country}
                        </Typography>
                        <br />
                        <Typography style={{marginBottom: '5px'}}>
                            <b>DATE:</b><br />
                            {order.date_created.toString().slice(0,10)}
                        </Typography>
                        <Divider />
                    </Collapse>
                </>
            ))}
        </>
    )
}

export default Orders