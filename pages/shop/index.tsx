import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, ShopPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import {getProducts} from "../../src/utils/products";
import {getCategoriesProps} from "../../src/utils/shop";
import GridView from "../../src/components/pages/shop/GridView"
import {useRouter} from "next/router";

export type ShopProps = BasePageProps & ShopPageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

const Shop: NextPage<ShopProps> = ({
   layoutProps,
   productCategories,
   currentCategoryId,
   news,
   page
}) => {
    const router = useRouter()
    return (
        <Layout
            key={router.asPath}
            pageSettings={pageSettings}
            {...layoutProps}
            links={productCategories.map(productCategory => ({
                id: productCategory.id,
                slug: productCategory.slug,
                name: productCategory.name,
                url: `/shop/${productCategory.slug}`
            }))}
            activeLink={router.query.category?.toString() || productCategories[0].slug}
            news={news}
            yoast={page.yoast_head}
        >
            <GridView key={currentCategoryId} productCategories={productCategories} />
        </Layout>
    )
}

export default Shop

export async function getStaticProps(context: {params?: {category?: string}}) {
    const [
        {layoutProps, news},
        productCategories,
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getPageProps('shop')
    ]);


    const currentCategoryId = context.params?.category ?
        productCategories.find(productCategory => productCategory.slug === context?.params?.category)?.id :
        productCategories[0].id

    if (!currentCategoryId) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            layoutProps,
            productCategories,
            currentCategoryId,
            news,
            page
        },
        revalidate: 10
    }
}