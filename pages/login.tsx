import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
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
}) => (
    <Layout {...layoutProps} pageSettings={pageSettings} news={news}>
        <Container headerPadding >
            <Login />
        </Container>
    </Layout>
)

export default LoginPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
    ] = await Promise.all([
        getLayoutProps(),
    ]);
    return {
        props: {
            layoutProps,
            news,
        },
        revalidate: 10
    }
}