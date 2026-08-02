import {Box, Drawer, Typography} from "@mui/material";
import Button from "../Button";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setHeader} from "../../redux/headerSlice";

const ADVICE_KEY = 'inan_Advice';

// Local calendar day the notice was dismissed on: the "OK" choice is kept
// until the following day, then the notice shows again.
const today = () => new Date().toDateString();

const AdviceDrawer = () => {
    const [dismissed, setDismissed] = useState(true);
    const { open: menuOpen } = useSelector((state: RootState) => state.header);
    const dispatch = useDispatch()
    const contentRef = useRef<HTMLDivElement>(null);

    // Both headers are fixed on top of the page, so the notice would end up
    // behind them: it sits above instead and the headers are pushed down by
    // its measured height (the text wraps on small screens).
    const open = !dismissed && !menuOpen;

    useEffect(() => {
        setDismissed(localStorage.getItem(ADVICE_KEY) === today())
    }, []);

    useEffect(() => {
        const content = contentRef.current;
        if (!open || !content) {
            dispatch(setHeader({ adviceHeight: 0 }))
            return
        }
        const measure = () => dispatch(setHeader({ adviceHeight: content.offsetHeight }));
        measure()
        const observer = new ResizeObserver(measure);
        observer.observe(content)
        return () => observer.disconnect()
    }, [open, dispatch]);

    const handleClose = () => {
        localStorage.setItem(ADVICE_KEY, today())
        setDismissed(true)
    }

    return (
        <Drawer
            variant="persistent"
            open={open}
            sx={{
                width: "100%",
                // above the mobile AppBar, which sits at theme.zIndex.modal + 2
                zIndex: (theme) => theme.zIndex.modal + 3,
                '& .MuiDrawer-paper': {
                    zIndex: (theme) => theme.zIndex.modal + 3,
                },
            }}
            anchor="top"
            elevation={0}
            onClose={handleClose}
        >
            <Box ref={contentRef} sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, backgroundColor: "black", padding: "8px", gap: '10px', justifyContent: "center", alignItems: "center"}}>
                <Typography color="primary" textAlign={{xs: 'center', md: 'left'}}>
                    Kindly note that orders placed from August 1st to 31st will be processed beginning September 1st due to our summer break. Thank you!
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{width: {xs: "100%", md: "150px"}, height: "21px", flexShrink: 0}}
                >
                    OK
                </Button>
            </Box>
        </Drawer>
    )
}

export default AdviceDrawer;
