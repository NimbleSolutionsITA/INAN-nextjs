import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps, PageProps, useIsMobile} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Divider, Grid, Typography} from '@mui/material';
import Container from '../src/components/Container';
import InLogo from "../src/components/icons/InLogo";
import AnLogo from "../src/components/icons/AnLogo";
import Loader from "../src/components/Loader";

export type AboutPageProps = BasePageProps & { page: PageProps['page'] & { acf: {
    body1: string
    body2: string
    footer: string
    image: string
    subtitle: string
}}}

const pageSettings = {
    bgColor: '#000',
    headerColor: '#fff',
    headerColorMobile: '#fff',
    pageTitle: 'about'
}

const AboutPage: NextPage<AboutPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    const isMobile = useIsMobile()
    return (
        <Layout key="about" pageSettings={pageSettings} yoast={content.yoast_head} {...layoutProps} links={links} news={news}>
            <div style={{backgroundColor: '#000'}}>
                <Loader page="about" />
                {content && (
                    <Container headerPadding>
                        <Typography style={{color: '#fff'}} variant="h1">{content.title.rendered}</Typography>
                        <Divider style={{backgroundColor: '#fff'}} />
                        <Typography style={{color: '#fff'}} variant="h2">
                            <span dangerouslySetInnerHTML={{__html: content.acf.subtitle}} />
                        </Typography>
                        <Divider style={{backgroundColor: '#fff'}} />
                        <Typography style={{color: '#fff', padding: '5px 0'}}>
                            <span dangerouslySetInnerHTML={{__html: content.acf.body1}} />
                        </Typography>
                        <Divider style={{backgroundColor: '#fff'}} />
                        <Grid container>
                            {!isMobile && (
                                <Grid item xs={3}>
                                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%'}}><InLogo height={100} color="#fff" /></div>
                                </Grid>
                            )}
                            <Grid item xs={12} md={6}>
                                <img style={{width: '100%', marginBottom: '-2px'}} src={content.acf.image} alt="INAN about" />
                            </Grid>
                            {isMobile && (
                                <Grid item xs={9} style={{padding: '10px 0'}}>
                                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%'}}><InLogo height={60} color="#fff" /></div>
                                </Grid>
                            )}
                            <Grid item xs={3}>
                                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%'}}><AnLogo height={isMobile ? 60 : 100} color="#fff" /></div>
                            </Grid>
                        </Grid>
                        <Divider style={{backgroundColor: '#fff'}} />
                        <Typography style={{color: '#fff'}} variant="h2">
                            <span dangerouslySetInnerHTML={{__html: content.acf.body2}} />
                        </Typography>
                        <Divider style={{backgroundColor: '#fff'}} />
                        <Typography style={{color: '#fff'}} variant="h1">
                            <span dangerouslySetInnerHTML={{__html: content.acf.footer}} />
                        </Typography>
                    </Container>
                )}
            </div>
        </Layout>
    )
}

export default AboutPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('about')
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