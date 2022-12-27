import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Container from "../src/components/Container"
import ResetPassword from "../src/components/pages/reset-password/ResetPassword";

export type ResetPasswordPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'account'
}

const ResetPasswordPage: NextPage<ResetPasswordPageProps> = ({
                                                layoutProps,
                                                news,
                                            }) => (
    <Layout {...layoutProps} pageSettings={pageSettings} news={news}>
        <Container headerPadding >
            <ResetPassword />
        </Container>
    </Layout>
)

export default ResetPasswordPage

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