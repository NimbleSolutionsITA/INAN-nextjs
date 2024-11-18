import Header from './header'
import Footer from './footer'
import Head from "next/head";
import {BasePageProps, LinkItem, PageSettings} from "../../../@types";
import { useRouter} from "next/router";
import Loading from "../Loading";
import { useSelector} from "react-redux";
import parse from "html-react-parser";
import * as React from "react";
import {RootState} from "../../redux/store";
import useLayoutHook from "../../utils/useLayoutHook";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

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
    const { loading } = useSelector((state: RootState) => state.header);
    useLayoutHook(pageSettings, links)
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                <link rel="shortcut icon" href={favicon}/>
                {yoast && parse(yoast)}
            </Head>
            <main>
                <AppRouterCacheProvider>
                    <Header pageTitle={pageSettings.pageTitle} headerMenuItems={headerMenuItems} links={links} activeLink={activeLink} news={news} />
                    <div style={{minHeight: '100vh', backgroundColor: router.pathname === '/about' ? '#000' : undefined}}>
                        {loading ? <Loading /> : children}
                    </div>
                </AppRouterCacheProvider>
            </main>
            <Footer {...footer} />
        </>
    )
}