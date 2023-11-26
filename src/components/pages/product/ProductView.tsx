import { Grid } from "@mui/material";
import Container from "../../Container";
import {ProductPageProps} from "../../../utils/layout";
import {useState} from "react";
import {ProductAttribute} from "../../../../@types/woocommerce";
import ProductSidebar from "./ProductSidebar";
import Carousel from "../../Carousel";
import ModalImage from "../../ModalImage";
import VimeoPlayer from "../../VimeoPlayer";
import {ShopProduct, Variation} from "../../../utils/products";
import CrossSell from "./CrossSell";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type ProductViewProps = {
    product: ShopProduct
    relatedProducts: ProductPageProps['relatedProducts']
    colors: ProductAttribute[],
    sizeGuide: ProductPageProps['sizeGuide'],
    variations: ProductPageProps['variations']
    isPrivate?: boolean
}

const getDefaultCurrent = (product: ShopProduct, variations: ProductPageProps['variations']) => {
    if (product.type === 'variable') {
        if (product.default_attributes.length > 0) {
            console.log(variations.find(v => v.attributes.every(a => product.default_attributes.find(da => da.id === a.id)?.option === a.option)))
            const defaultVariation = variations.find(v => v.attributes.every(a => product.default_attributes.find(da => da.id === a.id)?.option.toLowerCase() === a.option.toLowerCase()))
            if (defaultVariation) {
                return defaultVariation
            }
        }
        const inStock = variations.find(v => v.stock_status === 'instock')
        return inStock ?? variations[0]
    }
    return product
}

const ProductView = ({product, relatedProducts, variations, colors, sizeGuide, isPrivate}: ProductViewProps) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const [currentProduct, setCurrentProduct] = useState<ShopProduct | Variation>(getDefaultCurrent(product, variations))
    const {video, video_cover: videoCover} = product.acf
    const colorVariations = relatedProducts.filter(p => product.acf.color_variations?.includes(p.id))
    const variationImage = {image: null, ...currentProduct}.image
    const images = (product.type === 'variable' && variationImage) ? [variationImage, ...product.images.slice(1)] : product.images
    console.log(images)
    const slides =  video ? [
        ...images.map((image) =>  <ModalImage url={image} alt={image.alt} />),
        <VimeoPlayer video={video} autoplay={!videoCover && !isMobile} cover={videoCover} color="#fff" />
    ] : images.map((image) =>  <ModalImage url={image} alt={image.alt} />)
    return (
        <div style={{
            width: '100%',
            paddingBottom: '40px'
        }}>
            {currentProduct && isMobile && (
                <Carousel>
                    {slides}
                </Carousel>
            )}
            <Container>
                {currentProduct && variations && (
                    <Grid container spacing={2}>
                        {!isMobile && (
                            <Grid xs={12} md={8} item>
                                {images.map((image) =>  <ModalImage key={image.src} url={image} alt={image.alt} />)}
                                {video && <VimeoPlayer video={video} autoplay={!videoCover && !isMobile} cover={videoCover} color="#fff" />}
                            </Grid>
                        )}
                        <Grid xs={12} md={4} item>
                            <ProductSidebar
                                variations={variations}
                                colorVariations={colorVariations}
                                product={product}
                                currentProduct={currentProduct}
                                setCurrentProduct={setCurrentProduct}
                                colors={colors}
                                isMobile={isMobile}
                                sizeGuide={sizeGuide}
                                isPrivate={isPrivate}
                            />
                        </Grid>
                    </Grid>
                )}
                {!isMobile && relatedProducts && product && product.cross_sell_ids.length > 0 && (
                    <CrossSell isMobile={isMobile} items={relatedProducts}/>
                )}
            </Container>
            {isMobile && product && relatedProducts && product.cross_sell_ids.length > 0 && (
                <Container style={{borderTop: '1px solid #000', marginTop: '60px', overflow: 'hidden'}}>
                    <CrossSell isMobile={isMobile} items={relatedProducts}/>
                </Container>
            )}
        </div>
    )
}
export default ProductView;