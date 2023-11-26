import type { NextPage } from 'next'
import {getLayoutProps, getPageProps, PageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import PrivateLayout from "../../src/components/layout/private";
import PrivateProductGrid from "../../src/components/PrivateProductGrid";

export type SalesPageProps = BasePageProps & { page: PageProps['page'] }

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

const SalesPage: NextPage<SalesPageProps> = ({
     layoutProps,
     news,
     page,
     links
}) => {
    return (
        <PrivateLayout layoutProps={layoutProps} page={page} links={links} news={news}>
            <PrivateProductGrid />
        </PrivateLayout>
    )
}

export default SalesPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('private-sales')
    ]);
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