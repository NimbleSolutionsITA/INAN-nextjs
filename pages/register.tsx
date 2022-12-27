import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Container from "../src/components/Container"
import Register from "../src/components/pages/register/Register";

export type NextPageProps = BasePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'account'
}

const RegisterPage: NextPage<NextPageProps> = ({
   layoutProps,
   news,
}) => (
    <Layout {...layoutProps} pageSettings={pageSettings} news={news}>
        <Container headerPadding >
            <Register />
        </Container>
    </Layout>
)

export default RegisterPage

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