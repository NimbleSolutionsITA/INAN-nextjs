import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {ACFMedia, getLayoutProps, getPageProps, PageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Divider, Grid, Typography} from '@mui/material';
import Container from '../src/components/Container';
import MultiCarousel from "../src/components/MultiCarousel";
const _ = require('lodash');

export type MadeToOrderPageProps = BasePageProps & { page: PageProps['page'] & { acf: {
    color: string
            gallery: ACFMedia[]
            body1: string
            email: string
            body2: string
}}}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'made to order'
}

const MadeToOrderPage: NextPage<MadeToOrderPageProps> = ({
   layoutProps,
   news,
   page: {acf: {gallery, body1, body2, email}},
   links
}) => {
    const body = _.template(body1)
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} links={links} news={news}>
            <Container headerPadding>
                {gallery && (
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={7} style={{position: 'relative'}}>
                            <MultiCarousel centerMode={false}>
                                {gallery.map(slide => (
                                    <img key={slide.url} src={slide.url} alt={slide.alt} style={{width: '100%'}} />
                                ))}
                            </MultiCarousel>
                        </Grid>
                    </Grid>
                )}
                <Typography sx={{marginTop: '24px'}} variant="h2">
                    <div dangerouslySetInnerHTML={{__html: body({email:`<a href="mailto:${email}" target="_blank" style="text-decoration: none; color: red;">${email}</a>`,})}} />
                </Typography>
                <Divider style={{margin: '5px 0'}} />
                <Typography>{body2}</Typography>
            </Container>
        </Layout>
    )
}

export default MadeToOrderPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('made-to-order')
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