import Link from "../../Link"
import Button from "../../Button"
import styled from "@emotion/styled"
import {Typography} from "@mui/material";
import {ShopProduct} from "../../../utils/products";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {addWishlistItem} from "../../../redux/wishlistSlice";

const CardWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 6px;
`
const ImageWrapper = styled.div<{bg: string, bgHover?: string}>`
    flex-grow: 1;
    background-image: ${({bg}) => `url(${bg})`};
    background-size: cover;
    background-position: center;
    background-color: #e9e9e9;
    position: relative;
      &:hover {
        background-image: ${({bgHover}) => bgHover && `url(${bgHover})`};
      }
      &:hover > button {
        opacity: 1;
        z-index: 1;
      }
    button {
      position: absolute;
      top: 10px;
      right: 10px;
      opacity: 0;
      transition: opacity .25s ease;
    }
    img {
      width: 100%;
      opacity: 0;
    }
`
const ContentWrapper = styled.div`
  text-transform: uppercase;
  p {
      min-height: 18px;
  }
`
const Sale = styled.span`
  text-decoration: line-through;
`

const ProductCard = ({product}: {product: ShopProduct}) => {
    const { isMobile} = useSelector((state: RootState) => state.header);
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(addWishlistItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            leather: product.attributes.filter(attribute => attribute.id === 3)[0]?.options[0],
            size: product.attributes.filter(attribute => attribute.id === 2)[0]?.options[0],
            color: product.attributes.filter(attribute => attribute.id === 4)[0]?.options[0],
            image: product.images[0].src,
            slug: product.slug,
            qty: 1
        }))
    }

    return (
        <CardWrapper key={product.id}>
            {product.images[0] && (
                <ImageWrapper
                    bg={product.images[0]?.woocommerce_thumbnail}
                    bgHover={product.images[1]?.woocommerce_thumbnail}
                >
                    {!isMobile && <Button disableHover disableGutters disableRipple onClick={handleClick}>add to wishlist</Button>}
                    <Link href={`/product/${product.slug}`}>
                        <img key={product.images[0].id} src={product.images[0]?.woocommerce_thumbnail} alt={product.images[0].alt}/>
                    </Link>
                </ImageWrapper>
            )}
            <ContentWrapper>
                <Typography style={{paddingBottom: 0}} component="p" variant="body1"><b>{product.name}</b></Typography>
                <Typography style={{padding: 0}} component="p" variant="body1">
                    { product.type === 'variable' && product.attributes.find(attribute => attribute.id === 3)?.options.find(opt => opt === 'Vegan') && (
                        isMobile ? 'Vegan option' : 'Vegan leather option'
                    )}
                </Typography>
                <Typography component="p" variant="body1">
                    {product.on_sale ?
                        <><Sale>€ {product.regular_price}</Sale> € {product.sale_price}</> :
                        `€ ${product.price}`
                    }
                    <>
                        {isMobile && <br/>}
                        {product.stock_status === 'outofstock' && ` ${isMobile ? '' : ' -'} out of stock`}
                        {product.stock_status === 'onbackorder' && ` ${isMobile ? '' : ' -'} pre order`}
                        {!!product.stock_quantity && product.stock_quantity < 4 && product.stock_quantity > 0 && `${isMobile ? '' : ' -'} only ${product.stock_quantity} in stock`}
                        {product.featured && (
                            <>{!isMobile ? '' : ' -'} <span style={{color: 'red'}}>new</span></>
                        )}
                    </>
                </Typography>
            </ContentWrapper>
        </CardWrapper>
    )
}

export default ProductCard