import { Grid } from "@mui/material";
import Container from "../../Container";
import {ProductPageProps} from "../../../utils/layout";
import {useState} from "react";
import {ProductAttribute} from "../../../../@types/woocommerce";
import ProductSidebar from "./ProductSidebar";
import Carousel from "../../Carousel";
import ModalImage from "../../ModalImage";
import VimeoPlayer from "../../VimeoPlayer";
import {ShopProduct} from "../../../utils/products";
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
    const { height, isMobile } = useSelector((state: RootState) => state.header);
    const [colorType, setColorType] = useState<string | null>(null)
    const currentProduct = product
    const {video, video_cover: videoCover} = product.acf
    return (
        <div style={{
            width: '100%',
            paddingTop: height,
            paddingBottom: '40px'
        }}>
            {currentProduct && variations && isMobile && (
                <Carousel>
                    {currentProduct.images.map((image) =>  <ModalImage url={image} alt={image.alt} />)}
                    {video && <VimeoPlayer video={video} autoplay={!videoCover && !isMobile} cover={videoCover} color="#fff" />}
                </Carousel>
            )}
            <Container>
                {currentProduct && variations && (
                    <Grid container spacing={2}>
                        {!isMobile && (
                            <Grid xs={12} md={8} item>
                                {currentProduct.images.map((image) =>  <ModalImage url={image} alt={image.alt} />)}
                                {video && <VimeoPlayer video={video} autoplay={!videoCover && !isMobile} cover={videoCover} color="#fff" />}
                            </Grid>
                        )}
                        <Grid xs={12} md={4} item>
                            <ProductSidebar
                                colorType={colorType}
                                setColorType={setColorType}
                                variations={variations}
                                product={currentProduct}
                                colors={colors}
                                isMobile={isMobile}
                                sizeGuide={sizeGuide}
                            />
                        </Grid>
                    </Grid>
                )}
                {!isMobile && variations && currentProduct && currentProduct.cross_sell_ids.length > 0 && (
                    <CrossSell isMobile={isMobile} items={relatedProducts}/>
                )}
            </Container>
            {isMobile && currentProduct && variations && currentProduct.cross_sell_ids.length > 0 && (
                <Container style={{borderTop: '1px solid #000', marginTop: '60px', overflow: 'hidden'}}>
                    <CrossSell isMobile={isMobile} items={relatedProducts}/>
                </Container>
            )}
        </div>
    )
}
export default ProductView;