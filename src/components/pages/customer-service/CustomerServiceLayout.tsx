import React from 'react'
import {Grid, Divider} from "@mui/material"
import NavButton from "../../../components/NavButton"
import WpBlock from "../../../components/WpBlock";
import Container from "../../../components/Container";
import {WP_REST_API_Post} from "wp-types/index";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

const CustomerServiceLayout = ({content}: {content: WP_REST_API_Post}) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    return (
        <Container headerPadding>
            <Grid container spacing={4} style={{paddingTop: '30px'}}>
                <Grid item xs={12} md={4}>
                    {isMobile && <Divider />}
                    <NavButton path="/customer_service/contact" title="CONTACT" />
                    <NavButton path="/customer_service/product-care" title="PRODUCT CARE" />
                    <NavButton path="/customer_service/shipping" title="SHIPPING" />
                    <NavButton path="/customer_service/returns" title="RETURNS" />
                </Grid>
                <Grid item xs={12} md={8}>
                    <WpBlock content={content} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default CustomerServiceLayout