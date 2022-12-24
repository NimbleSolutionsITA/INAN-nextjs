import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import CustomerServiceLayout from "../../src/components/pages/customer-service/CustomerServiceLayout";

export type ProductCarePageProps = BasePageProps & { page: PageProps['page'] & { acf: {

}}}

const ProductCarePage: NextPage<ProductCarePageProps> = ({
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

export default ProductCarePage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('product-care')
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