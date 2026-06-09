import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Dialog, DialogContent, IconButton, Typography} from "@mui/material";
import Cookies from "js-cookie";
import Button from "../Button";

// --- Campaign promo config -------------------------------------------------
// The agency must append `?promo=INANEB15` to the ad landing links so the
// pop-up only shows to visitors arriving through the campaign.
const PROMO_CODE = "INANEB15";
const PROMO_QUERY_KEY = "promo";
const PROMO_COOKIE = `INAN_promo_${PROMO_CODE}`;
const PROMO_COOKIE_EXPIRY_DAYS = 30;
// CTA destination — update with the exact MULTI BAG collection URL if needed.
const BAGS_COLLECTION_URL = "/shop";
// ---------------------------------------------------------------------------

const PromoModal = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;
        const param = router.query[PROMO_QUERY_KEY];
        const value = Array.isArray(param) ? param[0] : param;
        const triggered = value?.toUpperCase() === PROMO_CODE;
        if (triggered && !Cookies.get(PROMO_COOKIE)) {
            setOpen(true);
        }
    }, [router.isReady, router.query]);

    const dismiss = () => {
        Cookies.set(PROMO_COOKIE, "1", {expires: PROMO_COOKIE_EXPIRY_DAYS});
        setOpen(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(PROMO_CODE);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable (e.g. insecure context) — user can still
            // read and type the code manually.
        }
    };

    return (
        <Dialog open={open} onClose={dismiss}>
            <DialogContent sx={{textAlign: "center", padding: {xs: "32px 24px", sm: "40px 48px"}, position: "relative"}}>
                <IconButton
                    aria-label="Close"
                    onClick={dismiss}
                    sx={{position: "absolute", top: 8, right: 8, color: "#000"}}
                >
                    ✕
                </IconButton>
                <Typography variant="h5" sx={{textTransform: "uppercase", marginBottom: "8px"}}>
                    15% off our new bag collection for the first customers
                </Typography>
                <Typography sx={{textTransform: "uppercase", marginBottom: "24px"}}>
                    Insert code upon checkout
                </Typography>
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "stretch", gap: "8px", marginBottom: "24px"}}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #000",
                            padding: "8px 24px",
                            letterSpacing: "3px",
                            fontWeight: 600,
                        }}
                    >
                        {PROMO_CODE}
                    </Box>
                    <Button variant="contained" color="secondary" onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy code"}
                    </Button>
                </Box>
                <Button variant="outlined" color="secondary" href={BAGS_COLLECTION_URL} onClick={dismiss}>
                    Shop bags
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default PromoModal;
