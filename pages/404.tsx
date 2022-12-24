import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Divider, Typography} from "@mui/material";
import Container from "../src/components/Container";
import {useRouter} from "next/router";


const FourOFourPage: NextPage<BasePageProps> = ({
                                                             layoutProps,
                                                             news,
                                                             links
                                                         }) => {
    const router = useRouter()
    return (
        <Layout {...layoutProps} links={links} news={news}>
            <Container headerPadding>
                <Typography style={{color: 'red'}} variant="h1">ERROR 404</Typography>
                <Divider />
                <Typography variant="h2">{router.asPath}</Typography>
                <Typography variant="h1">NOT FOUND</Typography>
            </Container>
        </Layout>
    )
}

export default FourOFourPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('product-care')
    ]);
    return {
        props: {
            layoutProps,
            news
        },
        revalidate: 10
    }
}