import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {Divider, Grid, Typography} from "@mui/material";
import {ShopProduct} from "../../../utils/products";
import ProductCard from "../shop/ProductCard";
import React from "react";

type CrossSellProps = {
    items: ShopProduct[]
    isMobile: boolean
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
        slidesToSlide: 1 // optional, default to 1.
    }
};

const CrossSell = ({items, isMobile}: CrossSellProps) => (
    <>
        {!isMobile && <Divider />}
        <Typography style={{padding: '20px 0 40px'}} variant={isMobile ? 'h2' : 'h1'} component="h2">
            You may also like
        </Typography>
        {isMobile ? (
            <Carousel
                partialVisible={true}
                responsive={responsive}
                infinite={true}
                keyBoardControl={true}
                swipeable
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                itemClass="carousel-item-padding-40-px"
            >
                {items.map(product => <ProductCard key={product.id} product={product} />)}
            </Carousel>
        ) : (
            <Grid container spacing={isMobile ? 1 : 2}>
                {items.slice(0, 3).map(product => (
                    <Grid xs={6} md={4} item key={product.id}>
                        <ProductCard key={product.id} product={product} />
                    </Grid>
                ))}
            </Grid>
        )}
    </>
)

export default CrossSell