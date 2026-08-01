import {Box, Drawer, Typography} from "@mui/material";
import Button from "../Button";
import {useEffect, useState} from "react";

const ADVICE_KEY = 'inan_Advice';

// Local calendar day the notice was dismissed on: the "OK" choice is kept
// until the following day, then the notice shows again.
const today = () => new Date().toDateString();

const AdviceDrawer = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(ADVICE_KEY) !== today()) {
            setOpen(true)
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(ADVICE_KEY, today())
        setOpen(false)
    }

    return (
        <Drawer
            variant="persistent"
            open={open}
            sx={{width: "100%"}}
            anchor="top"
            elevation={0}
            onClose={handleClose}
        >
            <Box sx={{display: "flex", backgroundColor: "black", padding: "8px", gap: '10px', justifyContent: "center", alignItems: "center"}}>
                <Typography color="primary">
                    Kindly note that orders placed from August 1st to 31st will be processed beginning September 1st due to our summer break. Thank you!
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{width: {xs: "100%", md: "150px"}, height: "21px"}}
                >
                    OK
                </Button>
            </Box>
        </Drawer>
    )
}

export default AdviceDrawer;