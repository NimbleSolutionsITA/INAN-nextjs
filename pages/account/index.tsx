import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import AccountLayout from "../../src/components/pages/account/AccountLayout";
import PersonalInfo from "../../src/components/pages/account/PersonalInfo";

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
                                   }) => {
    return (
        <Layout {...layoutProps} pageSettings={pageSettings} news={news}>
           <AccountLayout>
                <PersonalInfo />
           </AccountLayout>
        </Layout>
    )
}

export default AccountPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
    ] = await Promise.all([
        getLayoutProps(),
    ]);
    return {
        props: {
            layoutProps,
            news
        },
        revalidate: 10
    }
}