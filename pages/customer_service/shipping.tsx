import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import CustomerServiceLayout from "../../src/components/pages/customer-service/CustomerServiceLayout";

export type ShippingPageProps = BasePageProps & { page: PageProps['page'] & { acf: { }}}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'customer service'
}

const ShippingPage: NextPage<ShippingPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} yoast={content.yoast_head} links={links} news={news}>
            <CustomerServiceLayout content={content} />
        </Layout>
    )
}

export default ShippingPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('shipping')
    ]);
    return {
        props: {
            layoutProps,
            page,
            news
        },
        revalidate: 10
    }
}