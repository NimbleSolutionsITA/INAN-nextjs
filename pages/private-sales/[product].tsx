import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getProductPageProps, ProductPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import {getProducts, getProductVariations} from "../../src/utils/products";
import {getAllProductsIds, getCategoriesProps, getProductColorsProps, getSizeGuideProps} from "../../src/utils/shop";
import {useRouter} from "next/router";
import ProductView from "../../src/components/pages/product/ProductView";
import PrivateLayout from "../../src/components/layout/private";

export type ProductProps = BasePageProps & ProductPageProps


const Product: NextPage<ProductProps> = ({
    layoutProps,
    productCategories,
    news,
    product,
    relatedProducts,
    colors,
    sizeGuide,
    variations,
    page
}) => {
    const router = useRouter()
    return (
        <PrivateLayout
            key={router.asPath}
            layoutProps={layoutProps}
            page={page}
            {...layoutProps}
            links={productCategories.map(productCategory => ({
                id: productCategory.id,
                slug: productCategory.slug,
                name: productCategory.name,
                url: `/shop/${productCategory.slug}`
            }))}
            news={news}
        >
            <ProductView product={product} relatedProducts={relatedProducts} variations={variations} colors={colors} sizeGuide={sizeGuide} isPrivate />
        </PrivateLayout>
    )
}

export default Product

export async function getStaticProps({ params: {product} }: { params: {product: string}}) {
    const [
        {layoutProps},
        productCategories,
        colors,
        sizeGuide,
        {products},
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getProductColorsProps(),
        getSizeGuideProps(),
        getProducts({slug: product, status: 'private'}),
    ]);
    if (products.length === 0) {
        return {
            notFound: true
        }
    }
    const currentProduct = products[0]
    const color_variations = currentProduct.acf.color_variations ?
        currentProduct.acf.color_variations.filter(id => id !== currentProduct.id) : []
    const { products: relatedProducts} = await getProducts({include: [
        ...currentProduct.related_ids,
        ...currentProduct.cross_sell_ids,
        ...currentProduct.upsell_ids,
        ...color_variations
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
            sizeGuide,
            page: {
                yoast_head: `<title>${currentProduct.name.toUpperCase()} - Ilaria Norsa XX Angostura</title>`,
                title: { rendered: currentProduct.name}
            }
        },
        revalidate: 10
    }
}

export async function getStaticPaths() {
    const paths = await getAllProductsIds('private');
    return {
        paths,
        fallback: 'blocking',
    };
}