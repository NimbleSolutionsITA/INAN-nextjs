import {Divider, Grid, Typography} from "@mui/material"
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import Button from "../../Button";
import LoginForm from "./LoginForm";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Login = () => {
    const { header: {isMobile}, auth: {authenticated} } = useSelector((state: RootState) => state);
    const router = useRouter()
    useEffect(() => {
        if (authenticated) {
            router.push(router.query.returnUrl?.toString() || '/account' );
        }
    }, [authenticated]);
    return (
        <Grid style={{marginTop: isMobile ? 0 : '20px'}} container spacing={4}>
            <Grid item xs={12} md={6}>
                <Typography variant="h1" component="h1">Log in</Typography>
                {!isMobile && <Divider />}
                <LoginForm />
            </Grid>
            <Grid item xs={12} md={6} style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h1" component="h1">Register</Typography>
                {!isMobile && <Divider />}
                <div style={{flexGrow: 1, paddingTop: isMobile ? 0 : '20px', paddingBottom: '10px'}}>
                    <Typography variant="body1" component="p">REGISTER TO COMPLETE CHECKOUT MORE QUICKLY, REVIEW ORDER INFORMATION and much more.</Typography>
                </div>
                <Button href="/register" variant="contained" color="secondary" fullWidth>Register</Button>
            </Grid>
        </Grid>
    )
}

export default Login