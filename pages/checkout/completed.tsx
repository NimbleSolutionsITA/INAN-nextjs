import type { NextPage } from 'next'
import Layout from "../../src/components/layout";
import {getLayoutProps, getPageProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import {ShippingProps} from "../../src/utils/shop";
import {Container, Typography} from "@mui/material";

export type CheckoutPageProps = BasePageProps & { woocommerce: ShippingProps}

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: 'Thank you for your purchase!'
}

const CheckoutPage: NextPage<CheckoutPageProps> = ({
   layoutProps,
   news,
   page: { yoast_head}
}) => (
    <Layout {...layoutProps} yoast={yoast_head} pageSettings={pageSettings} news={news}>
        <Container>
            <Typography>
                Your order has been successfully processed, and a confirmation email has been sent to you.<br/>
                We’re preparing your items for shipment and will update you with tracking details soon. If you have any questions, feel free to contact our support team.
            </Typography>
        </Container>
    </Layout>
)

export default CheckoutPage

export async function getStaticProps() {
    const [
        {layoutProps, news},
        { page }
    ] = await Promise.all([
        getLayoutProps(),
        getPageProps('checkout')
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