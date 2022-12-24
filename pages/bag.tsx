import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Bag from "../src/components/pages/bag/Bag";

export type BagPageProps = BasePageProps

const BagPage: NextPage<BagPageProps> = ({
                                       layoutProps,
                                       news,
                                   }) => (
    <Layout {...layoutProps} news={news}>
        <Bag />
    </Layout>
)

export default BagPage

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