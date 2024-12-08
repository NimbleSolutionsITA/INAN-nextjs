import {Divider, Grid} from "@mui/material"
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import NavButton from "../../NavButton";
import {ReactNode} from "react";
import Container from "../../Container";
import {useIsMobile} from "../../../utils/layout";

const AccountLayout = ({children}: {children: ReactNode}) => {
    const { customer } = useSelector((state: RootState) => state.customer);
    const isMobile = useIsMobile()
    return (
        <Container headerPadding >
            <Grid container spacing={4} style={{paddingTop: '30px'}}>
                <Grid item xs={12} md={4}>
                    {isMobile && <Divider />}
                    <NavButton path="/account" title="Personal info" />
                    <NavButton path="/account/address-book" title="Address book" />
                    <NavButton path="/account/orders" title="Orders" />
                </Grid>
                <Grid item xs={12} md={8}>
                    {customer && children}
                </Grid>
            </Grid>
        </Container>
    )
}

export default AccountLayout