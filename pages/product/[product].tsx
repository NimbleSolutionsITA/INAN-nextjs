import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, ProductPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import {getProducts, getProductVariations} from "../../src/utils/products";
import {getAllProductsIds, getCategoriesProps, getProductColorsProps, getSizeGuideProps} from "../../src/utils/shop";
import {useRouter} from "next/router";
import ProductView from "../../src/components/pages/product/ProductView";

export type ProductProps = BasePageProps & ProductPageProps

const Product: NextPage<ProductProps> = ({
    layoutProps,
    productCategories,
    news,
    product,
    relatedProducts,
    colors,
    sizeGuide,
    variations
}) => {
    const router = useRouter()
    return (
        <Layout
            key={router.asPath}
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
            <ProductView product={product} relatedProducts={relatedProducts} variations={variations} colors={colors} sizeGuide={sizeGuide} />
        </Layout>
    )
}

export default Product

export async function getStaticProps({ params: {product} }: { params: {product: string}}) {
    const [
        {layoutProps},
        productCategories,
        colors,
        sizeGuide,
        {products}
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getProductColorsProps(),
        getSizeGuideProps(),
        getProducts({slug: product})
    ]);
    const currentProduct = products[0]
    const { products: relatedProducts} = await getProducts({include: [
        ...currentProduct.related_ids,
        ...currentProduct.cross_sell_ids,
        ...currentProduct.upsell_ids
    ]})
    const { products: variations } = await getProductVariations(currentProduct.id)
    return {
        props: {
            colors,
            layoutProps,
            productCategories,
            product: currentProduct,
            relatedProducts,
            variations,
            sizeGuide
        },
        revalidate: 10
    }
}

export async function getStaticPaths() {
    const paths = await getAllProductsIds();
    return {
        paths,
        fallback: 'blocking',
    };
}