import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {Divider, Grid, Portal, Typography} from "@mui/material";
import {ShopProduct} from "../../../utils/products";
import ProductCard from "../shop/ProductCard";
import React, {useRef} from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


type CrossSellProps = {
    items: ShopProduct[]
    isMobile: boolean
    title?: string
    disableTitle?: boolean
}

const responsive = {
    desktop: {
        breakpoint: { max: 10000, min: 925 },
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 925, min: 735 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 735, min: 0 },
        items: 2,
        slidesToSlide: 1, // optional, default to 1.
        partialVisibilityGutter: 30
    }
};

const arrowStyle = {
    position: 'absolute',
    zIndex: 1000,
    border: 0,
    minWidth: '18px',
    minHeight: '18px',
    opacity: 1,
    cursor: 'pointer',
    top: '42%'
}

const CrossSell = ({items, isMobile, disableTitle = false, title = "You may Also like"}: CrossSellProps) => {
    const container = useRef<HTMLDivElement>(null);
    return (<>
        {!disableTitle && (
            <>
                {!!isMobile && <Divider />}
                <Typography style={{padding: '20px 0 40px'}} variant={isMobile ? 'h2' : 'h1'} component="h2">
                    {title}
                </Typography>
            </>
        )}
        <div ref={container} style={{position: "relative"}}>
            <Carousel
                partialVisible={true}
                responsive={responsive}
                infinite={true}
                keyBoardControl={true}
                swipeable
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                itemClass="carousel-item-padding-40-px"
                customLeftArrow={<div><Portal container={() => container.current!}><ArrowBackIosIcon sx={{...arrowStyle, left: '-40px'}} /></Portal></div>}
                customRightArrow={<div><Portal container={() => container.current!}><ArrowForwardIosIcon sx={{...arrowStyle,  right: '-40px'}} /></Portal></div>}
            >
                {items.map(product => <ProductCard key={product.id} product={product} />)}
            </Carousel>
        </div>
    </>)
}

export default CrossSell