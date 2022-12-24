import {Divider, Typography} from "@mui/material";
import {formatPrice} from "../../../utils/helpers";
import SplitLayout from "../../SplitLayout";
import CartItem from "../../CartItem";
import Container from "../../Container";
import Button from "../../Button";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

const Bag = () => {
    const cart = useSelector((state: RootState) => state.cart.items);
    return (
        <Container headerPadding>
            <br />
            {cart?.length ?
                <SplitLayout
                    left={cart.map(i => <CartItem isBag key={i.id+i.qty} itemData={i} />)}
                    right={
                        <>
                            <Typography variant="h2">Summary</Typography>
                            <br />
                            {cart.map(i => <Typography key={i.id} style={{padding: '2px 0'}}>{i.name} - quantity: {i.qty}<span style={{float: 'right'}}>{formatPrice(i.price * i.qty)}</span></Typography>)}
                            <Divider style={{margin: '10px 0'}} light />
                            <Typography variant="h2">total<span style={{float: 'right'}}>{formatPrice(cart.map(i => i.qty * i.price).reduce((i, sum) =>  i + sum))}</span></Typography>
                            <br />
                            <Button variant="contained" color="secondary" href="/checkout" fullWidth>Checkout</Button>
                            <br />
                            <br />
                            <Button inactive disableGutters disablePadding href="/customer-service/shipping">Shipping and returns</Button><br />
                            <Button inactive disableGutters disablePadding href="/customer-service">need help?</Button>
                        </>
                    }
                /> :
                <Typography variant="h1" component="h1" color="secondary">THE BAG IS EMPTY</Typography>
            }
        </Container>
    )
}

export default Bag