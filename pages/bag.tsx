import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Bag from "../src/components/pages/bag/Bag";

export type BagPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    height: 168,
    heightMobile: 94,
    pageTitle: 'shopping bag'
}

const BagPage: NextPage<BagPageProps> = ({
                                       layoutProps,
                                       news,
                                       page
                                   }) => (
    <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={{...pageSettings, pageTitle: page.title.rendered}} news={news}>
        <Bag />
    </Layout>
)

export default BagPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('shopping-bag')
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