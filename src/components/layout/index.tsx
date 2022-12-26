import Header from './header'
import Footer from './footer'
import Head from "next/head";
import {BasePageProps, LinkItem} from "../../../@types";
import {Router, useRouter} from "next/router";
import Loading from "../Loading";
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {setHeader} from "../../redux/headerSlice";
import {initCart} from "../../redux/cartSlice";
import {initWishlist} from "../../redux/wishlistSlice";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Header as HeaderType} from "../../../@types/index"

type MenuItem = {
    ID: number
    children: MenuItem[]
    pageID: number
    pageSlug: string
    title: string
    url: string
}

type PageLayoutProps = BasePageProps['layoutProps'] & { children: JSX.Element, news: BasePageProps['news'], links?: LinkItem[], activeLink?: string }

const darkMode = {bgColor: '#000', headerColor: '#fff', headerColorMobile: '#fff'}
const lightMode = {bgColor: '#fff', headerColor: '#000', headerColorMobile: '#000'}

const headerSettingsMap: {[key: string]: Partial<HeaderType>} = {
    '/':                        {pageTitle: null, ...lightMode, bgColor: 'transparent'},
    '/account':                 {pageTitle: 'account', ...lightMode},
    '/made-to-order':           {pageTitle: 'made to order', ...lightMode},
    '/about':                   {pageTitle: 'about', ...darkMode},
    '/stockists':               {pageTitle: 'stockists', ...lightMode},
    '/bag':                     {pageTitle: 'shopping bag', ...lightMode},
    '/wishlist':                {pageTitle: 'wishlist', ...lightMode},
    '/acccustomer-service':     {pageTitle: 'customer service', ...lightMode},
    '/legal-area':              {pageTitle: 'legal area', ...lightMode},
    '/checkout':                {pageTitle: 'checkout', ...lightMode},
    default:                    {pageTitle: null, ...lightMode}
}

export default function Layout({ header: { siteTitle, favicon, headerMenuItems }, footer, news, children, links, activeLink }: PageLayoutProps) {
    const router = useRouter()
    const headerEl = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const getHeaderHeight = () => {
        if(headerEl.current?.offsetHeight) {
            if(isMobile) {
                document.documentElement.style.scrollPaddingTop = `${headerEl.current.offsetHeight}px`
            }
            return headerEl.current.offsetHeight - 2
        }
        return 100
    }

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
            dispatch(setHeader(headerSettingsMap[router.pathname] ?? headerSettingsMap.default))
        }
    }, [router.pathname] );

    useEffect( () => {
        if ( typeof window !== "undefined" ) {
            dispatch(initCart())
            dispatch(initWishlist())
        }
        dispatch(setHeader({height: getHeaderHeight()}))
        if (!headerEl.current) return; // wait for the elementRef to be available
        const resizeObserver = new ResizeObserver(() => {
            dispatch(setHeader({height: getHeaderHeight()}))
        });
        resizeObserver.observe(headerEl.current);
        return () => resizeObserver.disconnect();
    }, [] );

    useEffect(() => {
        dispatch(setHeader({isMobile}))
    }, [isMobile]);


    return (
        <>
            <Head>
                <title>{ siteTitle || 'INAN XX Angostura' }</title>
                <link rel="icon" href={ favicon || '/favicon.ico' }/>
            </Head>
            <main>
                <Header ref={headerEl} headerMenuItems={headerMenuItems} links={links} activeLink={activeLink} news={news} />
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