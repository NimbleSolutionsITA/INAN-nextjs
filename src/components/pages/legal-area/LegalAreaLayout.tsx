import React from 'react'
import {Grid, Divider} from "@mui/material"
import NavButton from "../../../components/NavButton"
import WpBlock from "../../../components/WpBlock";
import Container from "../../../components/Container";
import {WP_REST_API_Post} from "wp-types/index";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

const LegalAreaLayout = ({content}: {content: WP_REST_API_Post}) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    return (
        <Container headerPadding>
            <Grid container spacing={4} style={{paddingTop: '30px'}}>
                <Grid item xs={12} md={4}>
                    {isMobile && <Divider />}
                    <NavButton path="/legal_area/terms-and-conditions" title="TERMS AND CONDITION" />
                    <NavButton path="/legal_area/privacy-policy" title="PRIVACY POLICY" />
                    <NavButton path="/legal_area/cookie-policy" title="COOKIE POLICY" />
                </Grid>
                <Grid item xs={12} md={8}>
                    <WpBlock content={content} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default LegalAreaLayout