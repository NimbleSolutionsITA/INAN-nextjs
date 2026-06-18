import type { NextPage } from 'next';
import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Layout from "../../src/components/layout";
import Container from "../../src/components/Container";
import ProductCard from "../../src/components/pages/shop/ProductCard";
import { getLayoutProps, getPageProps, useIsMobile } from "../../src/utils/layout";
import { getSaleProducts, ShopProduct } from "../../src/utils/products";
import { buildShopNavLinks, CategoryProps, getCategoriesProps } from "../../src/utils/shop";
import { BasePageProps, WordpressPage } from "../../@types";

export type SaleProps = Omit<BasePageProps, "page"> & {
    products: ShopProduct[];
    productCategories: CategoryProps[];
    page: WordpressPage | null;
};

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null,
};

const Sale: NextPage<SaleProps> = ({ layoutProps, productCategories, products, news, page }) => {
    const isMobile = useIsMobile();
    const router = useRouter();

    const links = buildShopNavLinks(productCategories, products.length > 0);

    return (
        <Layout
            key={router.asPath}
            pageSettings={pageSettings}
            {...layoutProps}
            links={links}
            activeLink="sale"
            news={news}
            yoast={page?.yoast_head}
        >
            <div style={{ width: !isMobile ? "100%" : undefined, paddingBottom: "40px" }}>
                <div style={{ borderBottom: isMobile ? "1px solid black" : undefined }}>
                    <Container style={{ display: "flex" }}>
                        <Typography
                            style={{
                                width: "100%",
                                textTransform: "uppercase",
                                borderBottom: !isMobile ? "1px solid" : undefined,
                            }}
                            variant="h1"
                            component="h1"
                        >
                            Sales
                        </Typography>
                    </Container>
                </div>
                <Container>
                    <Grid container spacing={isMobile ? 1 : 2}>
                        {products.map((product) => (
                            <Grid key={product.id} xs={6} md={4} item>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </Layout>
    );
};

export default Sale;

export async function getStaticProps() {
    const [
        { layoutProps, news },
        productCategories,
        { page },
        { products },
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getPageProps('sale'),
        getSaleProducts(),
    ]);

    return {
        props: {
            layoutProps,
            productCategories,
            news,
            page: page ?? null,
            products,
        },
        revalidate: 10,
    };
}
