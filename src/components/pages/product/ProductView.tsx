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
}
const ProductView = ({product, relatedProducts, variations, colors, sizeGuide}: ProductViewProps) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const [currentProduct, setCurrentProduct] = useState<ShopProduct | Variation>(product.type === 'variable' ? variations.find(v => v.stock_status !== 'outofstock') ?? variations[0] : product)
    const {video, video_cover: videoCover} = product.acf
    // @ts-ignore
    const images = product.type === 'variable' && currentProduct.image ? [currentProduct.image, ...product.images.slice(1)] : product.images
    console.log(images, product.images)
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
                                product={product}
                                currentProduct={currentProduct}
                                setCurrentProduct={setCurrentProduct}
                                colors={colors}
                                isMobile={isMobile}
                                sizeGuide={sizeGuide}
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