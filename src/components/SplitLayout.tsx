import {Grid, Hidden} from "@mui/material";
import {ReactNode} from "react";

type SplitLayoutProps = {
    left: ReactNode | ReactNode[]
    right: ReactNode | ReactNode[]
}

const SplitLayout = ({left, right}: SplitLayoutProps) => {
    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                {left}
            </Grid>
            <Grid item xs={12} md={6}>
                <Grid container>
                    <Hidden xsDown><Grid item xs={1} lg={4} /></Hidden>
                    <Grid item xs={12} lg={8}>
                        {right}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SplitLayout