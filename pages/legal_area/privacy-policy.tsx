import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import LegalAreaLayout from "../../src/components/pages/legal-area/LegalAreaLayout";

export type PrivacyPolicyPageProps = BasePageProps & { page: PageProps['page'] & { acf: {

}}}

const PrivacyPolicyPage: NextPage<PrivacyPolicyPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    return (
        <Layout {...layoutProps} links={links} news={news}>
            <LegalAreaLayout content={content} />
        </Layout>
    )
}

export default PrivacyPolicyPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('privacy-policy')
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