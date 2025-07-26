import {Box, Drawer, Typography} from "@mui/material";
import Button from "../Button";
import {useState} from "react";

const AdviceDrawer = () => {
    const [open, setOpen] = useState(true);
    return (
        <Drawer
            variant="persistent"
            open={open}
            sx={{width: "100%"}}
            anchor="top"
            elevation={0}
            onClose={() => setOpen(false)}
        >
            <Box sx={{display: "flex", backgroundColor: "black", padding: "8px", gap: '10px', justifyContent: "center", alignItems: "center"}}>
                <Typography color="primary">
                    Kindly note that orders placed from August 1st to 31st will be processed beginning September 1st due to our summer break. Thank you!
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    sx={{width: {xs: "100%", md: "150px"}, height: "21px"}}
                >
                    OK
                </Button>
            </Box>
        </Drawer>
    )
}

export default AdviceDrawer;