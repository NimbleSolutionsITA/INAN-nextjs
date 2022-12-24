import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getPageProps, PageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Divider, Grid, Typography} from '@mui/material';
import Container from '../src/components/Container';
import { useEffect, useState} from "react";
import InLogo from "../src/components/icons/InLogo";
import AnLogo from "../src/components/icons/AnLogo";
import {useSelector} from "react-redux";
import {RootState} from "../src/redux/store";

export type AboutPageProps = BasePageProps & { page: PageProps['page'] & { acf: {
    body1: string
    body2: string
    footer: string
    image: string
    subtitle: string
}}}

const AboutPage: NextPage<AboutPageProps> = ({
                                       layoutProps,
                                       news,
                                       page: content,
                                       links
                                   }) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const [hideLoader, setHideLoader] = useState(false)

    useEffect(() => {
        let timer = setTimeout(() => setHideLoader(true), 500)
        return () => clearTimeout(timer)
    })
    return (
        <Layout {...layoutProps} links={links} news={news}>
            <div style={{backgroundColor: '#000'}}>
                {!hideLoader && <div style={{zIndex: 9999, width: '100vw', height: '100vh', position: 'fixed', top: 0, backgroundImage: 'url(/loader-about.gif)', backgroundSize: 'cover', backgroundPosition: 'center'}} />}
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
                                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%'}}><InLogo color="#fff" /></div>
                                </Grid>
                            )}
                            <Grid item xs={12} md={6}>
                                <img style={{width: '100%', marginBottom: '-2px'}} src={content.acf.image} alt="INAN about" />
                            </Grid>
                            {isMobile && (
                                <Grid item xs={9} style={{padding: '10px 0'}}>
                                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%'}}><InLogo color="#fff" /></div>
                                </Grid>
                            )}
                            <Grid item xs={3}>
                                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%'}}><AnLogo color="#fff" /></div>
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