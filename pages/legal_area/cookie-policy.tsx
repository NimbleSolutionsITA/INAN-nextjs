import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import LegalAreaLayout from "../../src/components/pages/legal-area/LegalAreaLayout";

export type CookiePolicyPageProps = BasePageProps & { page: PageProps['page'] & { acf: {

}}}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'legal area'
}

const CookiePolicyPage: NextPage<CookiePolicyPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} yoast={content.yoast_head} links={links} news={news}>
            <LegalAreaLayout content={content} />
        </Layout>
    )
}

export default CookiePolicyPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('cookie-policy')
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