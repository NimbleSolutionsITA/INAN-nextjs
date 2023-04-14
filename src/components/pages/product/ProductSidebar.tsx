import {Dispatch, SetStateAction, useState} from "react"
import Link from "../../Link"
import Button from "../../Button"
import styled from "@emotion/styled";
import {Collapse, Divider, Typography} from "@mui/material";
import RichText from "../../RichText";
import ExpansionPanel from "./ExpansionPanel";
import {ProductPageProps} from "../../../utils/layout";
import {ProductAttribute} from "../../../../@types/woocommerce";
import CheckboxFromControl from "./CheckboxFormControl";
import {ShopProduct, Variation} from "../../../utils/products";
import SizeGuide from "./SizeGuide";
import AddToBag from "./AddToBag";
import GetNotified from "./GetNotified";
import {useDispatch} from "react-redux";
import {addWishlistItem} from "../../../redux/wishlistSlice";
import {useRouter} from "next/router";

type ProductSidebarProps = {
    variations: Variation[]
    product: ProductPageProps['product']
    colors: ProductAttribute[]
    isMobile: boolean
    sizeGuide: ProductPageProps['sizeGuide']
    currentProduct: ShopProduct | Variation
    setCurrentProduct: Dispatch<SetStateAction<ShopProduct | Variation>>
    colorVariations: ShopProduct[]
}

const Sale = styled.span`
  text-decoration: line-through;
`
const AddToBagWrapper = styled.div`
  margin: 40px 0;
`

