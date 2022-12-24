import {Divider, Typography} from "@mui/material";
import React from "react";
import Button from "./Button";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {RootState} from "../redux/store";


type NavButtonProps = {
    path: string
    title: string
}

const NavButton = ({path, title}: NavButtonProps) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const router = useRouter()
    return (
        <>
            <div style={{display: "flex"}}>
                <Button color="secondary" inactive={router.pathname !== path} disableRipple lineThrough disableGutters disablePadding disableHover href={path}>
                    <Typography variant="h3" component="h3">{title}</Typography>
                </Button>
                <div style={{flexGrow: 1, height: '100%'}} />
                {isMobile && (
                    <Typography style={{fontSize: '11px', lineHeight: '10px'}}>
                        {'>'}
                    </Typography>
                )}
            </div>
            <Divider />
        </>
    )
}

export default NavButton