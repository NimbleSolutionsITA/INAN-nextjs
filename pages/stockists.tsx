import { useState} from "react";
import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps, getStockistsProps, StockistsPostACF} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {Collapse, Divider, Grid, Typography} from '@mui/material';
import Container from '../src/components/Container';
import Button from "../src/components/Button"

export type StockistsPageProps = BasePageProps & { stockists: StockistsPostACF[]}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'stockists'
}

const StockistsPage: NextPage<StockistsPageProps> = ({
   layoutProps,
   news,
   stockists: shops,
   links
}) => {
    const [current, setCurrent] = useState('')
    const cities = shops?.map(s => {
        return s.acf.city
    }).filter((v, i, a) => a.indexOf(v) === i)
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} links={links} news={news}>
            <Container headerPadding>
                {shops && (
                    <>
                        <br />
                        <br />
                        {cities.map((city, index) => (
                            <div>
                                <Button color="secondary" disableRipple disablePadding disableGutters disableHover lineThrough onClick={() => current === city ? setCurrent('') : setCurrent(city)}>
                                    <Typography style={{padding: current === city ? `${index === 0 ? '2px 0 17px' : '17px 0'}` : '2px 0', transition: 'padding .5s ease'}} variant="h2">
                                        {city}
                                    </Typography>
                                </Button>
                                <Collapse in={current === city}>
                                    <Grid container>
                                        {shops.filter(shop => shop.acf.city === city).map(shop => (
                                            <Grid item xs={4}>
                                                <Typography style={{paddingBottom: '10px', color: 'red', fontWeight: 'bold'}}>{shop.title.rendered}</Typography>
                                                <Typography >
                                                    <div dangerouslySetInnerHTML={{__html: shop.acf.contacts}} />
                                                </Typography>
                                                <Typography><a href={shop.acf.website} target="_blank" rel="noopener noreferrer">{new URL(shop.acf.website).host}</a></Typography>
                                                <br />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse>
                                <Divider />
                            </div>
                        ))}
                    </>
                )}
            </Container>
        </Layout>
    )
}

export default StockistsPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { stockists }
    ] = await Promise.all([
        getLayoutProps(),
        getStockistsProps()
    ]);
    return {
        props: {
            layoutProps,
            stockists,
            news
        },
        revalidate: 10
    }
}