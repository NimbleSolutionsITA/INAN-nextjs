import React, {Dispatch, ReactNode, SetStateAction} from "react"
import {Grid, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";
import Container from "./Container";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

type RightDrawerProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    children: ReactNode
    title?: string
}

const RightDrawer = ({open, setOpen, children, title}: RightDrawerProps) => {
    const { height } = useSelector((state: RootState) => state.header);
    return (
        <SwipeableDrawer
            anchor="right"
            sx={{'& .MuiDrawer-paper': {
                    height: '100%',
                    width: '100%',
                    paddingTop: `${height}px`,
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
            <Container style={{height: `calc(100vh - ${height}px)`}}>
                <Grid container spacing={2} sx={{height: '100%', position: 'relative', justifyContent: 'flex-end'}}>
                    <Grid item xs={12} md={4} sx={{backgroundColor: '#fff', height: '100%', width:'100%', paddingTop: 0}}>
                        <div style={title ? {height: '40px', borderBottom: '1px solid'} : {}}>
                            {title && <Typography sx={{padding: '10px 0'}} variant="h3">{title}</Typography>}
                            <IconButton onClick={() => setOpen(false)} sx={{position: 'absolute', right: 0, top: 18}}>
                                <CloseOutlined />
                            </IconButton>
                        </div>
                        <div style={{width: '100%', height: '18px'}} />
                        {children}
                    </Grid>
                </Grid>
            </Container>
        </SwipeableDrawer>
    )
}

export default RightDrawer