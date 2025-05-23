import {ReactNode, useState} from "react"
import Button from "../../Button";
import RightDrawer from "../../RightDrawer";
import {Grid, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {addCartItem} from "../../../redux/cartSlice";

type AddToBagProps = {
    itemId: number
    name: string
    price: number
    leather: string | null
    size: string | null
    color: string | false | null
    image: string
    slug: string
    children?: ReactNode | string
    isPrivate?: boolean
    stockQuantity?: number
}

const AddToBag = ({itemId, name, price, leather, size, color, image, slug, children = 'add to bag', isPrivate, stockQuantity}: AddToBagProps) => {
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const qty = cart?.filter(item => item.id === itemId)[0]?.qty

    const handleAddToCart = () => {
        if(itemId) {
            dispatch(addCartItem({
                id: itemId,
                name,
                price: Number(price),
                leather,
                size,
                color,
                image,
                slug,
                qty: 1,
                private: isPrivate,
                stockQuantity
            }))
            setOpen(true)
        }
    }

    return (
        <>
            <Button fullWidth onClick={handleAddToCart} color="secondary" variant="contained">{children}</Button>
            <RightDrawer open={open} setOpen={setOpen} title="Added to shopping bag">
                <Grid container spacing={2}>
                    <Grid style={{paddingTop: 0, marginTop: '-2px'}} item xs={6}>
                        <img width='100%' src={image} alt={name}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography><b>{name}</b></Typography>
                        <Typography><b>€ {price}</b></Typography>
                        {leather && (
                            <>
                                <br />
                                <Typography>Leather Type:</Typography>
                                <Typography>{leather}</Typography>
                            </>
                        )}
                        {size && (
                            <>
                                <br />
                                <Typography>size:</Typography>
                                <Typography>{size}</Typography>
                            </>
                        )}
                        {color && (
                            <>
                                <br />
                                <Typography>color:</Typography>
                                <Typography>{color}</Typography>
                            </>
                        )}
                        <br />
                        <Typography>Quantity:</Typography>
                        <Typography>{qty}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth href="/bag" color="secondary" variant="outlined">View bag</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth href="/checkout" color="secondary" variant="contained">Checkout</Button>
                    </Grid>
                </Grid>
            </RightDrawer>
        </>
    )
}

export default AddToBag