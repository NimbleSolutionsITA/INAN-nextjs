import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getLayoutProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import Checkout from "../src/components/pages/checkout/Checkout";
import {getCheckoutProps, ShippingProps} from "../src/utils/shop";

export type CheckoutPageProps = BasePageProps & { woocommerce: ShippingProps}

const CheckoutPage: NextPage<CheckoutPageProps> = ({
   layoutProps,
   news,
                                                       woocommerce
}) => (
    <Layout {...layoutProps} news={news}>
        <Checkout woocommerce={woocommerce} />
    </Layout>
)

export default CheckoutPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        woocommerce
    ] = await Promise.all([
        getLayoutProps(),
        getCheckoutProps()
    ]);
    return {
        props: {
            layoutProps,
            news,
            woocommerce
        },
        revalidate: 10
    }
}