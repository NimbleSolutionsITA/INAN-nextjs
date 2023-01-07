import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Wishlist from "../src/components/pages/wishlist/Wishlist";

export type WishlistPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'whishlist'
}

const WishlistPage: NextPage<WishlistPageProps> = ({
    layoutProps,
    news,
    page
}) => (
    <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={{...pageSettings, pageTitle: page.title.rendered}} news={news}>
        <Wishlist />
    </Layout>
)

export default WishlistPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        {page}
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('wishlist')
    ]);
    return {
        props: {
            layoutProps,
            news,
            page
        },
        revalidate: 10
    }
}