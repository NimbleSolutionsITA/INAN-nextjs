import {CartItem} from "../../@types";
import {Divider, Grid, IconButton, Typography} from "@mui/material";
import {formatPrice} from "../utils/helpers";
import Link from "./Link";
import Button from "./Button";
import MinusIcon from "./icons/MinusIcon"
import PlusIcon from "./icons/PlusIcon"
import {useDispatch} from "react-redux";
import {addCartItem, deleteCartItem, updateCartItem} from "../redux/cartSlice";
import {addWishlistItem, deleteWishlistItem, updateWishlistItem} from "../redux/wishlistSlice";

type CartItemProps = {
    itemData: CartItem
    isBag?: boolean
}

const CartItem = ({itemData, isBag}: CartItemProps) => {
    const dispatch = useDispatch()

    const handleRemove = () => {
        isBag ?
            dispatch(deleteCartItem(itemData.id)) :
            dispatch(deleteWishlistItem(itemData.id))
    }
    const handleUpdateQty = (newQty: number) => {
        isBag ?
            dispatch(updateCartItem({id: itemData.id, qty: newQty})) :
            dispatch(updateWishlistItem({id: itemData.id, qty: newQty}))
    }
    const handleMove = () => {
        isBag ?
            dispatch(addWishlistItem(itemData)) :
            dispatch(addCartItem(itemData))
        handleRemove()
    }

    const subPath = itemData.private ? '/private-sales' : '/product'

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Link href={`${subPath}/${itemData.slug}`}><img src={itemData.image} alt={itemData.name} width="100%" /></Link>
            </Grid>
            <Grid item xs={8} style={{display: "flex", flexDirection: "column", paddingBottom: 0}}>
                <Typography variant="h2">
                    {itemData.name}<br />
                    {formatPrice(itemData.price)}
                </Typography>
                <br />
                <div style={{flexGrow: '1'}}>
                    {itemData.leather && <Typography>Leather Type: {itemData.leather}</Typography>}
                    {itemData.size && <Typography>Size: {itemData.size}</Typography>}
                    {itemData.color && <Typography>Color: {itemData.color}</Typography>}
                    <br />
                </div>
                <Divider sx={{opacity: 0.6}} />
                <div>
                    QUANTITY:
                    <IconButton disableRipple disabled={itemData.qty === 1} color="secondary" onClick={() => handleUpdateQty(itemData.qty-1)}>
                        <MinusIcon width="14px" />
                    </IconButton>
                    {itemData.qty}
                    <IconButton disableRipple disabled={itemData.qty >= (itemData.stockQuantity ?? 0)} color="secondary" onClick={() => handleUpdateQty(itemData.qty+1)}>
                        <PlusIcon width="14px" />
                    </IconButton>
                </div>
                <Divider sx={{opacity: 0.6}} />
                <Typography style={{padding: '10px 0'}} variant="h2">SUBTOTAL: {formatPrice(itemData.price * itemData.qty)}</Typography>
            </Grid>
            <Grid item xs={12} style={{paddingTop: 0}}>
                <Divider sx={{opacity: 0.6}} />
                <div style={{display: 'flex'}}>
                    <Button inactive onClick={handleRemove} disableGutters>Remove</Button>
                    <div style={{flexGrow: 1}} />
                    <Button inactive onClick={handleMove} disableGutters>{isBag ? 'move to wishlist' : 'add to bag'}</Button>
                </div>
                <Divider />
                <br />
                <br />
            </Grid>
        </Grid>
    )
}

export default CartItem