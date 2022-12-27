import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Wishlist from "../src/components/pages/wishlist/Wishlist";

export type WishlistPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'shopping bag'
}

const WishlistPage: NextPage<WishlistPageProps> = ({
                                       layoutProps,
                                       news,
                                   }) => (
    <Layout {...layoutProps} pageSettings={pageSettings} news={news}>
        <Wishlist />
    </Layout>
)

export default WishlistPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
    ] = await Promise.all([
        getLayoutProps(),
    ]);
    return {
        props: {
            layoutProps,
            news
        },
        revalidate: 10
    }
}