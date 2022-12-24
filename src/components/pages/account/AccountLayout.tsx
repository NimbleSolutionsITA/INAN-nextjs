import {Divider, Grid} from "@mui/material"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import NavButton from "../../NavButton";
import {ReactNode, useEffect} from "react";
import Container from "../../Container";
import {API_CUSTOMER_ENDPOINT} from "../../../utils/endpoints";
import {setCustomer} from "../../../redux/customerSlice";
import {setHeader} from "../../../redux/headerSlice";

const AccountLayout = ({children}: {children: ReactNode}) => {
    const { header: {isMobile}, auth: {user}, customer: {customer} } = useSelector((state: RootState) => state);
    const dispatch = useDispatch()
    useEffect(() => {
        if (user?.id) {
            dispatch(setHeader({loading: true}))
            fetch(`${API_CUSTOMER_ENDPOINT}/${user.id}`, {
                headers: [["Content-Type", 'application/json']]
            })
                .then(r => r.json())
                .then((response => {
                    if (response.success) {
                        dispatch(setCustomer(response.customer))
                    }
                }))
                .finally(() => dispatch(setHeader({loading: false})))

        }
    }, []);

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