import {Box, Drawer, Typography} from "@mui/material";
import Button from "../Button";
import {getConsent, gtagConsent, setLocalStorage} from "../../utils/helpers";

type CookieDrawerProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDialogOpen: (open: boolean) => void;
}

const CookieDrawer = ({open, setOpen, setDialogOpen}: CookieDrawerProps) => {
    const acceptCookies = (all: boolean) => {
        setLocalStorage('cookie_consent', {
            analytics: all,
            profiling: all,
            usage: all,
            storage: all
        })
        gtagConsent({
            'ad_user_data': getConsent(all),
            'ad_personalization': getConsent(all),
            'ad_storage': getConsent(all),
            'analytics_storage': getConsent(all),
        })
        setOpen(false);
    }
    const acceptAll = () => acceptCookies(true)
    const acceptOnlyTechnical = () => acceptCookies(false)
    const cookieSettings = () => {
        setOpen(false);
        setDialogOpen(true);
    }
    return (
        <Drawer
            variant="persistent"
            open={open}
            sx={{width: "100%"}}
            anchor="bottom"
            elevation={0}
        >
            <Box sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, backgroundColor: "black", padding: "8px"}}>
                <Box flexGrow={1}>
                    <Typography color="primary" textAlign={{xs: 'center', md: 'left'}}>
                        By selecting “Accept All Cookies,” you consent to storing cookies on your device to improve site navigation, track usage, and support our marketing initiatives.
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, gap: "8px", alignItems: "center"}}>
                    <Button
                        onClick={acceptOnlyTechnical}
                        sx={{width: {xs: '100%', md: "190px"}, height: "21px"}}
                    >
                        Accept only Tecnical Cookies
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={cookieSettings}
                        sx={{width: {xs: '100%', md: "130px"}, height: "21px"}}
                    >
                        Cookie Settings
                    </Button>
                    <Button
                        variant="contained"
                        onClick={acceptAll}
                        sx={{color: "black", width: {xs: "100%", md: "150px"}, height: "21px"}}
                    >
                        Accept all Cookies
                    </Button>
                </Box>
            </Box>
        </Drawer>
    )
}

export default CookieDrawer;