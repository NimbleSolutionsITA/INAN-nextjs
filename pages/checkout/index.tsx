import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import Checkout from "../../src/components/pages/checkout/Checkout";
import {getCheckoutProps, ShippingProps} from "../../src/utils/shop";

export type CheckoutPageProps = BasePageProps & { woocommerce: ShippingProps}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'checkout'
}

const CheckoutPage: NextPage<CheckoutPageProps> = ({
   layoutProps,
   news,
   woocommerce,
   page: { yoast_head}
}) => (
    <Layout {...layoutProps} yoast={yoast_head} pageSettings={pageSettings} news={news}>
        <Checkout woocommerce={woocommerce} />
    </Layout>
)

export default CheckoutPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        woocommerce,
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getCheckoutProps(),
        getPageProps('checkout')
    ]);
    return {
        props: {
            layoutProps,
            news,
            woocommerce,
            page
        },
        revalidate: 10
    }
}