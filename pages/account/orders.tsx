import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import AccountLayout from "../../src/components/pages/account/AccountLayout";
import Orders from "../../src/components/pages/account/Orders";

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'account'
}

export type AccountPageProps = BasePageProps

const AccountPage: NextPage<AccountPageProps> = ({
    layoutProps,
    news,
    page
}) => {
    return (
        <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={{...pageSettings, pageTitle: page.title.rendered}} news={news}>
           <AccountLayout>
                <Orders />
           </AccountLayout>
        </Layout>
    )
}

export default AccountPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        {page}
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('account')
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