const ProductSidebar = ({variations, product, colors, isMobile, sizeGuide, currentProduct, setCurrentProduct, colorVariations}: ProductSidebarProps) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const getColorOptions = () => {
        const productColorOptions = product.attributes.find(a => a.id === 4)?.options
        const productVariationColorOptions = colorVariations.map(p => p.attributes.find(a => a.id === 4)?.options[0]).filter(c => typeof c === 'string') as string[]
        if (product.type === 'variable' && !productVariationColorOptions.length)
            return productColorOptions ?? null
        if (productColorOptions?.length && productVariationColorOptions.length)
            return [
                productColorOptions[0],
                ...productVariationColorOptions
            ]
        return null
    }
    const leatherOptions = product?.attributes.find(attribute => attribute.id === 3)?.options
    const colorOptions = getColorOptions()
    const sizeOptions = product?.attributes.find(attribute => attribute.id === 2)?.options
    const stockStatus = currentProduct.manage_stock ? currentProduct?.stock_status : product.stock_status
    const isPreOrder = stockStatus === 'onbackorder'
    const isOutOfStock = stockStatus === 'outofstock'
    const isVeganOption = !!leatherOptions?.find(opt => opt === 'Vegan')

    const [colorType, setColorType] = useState<string | null>(currentProduct.attributes.find(a => a.id === 4)?.option ?? (colorOptions && colorOptions[0]) ?? null)
    const [leatherType, setLeatherType] = useState<string | null>(currentProduct.attributes.find(a => a.id === 3)?.option ?? (leatherOptions && leatherOptions[0]) ?? null)
    const [sizeType, setSizeType] = useState<string | null>( currentProduct.attributes.find(a => a.id === 2)?.option ?? (sizeOptions && sizeOptions[0]) ?? null)
    const [openDetails, setOpenDetails] = useState(false)

    const hasLeatherVariations = variations.length && variations[0].attributes.some(attribute => attribute.id === 3)
    const hasSizeVariations = variations.length && variations[0].attributes.some(attribute => attribute.id === 2)
    const hasColorVariations = variations.length && variations[0].attributes.some(attribute => attribute.id === 1)

    const itemId = currentProduct.id

    const getVariation = (colorType: string | null, sizeType: string | null, leatherType: string | null) => {
        const vars = variations.filter(variation => {
                const hasLeatherType = !hasLeatherVariations || (leatherType ? variation.attributes.some(attribute => attribute.id === 3 && attribute.option === leatherType) : true)
                const hasSizeType = !hasSizeVariations || (sizeType ? variation.attributes.some(attribute => attribute.id === 2 && attribute.option === sizeType) : true)
                const hasColorType = !hasColorVariations || (colorType ? variation.attributes.some(attribute => attribute.id === 1 && attribute.option === leatherType) : true)
                return hasLeatherType && hasColorType && hasSizeType
            }
        )
        return vars[0] ?? null

    }

    const setColor = (color: string) => {
        if (color !== colorType) {
            const colorVariation = colorVariations.find(p => p.attributes.find(a => a.id === 4)?.options[0] === color)
            if (colorVariation)
                router.push(`/product/${colorVariation.slug}`)
            else {
                setCurrentProduct(variations?.length ?
                    getVariation(color, sizeType, leatherType) :
                    product)
                setColorType(color)
            }

        }
    }

    const setLeather = (leather: string) => {
        setCurrentProduct(variations?.length ?
            getVariation(colorType, sizeType, leather) :
            product
        )
        setLeatherType(leather)
    }

    const setSize = (size: string) => {
        setCurrentProduct(variations?.length ?
            getVariation(colorType, size, leatherType) :
            product
        )
        setSizeType(size)
    }

    return(
        <>
            <Typography component="h2" variant="h2" style={{paddingTop: '10px'}}>{product?.name}<br />
                {currentProduct.on_sale ?
                    <><Sale>€ {currentProduct.regular_price}</Sale> - € {currentProduct.sale_price}</> :
                    `€ ${currentProduct.price}`
                }
                {isOutOfStock && ' - out of stock'}
                {isPreOrder && ' - pre-order'}
            </Typography>
            {!isMobile && (
                <>
                    <RichText>{product.short_description}</RichText>
                    <Collapse in={openDetails}>
                        <RichText style={{padding: '0 0 1rem'}}>{product.description}</RichText>
                    </Collapse>
                    <Button sx={{padding: 0}} variant="text" color="inherit" onClick={() => setOpenDetails(!openDetails)}><b>{openDetails ? 'less details' : 'more details'}</b></Button>
                    <Divider style={{marginTop: '5px'}} />
                </>
            )}
            {isVeganOption && leatherOptions && (
                <>
                    <ExpansionPanel title={<Typography><b>Leather type :</b> {leatherType || leatherOptions[0]}</Typography>}>
                        <CheckboxFromControl options={leatherOptions} type={leatherType} setType={setLeather} />
                    </ExpansionPanel>
                    <Divider />
                </>
            )}
            {colorOptions && (
                <>
                    <ExpansionPanel title={<Typography><b>Color :</b> {colorType}</Typography>}>
                        <CheckboxFromControl colors={colors} options={colorOptions} type={colorType} setType={setColor} isCrossed />
                    </ExpansionPanel>
                    <Divider />
                </>
            )}
            <ExpansionPanel title={<Typography><b>Size :</b> {sizeType || (sizeOptions ? sizeOptions[0] : 'one size')}</Typography>}>
                {sizeOptions && (
                    <CheckboxFromControl options={sizeOptions} type={sizeType} setType={setSize} />
                )}
                <div>
                    {product.acf.size && (
                        <Typography component="p" variant="body1">
                            {product.acf.size}
                        </Typography>
                    )}
                    <br />
                    {sizeGuide && <SizeGuide sizes={sizeGuide}/>}
                </div>
            </ExpansionPanel>
            <Divider />
            {isMobile && (
                <>
                    <RichText>{product.short_description}</RichText>
                    <Collapse in={openDetails}>
                        <RichText style={{padding: '0 0 1rem'}}>{product.description}</RichText>
                    </Collapse>
                    <Button style={{padding: '0 0 5px'}} variant="text" color="inherit" onClick={() => setOpenDetails(!openDetails)}><b>{openDetails ? 'less details' : 'more details'}</b></Button>
                </>
            )}
            <AddToBagWrapper>
                {isPreOrder && (
                    <>
                        <Typography variant="body2" component="p">{product.acf.pre_order ?? 'Expected shipping in 60 days'}</Typography>
                        <AddToBag name={product.name} itemId={itemId} leather={leatherType} size={sizeType} color={colorType} image={product.images[0].src} slug={product.slug} price={Number(product.price)}>pre-order</AddToBag>
                    </>
                )}
                {isOutOfStock && (
                    <GetNotified isMobile={isMobile} colorType={colorType} leatherType={leatherType} sizeType={sizeType} product={product} itemId={itemId} />
                )}
                {!isPreOrder && !isOutOfStock && (
                    <AddToBag name={product.name} itemId={itemId} leather={leatherType} size={sizeType} color={colorType} image={product.images[0].src} slug={product.slug} price={Number(product.price)} />
                )}
                <Button disableGutters disableRipple onClick={() => dispatch(addWishlistItem({
                    id: itemId,
                    name: product.name,
                    price: Number( product.price),
                    leather: leatherType ,
                    size: sizeType,
                    color: colorType,
                    image: product.images[0].src,
                    slug: product.slug,
                    qty: 1
                }))}>add to whishlist</Button>
            </AddToBagWrapper>
            {!isMobile && <Divider />}
            <ExpansionPanel plusMinus title={<Typography>Special enquiries</Typography>}>
                <Typography component="p" variant="body1">
                    If our sizes, colors or leather types don’t match your desires we’ll be happy to assist you in creating your own inan belt. <br /><br />
                    go to : <Link color="inherit" href="/made-to-order"><b>Made to order</b></Link>
                </Typography>
            </ExpansionPanel>
            <Divider />
            <ExpansionPanel plusMinus title={<Typography>Product care</Typography>}>
                <Typography component="p" variant="body1">
                    Spot clean only. After using your belt store it in its dust bag. In case of stain use a wet cloth to remove dirt. <br /><br />
                    go to : <Link color="inherit" href="/customer-service/product-care"><b>Product care</b></Link>
                </Typography>
            </ExpansionPanel>
            <Divider />
            <ExpansionPanel plusMinus title={<Typography>Shipping and returns</Typography>}>
                <Typography component="p" variant="body1">
                    If this item is in stock we will ship within 7 working days. If it’s a pre-order shipping is expected within 60 and 90 days. If It’s out of stock sign in to get notified once it’s available again. Items are returnable within 14 days from the date that the order was delivered to you. <br /><br />
                    go to : <Link color="inherit" href="/customer-service/shipping"><b>Shipping and returns</b></Link>
                </Typography>
            </ExpansionPanel>
            <Divider />
        </>
    )
}

export default ProductSidebar