import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, ShopPageProps} from "../../src/utils/layout";
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
   news,
   products,
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
            activeLink={router.query.category?.toString() || 'view-all'}
            news={news}
        >
            <GridView products={products} productCategories={productCategories} />
        </Layout>
    )
}

export default Shop

export async function getStaticProps(context: {params?: {category?: string}}) {
    const [
        {layoutProps, news},
        productCategories
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps()
    ]);
    const currentCategoryId = context.params?.category && context.params?.category !== 'in-stock' ?
        productCategories.find(productCategory => productCategory.slug === context?.params?.category)?.id || 15 :
        15
    const {products} = await getProducts({ category: currentCategoryId, per_page: 9, stock_status: context.params?.category === 'in-stock' ? 'instock' : undefined})
    return {
        props: {
            layoutProps,
            productCategories,
            products,
            news
        },
        revalidate: 10
    }
}