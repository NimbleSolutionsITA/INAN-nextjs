import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, getProductPageProps, ProductPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import {getProducts, getProductVariations} from "../../src/utils/products";
import {getAllProductsIds, getCategoriesProps, getProductColorsProps, getSizeGuideProps} from "../../src/utils/shop";
import {useRouter} from "next/router";
import ProductView from "../../src/components/pages/product/ProductView";
import {useEffect} from "react";
import {gtagEcommerceEvent} from "../../src/utils/helpers";

export type ProductProps = BasePageProps & ProductPageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

const Product: NextPage<ProductProps> = ({
    layoutProps,
    productCategories,
    news,
    product,
    relatedProducts,
    colors,
    sizeGuide,
    variations,
    page: { yoast_head }
}) => {
    const router = useRouter()

    useEffect(() => {
        gtagEcommerceEvent([{
            id: product.id,
            name: product.name,
            price: Number( product.price),
            leather: product.attributes.find(a => a.id === 3)?.option ?? null,
            size: product.attributes.find(a => a.id === 2)?.option ?? null,
            color: product.attributes.find(a => a.id === 4)?.option ?? null,
            image: product.images[0].src,
            slug: product.slug,
            qty: 1,
            private: false
        }], 'view_item')
    }, []);

    return (
        <Layout
            key={router.asPath}
            pageSettings={pageSettings}
            yoast={yoast_head}
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
        {products},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getCategoriesProps(),
        getProductColorsProps(),
        getSizeGuideProps(),
        getProducts({slug: product}),
        getProductPageProps(product)
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
            page
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