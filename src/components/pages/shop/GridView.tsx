import Container from "../../../components/Container";
import ProductCard from "./ProductCard";
import {Grid, Typography} from "@mui/material";
import {ShopProduct} from "../../../utils/products";
import {useInfiniteQuery} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {API_GET_PRODUCTS_ENDPOINT} from "../../../utils/endpoints";
import {useRouter} from "next/router";
import {ShopPageProps} from "../../../utils/layout";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type GridViewProps = { products: ShopPageProps['products'], productCategories: ShopPageProps['productCategories']}

const GridView = ({products, productCategories}: GridViewProps) => {
    const { height, isMobile} = useSelector((state: RootState) => state.header);
    const router = useRouter()

    const currentCategorySlug = router.query.category || 'view-all'
    const category = productCategories.find(cat => cat.slug === currentCategorySlug)
    const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
        ["products"],
        async ({ pageParam = 1}) => {
            if (pageParam === 1) {
                return products
            }
            const {products: fetchedProducts} = await fetch(API_GET_PRODUCTS_ENDPOINT + '?' + new URLSearchParams({
                page: pageParam,
                per_page: '9',
                category: category?.id.toString() || '15'
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
        <div style={{width: !isMobile ? '100%' : undefined, paddingTop: !isMobile ? height : undefined, paddingBottom: '40px'}}>
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