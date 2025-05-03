import {Grid} from "@mui/material";
import {ReactNode} from "react";
import {useIsMobile} from "../utils/layout";

type SplitLayoutProps = {
    left: ReactNode | ReactNode[]
    right: ReactNode | ReactNode[]
}

const SplitLayout = ({left, right}: SplitLayoutProps) => {
    const isMobile = useIsMobile()
    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                {left}
            </Grid>
            <Grid item xs={12} md={6}>
                <Grid container>
                    {!isMobile && <Grid item xs={1} lg={4}/>}
                    <Grid item xs={12} lg={8}>
                        {right}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SplitLayout