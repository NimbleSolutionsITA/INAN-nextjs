import {Accordion, AccordionDetails, AccordionSummary, Box, Dialog, DialogContent, Typography} from "@mui/material";
import React, {ReactNode, useState} from "react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import Button from "../Button";
import Checkbox from "../Checkbox";
import {COOKIE_CONSENT_NAME, OptionalConsent} from "./GoogleAnalytics";
import {useDispatch, useSelector} from "react-redux";
import {closeCookieModal} from "../../redux/authSlice";
import {RootState} from "../../redux/store";
import Cookies from "js-cookie";

type CookieModalProps = {
    onConsentChange: (consent: OptionalConsent) => void;
}

const CookieModal = ({onConsentChange}: CookieModalProps) => {
    const cookieSettings = Cookies.get(COOKIE_CONSENT_NAME)
    const defaultCookieSettings: OptionalConsent = cookieSettings ? JSON.parse(cookieSettings) : {
        adUserDataConsentGranted: false,
        adPersonalizationConsentGranted: false,
        analyticsConsentGranted: false,
        personalizationConsentGranted:false
    }
    const [currentSettings, setCurrentSettings] = useState<OptionalConsent>(defaultCookieSettings)

    const dispatch = useDispatch();
    const cookieModalOpen = useSelector<RootState>(state => state.auth.cookieModalOpen) as boolean;

    const handleSaveSettings = (allTrue?: boolean) => {
        const newSettings = allTrue ? {
            adUserDataConsentGranted: true,
            adPersonalizationConsentGranted: true,
            analyticsConsentGranted: true,
            personalizationConsentGranted:true
        } : currentSettings
        onConsentChange(newSettings)
        dispatch(closeCookieModal());
    }

    const toggleSetting = (setting: keyof OptionalConsent)=>  () => setCurrentSettings({...currentSettings, [setting]: !currentSettings[setting]})

    return (
        <Dialog open={cookieModalOpen} onClose={() => dispatch(closeCookieModal())}>
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
                    <AccordionPanel title="Ad User Data Consent" checked={currentSettings.adUserDataConsentGranted} setChecked={toggleSetting('adUserDataConsentGranted')}>
                        <Typography textAlign="justify">
                            We use cookies to send user data for advertising purposes, such as tracking ad performance and measuring audience interactions. Granting this consent helps us improve how we deliver and report ads.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Ad Personalization Consent" checked={currentSettings.adPersonalizationConsentGranted} setChecked={toggleSetting('adPersonalizationConsentGranted')}>
                        <Typography textAlign="justify">
                            We use cookies to personalize ads based on your interests and online behavior. Granting this consent allows ads to be more relevant and tailored to you.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Analytics Consent" checked={currentSettings.analyticsConsentGranted} setChecked={toggleSetting('analyticsConsentGranted')}>
                        <Typography textAlign="justify">
                            We use cookies to collect data about how you interact with our website, like pages visited and actions taken. Granting this consent helps us understand usage patterns and improve our services.
                        </Typography>
                    </AccordionPanel>
                    <AccordionPanel title="Personalization Consent" checked={currentSettings.personalizationConsentGranted} setChecked={toggleSetting('personalizationConsentGranted')}>
                        <Typography textAlign="justify">
                            We use cookies to personalize your overall experience on our site, beyond just ads. Granting this consent allows us to offer features, content, and recommendations tailored to your preferences.
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