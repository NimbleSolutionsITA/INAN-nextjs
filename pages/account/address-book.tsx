import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import AccountLayout from "../../src/components/pages/account/AccountLayout";
import AddressBook from "../../src/components/pages/account/AddressBook";
import {getCountries} from "../../src/utils/shop";
import {Country} from "../../@types/woocommerce";

export type AddressBookPageProps = BasePageProps & { countries: Country[]}

const AddressBookPage: NextPage<AddressBookPageProps> = ({
    layoutProps,
    news,
    countries
}) => {
    return (
        <Layout {...layoutProps} news={news}>
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
        countries
    ] = await Promise.all([
        getLayoutProps(),
        getCountries()
    ]);
    return {
        props: {
            layoutProps,
            news,
            countries
        },
        revalidate: 10
    }
}