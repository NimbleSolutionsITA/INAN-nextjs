import Header from './header'
import Footer from './footer'
import Head from "next/head";
import {BasePageProps, LinkItem, PageSettings} from "../../../@types";
import {Router, useRouter} from "next/router";
import Loading from "../Loading";
import {useEffect,} from "react";
import {useDispatch} from "react-redux";
import {setHeader, setInStock} from "../../redux/headerSlice";
import {initCart} from "../../redux/cartSlice";
import {initWishlist} from "../../redux/wishlistSlice";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import parse from "html-react-parser";
import * as React from "react";

type MenuItem = {
    ID: number
    children: MenuItem[]
    pageID: number
    pageSlug: string
    title: string
    url: string
}

export type PageLayoutProps = BasePageProps['layoutProps'] & {
    children: JSX.Element,
    news: BasePageProps['news'],
    links?: LinkItem[],
    activeLink?: string
    pageSettings: PageSettings,
    yoast: string | undefined
}


export default function Layout({ header: { favicon, headerMenuItems }, footer, news, children, links, activeLink, pageSettings, yoast }: PageLayoutProps) {
    const router = useRouter()
    const dispatch = useDispatch()

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect( () => {
        let settings;
        if (router.pathname === '/')
            settings = {
                pageTitle: pageSettings.pageTitle
            }
        else
            settings = pageSettings
        dispatch(setHeader(settings))
    }, [router.pathname] );

    useEffect(() => {
        dispatch(setHeader({
            isMobile,
            ...(isMobile ? { height: pageSettings.pageTitle || links ? 94 : 74 } : {})
        }))
    }, [isMobile]);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => dispatch(setHeader({loading: true})));
        Router.events.on('routeChangeComplete', () => dispatch(setHeader({loading: false})));
        Router.events.on('routeChangeError', () => dispatch(setHeader({loading: false})));
        return () => {
            Router.events.off('routeChangeStart', () => dispatch(setHeader({loading: true})));
            Router.events.off('routeChangeComplete', () => dispatch(setHeader({loading: false})));
            Router.events.off('routeChangeError', () => dispatch(setHeader({loading: false})));
        };
    }, [Router.events]);

    useEffect( () => {
        if ( typeof window !== "undefined" ) {
            dispatch(initCart())
            dispatch(initWishlist())
        }
    }, [] );

    useEffect(() => {
        if (router.query.category === 'in-stock' || router.pathname === '/shop') {
            console.log('in-stock')
            dispatch(setInStock(true))
        }
        else {
            console.log('not in-stock')
            dispatch(setInStock(false))
        }
    }, [router.pathname]);

    return (
        <>
            <Head>
                <link rel="shortcut icon" href={favicon} />
                {yoast && parse(yoast)}
            </Head>
            <main>
                <Header pageTitle={pageSettings.pageTitle} headerMenuItems={headerMenuItems} links={links} activeLink={activeLink} news={news} />
                <div style={{minHeight: '100vh', backgroundColor: router.pathname === '/about' ? '#000' : undefined}}>
                    <Loading>
                        {children}
                    </Loading>
                </div>
            </main>
            <Footer {...footer} />
        </>
    )
}