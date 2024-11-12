import {Typography} from "@mui/material";
import SplitLayout from "../../SplitLayout";
import CartItem from "../../CartItem";
import Container from "../../Container";
import Button from "../../Button";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

const Wishlist = () => {
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    return (
        <Container headerPadding>
            <br />
            {wishlist?.length ?
                <SplitLayout
                    left={wishlist.map(i => <CartItem key={i.id+i.qty} itemData={i} />)}
                    right={
                        <>
                            <Button inactive disableGutters disablePadding href="/customer-service/shipping">Shipping and returns</Button><br />
                            <Button inactive disableGutters disablePadding href="/customer-service">need help?</Button>
                        </>
                    }
                /> :
                <Typography variant="h1" component="h1" color="secondary">THE WISHLIST IS EMPTY</Typography>
            }
        </Container>
    )
}

export default Wishlist