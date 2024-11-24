import {Divider, Typography} from "@mui/material";
import Container from "../../Container";
import Button from "../../Button";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {resetAuth, setAuth} from "../../../redux/authSlice";
import {useIsMobile} from "../../../utils/layout";
import {AUTH_PASSWORD_KEY} from "../private";

const PageTitle = ({pageTitle}: { pageTitle: string | null }) => {
    const isMobile = useIsMobile()
    const {authenticated, privateSalesAccess} = useSelector((state: RootState) => state.auth);
    const cart = useSelector((state: RootState) => state.cart.items);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const { headerColorMobile, bgColor, loading} = useSelector((state: RootState) => state.header);

    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem('inan-token')
        dispatch(resetAuth())
        router.push('/')
    }
    const handlePrivateLogout = () => {
        localStorage.removeItem(AUTH_PASSWORD_KEY); // Clear saved password
        dispatch(setAuth({ privateSalesAccess: false }));
        router.push("/"); // Redirect to home or login page
    };
    const amountCart = router.pathname.startsWith('/bag') ? cart?.length || 0 : false
    const amountWishlist = router.pathname.startsWith('/wishlist') ? wishlist?.length || 0 : false
    const amount = amountCart || amountWishlist
    return pageTitle && !loading ? (
        isMobile ? (
            <>
                <Divider sx={{backgroundColor: headerColorMobile}} />
                <Container noPaddingBottom style={{display: 'flex', backgroundColor: bgColor}}>
                    <Typography
                        component="div"
                        style={{
                            color: headerColorMobile,
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
                                color: headerColorMobile,
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
                    {router.pathname.startsWith('/private-sales') && privateSalesAccess && (
                        <Button color="secondary" disableGutters disablePadding onClick={handlePrivateLogout}>Logout</Button>
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
                            {router.pathname.startsWith('/private-sales') && privateSalesAccess && (
                                <div style={{position: 'absolute', right: 0, top: '25px'}}>
                                    <Button color="secondary" disableGutters disablePadding onClick={handlePrivateLogout}>Logout</Button>
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
