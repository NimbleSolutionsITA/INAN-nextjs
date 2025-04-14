import {Accordion, AccordionDetails, AccordionSummary, Box, Dialog, DialogContent, Typography} from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import {getLocalStorage, gtagConsent, setLocalStorage} from "../../utils/helpers";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import Button from "../Button";
import Checkbox from "../Checkbox";

type CookieModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const defaultCookieSettings = {
    analytics: true,
    profiling: true,
    usage: true,
    storage: true
}

const getConsent = (consent: boolean) => consent ? 'granted' : 'denied'

const CookieModal = ({open, setOpen}: CookieModalProps) => {const [analytics, setAnalytics] = useState(defaultCookieSettings.analytics);
    const [profiling, setProfiling] = useState(defaultCookieSettings.profiling);
    const [usage, setUsage] = useState(defaultCookieSettings.usage);
    const [storage, setStorage] = useState(defaultCookieSettings.storage);

    const handleSaveSettings = (allTrue?: boolean) => {
        if (allTrue) {
            setAnalytics(true);
            setProfiling(true);
            setUsage(true);
            setStorage(true);
        }
        const preferences = {
            analytics: allTrue || analytics,
            profiling: allTrue || profiling,
            usage: allTrue || usage,
            storage: allTrue || storage
        }
        setLocalStorage('cookie_consent', preferences)
        gtagConsent({
            'ad_user_data': getConsent(preferences.usage),
            'ad_personalization': getConsent(preferences.profiling),
            'ad_storage': getConsent(preferences.storage),
            'analytics_storage': getConsent(preferences.analytics),
        })
        setOpen(false);

    }

    useEffect (() => {
        let cookieSettings = getLocalStorage("cookie_consent", defaultCookieSettings)
        setAnalytics(cookieSettings.analytics)
        setProfiling(cookieSettings.profiling)
        setUsage(cookieSettings.usage)
        setStorage(cookieSettings.storage)
    }, [])

    return (
        <Dialog open={open} onClose={setOpen}>
            <DialogBody>
                <DialogContent>
                    <Typography textAlign="center" variant="h5" sx={{marginBottom: '8px'}}>
                        Cookie Settings
                    </Typography>
                    <Typography textAlign="justify">
                        Websites often collect and store information on your browser, mainly through cookies. These files help the site function properly and tailor your experience based on your preferences or device. While they don’t usually identify you personally, they contribute to a more customized browsing experience. To respect your privacy, you can control which types of cookies are used. Browse the categories to learn more and modify your settings. However, disabling certain cookies may affect site performance and limit the features available to you.
                    </Typography>
                    <Box sx={{width:'100%', textAlign: 'right', margin: "8px 0 16px"}}>
                        <Button variant="contained" color="secondary" onClick={() => handleSaveSettings(true)}>
                            Accept all
                        </Button>
                    </Box>
                    <Typography textAlign="center" variant="h5" sx={{marginBottom: '8px'}}>
                        Manage Consent Preferences
                    </Typography>
                    <AccordionPanel title="Functional Cookies (not optional)" checked={true}>
                        <Typography textAlign="justify">
                            Cookies are pieces of information saved in small text files on your browser when you visit a website. These cookies allow the sender to identify your device during the validity period of consent, which is usually one year.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Analytical Cookies" checked={analytics} setChecked={setAnalytics}>
                        <Typography textAlign="justify">
                            Other cookies are used to analyze the behavior of visitors and monitor site performance. By accepting these cookies, you help us to improve our website and provide an optimal browsing experience.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Advertising Profiling Cookies" checked={profiling} setChecked={setProfiling}>
                        <Typography textAlign="justify">
                            Furthermore, there are cookies that allow INANSTUDIO to show you advertisements based on your preferences, in line with the information collected during your navigation. These cookies are set by both us and carefully selected third parties. If you disable these cookies, the ads you will see may be less relevant to your personal interests.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Cookies to personalize your experience" checked={usage} setChecked={setUsage}>
                        <Typography textAlign="justify">
                            Finally, there are cookies that collect information about how the user uses the site in order to improve its quality, customize its features, and ensure an optimized browsing experience.
                        </Typography>
                    </AccordionPanel>
                    <Button variant="contained" fullWidth color="secondary" onClick={() => handleSaveSettings()} sx={{marginTop: '16px'}}>
                        Save settings
                    </Button>
                </DialogContent>
            </DialogBody>
        </Dialog>
    )
}

type AccordionPanelProps = {
    title: string
    children: ReactNode
    checked: boolean
    setChecked?: (checked: boolean) => void
}

const AccordionPanel = ({title, checked, setChecked, children}: AccordionPanelProps) => (
    <Accordion
        disableGutters
        sx={{
            width: "100%",
            borderBottom: "1px solid black",
            "::before": {
                opacity: 0
            }
        }}
        elevation={0}
        square

    >
        <AccordionSummary
            expandIcon={
                <div onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        checked={checked}
                        disabled={!setChecked}
                        onChange={(_, checked) => setChecked?.(checked)}
                    />
                </div>
            }
            sx={{
                padding: 0,
                ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "none"
                }
            }}
        >
            {title}
        </AccordionSummary>
        <AccordionDetails sx={{padding: "8px 0 16px"}}>
            {children}
        </AccordionDetails>
    </Accordion>
)

export default CookieModal