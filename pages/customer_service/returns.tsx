import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import CustomerServiceLayout from "../../src/components/pages/customer-service/CustomerServiceLayout";

export type ReturnsPageProps = BasePageProps & { page: PageProps['page'] & { acf: {

}}}

const ReturnsPage: NextPage<ReturnsPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    return (
        <Layout {...layoutProps} links={links} news={news}>
            <CustomerServiceLayout content={content} />
        </Layout>
    )
}

export default ReturnsPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('returns')
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