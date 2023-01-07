import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import AccountLayout from "../../src/components/pages/account/AccountLayout";
import AddressBook from "../../src/components/pages/account/AddressBook";
import {getCountries} from "../../src/utils/shop";
import {Country} from "../../@types/woocommerce";

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'account'
}

export type AddressBookPageProps = BasePageProps & { countries: Country[]}

const AddressBookPage: NextPage<AddressBookPageProps> = ({
    layoutProps,
    news,
    countries,
    page
}) => {
    return (
        <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={{...pageSettings, pageTitle: page.title.rendered}} news={news}>
           <AccountLayout>
               <AddressBook countries={countries} />
           </AccountLayout>
        </Layout>
    )
}

export default AddressBookPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        countries,
        {page}
    ] = await Promise.all([
        getLayoutProps(),
        getCountries(),
        getPageProps('account')
    ]);
    return {
        props: {
            layoutProps,
            news,
            countries,
            page
        },
        revalidate: 10
    }
}