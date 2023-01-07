import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Login from "../src/components/pages/login/Login";
import Container from "../src/components/Container"

export type NextPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'account'
}

const LoginPage: NextPage<NextPageProps> = ({
   layoutProps,
   news,
   page
}) => (
    <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={{...pageSettings, pageTitle: page.title.rendered}} news={news}>
        <Container headerPadding >
            <Login />
        </Container>
    </Layout>
)

export default LoginPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('account')
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