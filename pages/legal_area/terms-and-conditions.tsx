import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import LegalAreaLayout from "../../src/components/pages/legal-area/LegalAreaLayout";

export type TermsAndConditionsPageProps = BasePageProps & { page: PageProps['page'] & { acf: {

}}}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'legal area'
}

const TermsAndConditionsPage: NextPage<TermsAndConditionsPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} links={links} news={news}>
            <LegalAreaLayout content={content} />
        </Layout>
    )
}

export default TermsAndConditionsPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('terms-and-conditions')
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