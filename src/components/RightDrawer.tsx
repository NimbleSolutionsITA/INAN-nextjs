import React, {Dispatch, ReactNode, SetStateAction} from "react"
import {Grid, IconButton, SwipeableDrawer} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";
import Container from "./Container";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

type RightDrawerProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    children: ReactNode
}

const RightDrawer = ({open, setOpen, children}: RightDrawerProps) => {
    const { height } = useSelector((state: RootState) => state.header);
    return (
        <SwipeableDrawer
            anchor="right"
            sx={{'& .MuiDrawer-paper': {
                    height: typeof window !== 'undefined' ? window.innerHeight : 500,
                    width: '100%',
                    paddingTop: `calc(${height}px + 10px)`,
                    textTransform: 'uppercase',
                    zIndex:0,
                    backgroundColor: {
                        xs: '#fff',
                        md: 'transparent'
                    },
                }}}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            elevation={0}
            ModalProps={{hideBackdrop: true}}
        >
            <Container style={{height: (typeof window !== 'undefined' ? window.innerHeight : 500) - height - 5}}>
                <Grid container spacing={2} sx={{height: '100%', position: 'relative', justifyContent: 'flex-end'}}>
                    <Grid item xs={12} md={4} sx={{backgroundColor: '#fff', height: '100%', width:'100%', paddingTop: 0}}>
                        <IconButton onClick={() => setOpen(false)} sx={{position: 'absolute', right: 0, top: 0}}>
                            <CloseOutlined />
                        </IconButton>
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </SwipeableDrawer>
    )
}

export default RightDrawer