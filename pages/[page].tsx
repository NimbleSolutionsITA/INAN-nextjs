import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {ACFMedia, getLayoutProps, getPageProps, PageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Container from '../src/components/Container';
import {getAllPagesIds} from "../src/utils/shop";
import parse from "html-react-parser";

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
    pageTitle: null
}

const GenericPage: NextPage<MadeToOrderPageProps> = ({
     layoutProps,
     news,
     page,
     links
}) => {
    const  { yoast_head, title: {rendered: pageTitle}, content} = page
    return (
        <Layout {...layoutProps} yoast={yoast_head} pageSettings={{...pageSettings, pageTitle}} links={links} news={news}>
            <Container headerPadding>
                {content.rendered && parse(content.rendered)}
            </Container>
        </Layout>
    )
}

export default GenericPage

export async function getStaticProps({ params: { page: slug } }: { params: {page: string}}) {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps(slug)
    ]);
    const redirect = REDIRECTS.find(r => r.page === slug)
    if (redirect) {
        return {
            redirect: {
                destination: redirect.destination,
                permanent: true,
                // statusCode: 301
            },
        }
    }
    return page ? {
        props: {
            layoutProps,
            page,
            news
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export async function getStaticPaths() {
    const paths = await getAllPagesIds();
    return {
        paths,
        fallback: 'blocking',
    };
}

const REDIRECTS = [
    {
        page: 'product',
        destination: '/shop',
    },
    {
        page: 'customer_service',
        destination: '/customer_service/contact',
    },
    {
        page: 'customer-service',
        destination: '/customer_service/contact',
    },
    {
        page: 'contact',
        destination: '/customer_service/contact',
    },
    {
        page: 'shipping',
        destination: '/customer_service/shipping',
    },
    {
        page: 'returns',
        destination: '/customer_service/returns',
    },
    {
        page: 'legal_area',
        destination: '/legal_area/terms-and-conditions',
    },
    {
        page: 'legal-area',
        destination: '/legal_area/terms-and-conditions',
    },
    {
        page: 'terms-and-conditions',
        destination: '/legal_area/terms-and-conditions',
    }
]
