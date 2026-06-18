import type { NextPage } from 'next';
import Layout from "../../src/components/layout";
import { getLayoutProps, getPageProps, ShopPageProps } from "../../src/utils/layout";
import { BasePageProps } from "../../@types";
import { buildShopNavLinks, getCategoriesProps } from "../../src/utils/shop";
import GridView from "../../src/components/pages/shop/GridView";
import { useRouter } from "next/router";
import {getAttributes} from "../api/products/attributes";
import {Attribute, hasSaleProducts} from "../../src/utils/products";

export type ShopProps = BasePageProps & ShopPageProps & {
    attributes: Attribute[]; // Replace `any[]` with a proper type if available
    hasSale: boolean;
};

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null,
};

const Shop: NextPage<ShopProps> = ({
                                       layoutProps,
                                       productCategories,
                                       currentCategoryId,
                                       news,
                                       page,
                                       attributes, // Attributes fetched and passed to the component
                                       hasSale,
                                   }) => {
    const router = useRouter();
    return (
        <Layout
            key={router.asPath}
            pageSettings={pageSettings}
            {...layoutProps}
            links={buildShopNavLinks(productCategories, hasSale)}
            activeLink={router.query.category?.toString() || productCategories[0].slug}
            news={news}
            yoast={page.yoast_head}
        >
            <GridView
                inStock={router.query.category?.toString() === "in-stock"}
                key={currentCategoryId}
                productCategories={productCategories}
                attributes={attributes} // Pass attributes to the component
            />
        </Layout>
    );
};

export default Shop;

export async function getStaticProps(context: { params?: { category?: string } }) {
    const [
        { layoutProps, news },
        productCategories,
        { page },
        attributesData, // Fetch attributes
        hasSale,
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getPageProps('shop'),
        getAttributes(), // Fetch attributes from WooCommerce API
        hasSaleProducts(),
    ]);

    const currentCategoryId = context.params?.category
        ? productCategories.find(productCategory => productCategory.slug === context?.params?.category)?.id
        : productCategories[0].id;

    if (!currentCategoryId) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            layoutProps,
            productCategories,
            currentCategoryId,
            news,
            page,
            attributes: attributesData, // Pass attributes as props
            hasSale,
        },
        revalidate: 10,
    };
}