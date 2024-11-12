import Container from "../../../components/Container";
import ProductCard from "./ProductCard";
import {Grid, Typography} from "@mui/material";
import {ShopProduct} from "../../../utils/products";
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {API_GET_PRODUCTS_ENDPOINT} from "../../../utils/endpoints";
import {useRouter} from "next/router";
import {ShopPageProps, useIsMobile} from "../../../utils/layout";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type GridViewProps = {productCategories: ShopPageProps['productCategories']}

const GridView = ({productCategories}: GridViewProps) => {
    const { shop: { onlyInStock }} = useSelector((state: RootState) => state.header);
    const isMobile = useIsMobile()
    const router = useRouter()

    const category = router.query.category ? productCategories.find(cat => cat.slug === router.query.category) ?? productCategories[0] : productCategories[0]
    const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
        ["products", onlyInStock, category?.id],
        async ({ pageParam = 1}) => {
            const {products: fetchedProducts} = await fetch(API_GET_PRODUCTS_ENDPOINT + '?' + new URLSearchParams({
                page: pageParam,
                per_page: '9',
                category: category?.id.toString(),
                ...(onlyInStock ? {stock_status: 'instock'} : {})
            }), {headers: { 'Accept-Encoding': 'application/json', 'Content-Type': 'application/json' }})
                .then(response => response.json())
            return fetchedProducts
        },
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.length > 0) {
                    return pages.length + 1;
                }
            },
        }
    );

    return (
        <div style={{width: !isMobile ? '100%' : undefined, paddingBottom: '40px'}}>
            <div style={{borderBottom: isMobile ? '1px solid black' : undefined}}>
                <Container style={{display: 'flex'}}>
                    <Typography style={{width: '100%', textTransform: 'uppercase', borderBottom: !isMobile ? '1px solid' : undefined}} variant="h1" component="h1">{category?.name}</Typography>
                </Container>
            </div>
            {category?.id === 38 && (
                <div style={{borderBottom: isMobile ? '1px solid black' : undefined}}>
                    <Container style={{display: 'flex'}}>
                        <div style={{width: '100%', borderBottom: !isMobile ? '1px solid' : undefined}}>
                            <Typography style={{textTransform: 'uppercase', width: isMobile ? '100%' : '50%'}}>
                                One-of-a-kind artisanal objects of desire, made entirely from upcycled dead stock materials.<br />
                                Every piece is unique and hand made in Italy.<br />
                                New drops periodically updated.<br />
                                Special styles upon request.
                            </Typography>
                        </div>
                    </Container>
                </div>
            )}
            <Container>
                {status === "success" && (
                    <InfiniteScroll
                        dataLength={data?.pages.length * 9}
                        next={fetchNextPage}
                        hasMore={hasNextPage || false}
                        loader={<h5>Loading...</h5>}
                    >
                        <Grid container spacing={isMobile ? 1 : 2}>
                            {data?.pages.map(products => products.map((product: ShopProduct) => (
                                <Grid key={product.id} xs={6} md={4} item>
                                    <ProductCard product={product} />
                                </Grid>
                            )))}
                        </Grid>
                    </InfiniteScroll>
                )}
            </Container>
        </div>
    )
}

export default GridView;