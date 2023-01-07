import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Divider, Typography} from "@mui/material";
import Container from "../src/components/Container";
import {useRouter} from "next/router";

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

const FourOFourPage: NextPage<BasePageProps> = ({
    layoutProps,
    news,
    links,
    page
}) => {
    const router = useRouter()
    return (
        <Layout pageSettings={pageSettings} {...layoutProps} yoast={page.yoast_head} links={links} news={news}>
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
        {page}
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('home')
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