import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Divider, Typography} from "@mui/material";
import Container from "../../Container";
import Button from "../../Button";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {resetAuth} from "../../../redux/authSlice";

const PageTitle = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {
        auth: { authenticated }, cart: {items: cart}, wishlist: {items: wishlist}, header: {pageTitle, headerColor, bgColor, loading}
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem('inan-token')
        dispatch(resetAuth())
        router.push('/')
    }
    const amountCart = router.pathname.startsWith('/bag') ? cart?.length || 0 : false
    const amountWishlist = router.pathname.startsWith('/wishlist') ? wishlist?.length || 0 : false
    const amount = amountCart || amountWishlist
    return pageTitle && !loading ? (
        isMobile ? (
            <>
                <Divider />
                <Container noPaddingBottom style={{display: 'flex', backgroundColor: bgColor}}>
                    <Typography
                        component="div"
                        style={{
                            color: headerColor,
                            paddingTop: '6px'
                        }}
                    >
                        {pageTitle}
                    </Typography>
                    <div style={{flexGrow: 1}} />
                    {amount && (
                        <Typography
                            component="div"
                            style={{
                                color: headerColor,
                                backgroundColor: bgColor,
                                paddingTop: '6px'
                            }}
                        >
                            ({amount})
                        </Typography>
                    )}
                    {router.pathname.startsWith('/account') && authenticated && (
                        <Button color="secondary" disableGutters disablePadding onClick={handleLogout}>Logout</Button>
                    )}

                </Container>
                {router.pathname.startsWith('/about') && <Divider style={{backgroundColor: '#fff'}} />}
            </>
        ) : (
            <>
                {!router.pathname.startsWith('/about') && (
                    <>
                        <Typography
                            variant="h1"
                            component="div"
                            style={{position: 'relative'}}
                        >
                            {pageTitle}
                            {router.pathname.startsWith('/account') && authenticated && (
                                <div style={{position: 'absolute', right: 0, top: '25px'}}>
                                    <Button color="secondary" disableGutters disablePadding onClick={handleLogout}>Logout</Button>
                                </div>
                            )}
                        </Typography>
                        <Divider />
                    </>
                )}
            </>
        )

    ) : <div />
}

export default PageTitle
