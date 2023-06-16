import React, {ReactNode} from 'react';
import Link from 'next/link'
import {
    AppBar as MuiAppBar,
    Box,
    Container,
    IconButton,
    List, ListItem,
    ListItemText,
    SwipeableDrawer, SxProps, Theme,
    Toolbar
} from "@mui/material";
import {MenuItem} from "../../../../@types/wordpress";
import {useRouter} from "next/router";
import BurgerIcon from "../../icons/BurgerIcon"
import CartIcon from "../../icons/CartIcon"
import InAnLogo from "../../icons/InAnLogo"
import Logo from "../../Logo";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {setHeader} from "../../../redux/headerSlice";

type AppBarProps = {
    children: ReactNode,
    navLinks: string | MenuItem[]
    height?: number
}

const styles: {
    [key: string]: SxProps<Theme>
} = {
    root: {
        display: "flex",
        flexGrow: 1,
        '& header': {
            borderBottom: '1px solid #000',
        },
    },
    title: {
        paddingTop: '20px',
        paddingBottom: '20px',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    toolbarIcons: {
        marginLeft: 1,
        transition: 'all .75s ease',
    },
    drawerNavContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',

    },
    separator: {
        flexGrow: 1,
    }
}

const AppBar = ({children, navLinks, height = 94}: AppBarProps) => {
    const router = useRouter()
    const {
        header: { open, bgColor },
        auth: { authenticated },
        cart: {items: cartItems},
        wishlist: {items: wishlistItems}
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch()

    const handleOpenDrawer = (open: boolean) => {
        dispatch(setHeader({ open }))
    }

    const handleBagClick = () => {
        dispatch(setHeader({ open: false }))
        return router.push('/bag')
    }

    return (
        <Box sx={{...styles.root, height}}>
            <MuiAppBar position="fixed" square elevation={0} sx={{
                backgroundColor: open ? 'transparent' : (bgColor === 'transparent' ? '#fff' : bgColor),
                zIndex: (theme) => theme.zIndex.modal+2,
            }}>
                <>
                    <Toolbar component={Container}>
                        <IconButton edge="start" sx={styles.title} color="inherit">
                            <Link onClick={() => handleOpenDrawer(false)} href="/"><Logo height={30} color={open ? '#fff' : '#000'} /></Link>
                        </IconButton>
                        <div style={{flex: 1}} />
                        <IconButton onClick={handleBagClick} sx={styles.toolbarIcons} color="inherit" aria-label="menu">
                            <CartIcon color={open ? '#fff' : '#000'} height={20} open={open} items={cartItems.length} />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDrawer(!open)} edge="end" sx={styles.toolbarIcons} color="inherit" aria-label="menu">
                            <BurgerIcon color={open ? '#fff' : '#000'} open={open}/>
                        </IconButton>
                    </Toolbar>
                    {children}
                </>
            </MuiAppBar>
            {typeof window !== 'undefined' && (
                <SwipeableDrawer
                    sx={{
                        '&	.MuiDrawer-paper': {
                            zIndex: (theme) => theme.zIndex.modal+1,
                            height: window.innerHeight,
                            width: '100%',
                            backgroundColor: '#000',
                            color: '#fff',
                            paddingTop: '70px',
                            textTransform: 'uppercase',
                            '& > div': {
                                height: '100%',
                            }
                        }
                    }}
                    anchor="right"
                    open={open}
                    onClose={() => handleOpenDrawer(false)}
                    onOpen={() => handleOpenDrawer(true)}
                >
                    <Container style={{height: '100%', position: 'relative'}}>
                        <List sx={styles.drawerNavContainer}>
                            {Array.isArray(navLinks) && navLinks.map(link => (
                                <ListItem component={Link} href={link.url} disableGutters key={link.title} onClick={() => handleOpenDrawer(false)}>
                                    <ListItemText primary={link.title} />
                                </ListItem>
                            ))}
                            <ListItem component="div" style={{flexGrow: 1}} />
                            <ListItem component={Link} href="/bag" disableGutters onClick={() => handleOpenDrawer(false)}>
                                <ListItemText primary={`SHOPPING BAG (${cartItems.length})`} />
                            </ListItem>
                            <ListItem component={Link} href="/wishlist" disableGutters onClick={() => handleOpenDrawer(false)}>
                                <ListItemText primary={`WISHLIST (${wishlistItems.length})`} />
                            </ListItem>
                            <ListItem component={Link} href={authenticated ? '/account' : '/login'} disableGutters button onClick={() => handleOpenDrawer(false)}>
                                <ListItemText primary={authenticated ? 'ACCOUNT' : 'LOGIN / REGISTER'} />
                            </ListItem>
                            <ListItem component={Link} href="/customer-service" disableGutters onClick={() => handleOpenDrawer(false)}>
                                <ListItemText primary="CUSTOMER SERVICE" />
                            </ListItem>
                        </List>
                        <div style={{position: 'absolute', bottom: '10px', right: '20px'}}>
                            <InAnLogo color="#fff" height="50px" />
                        </div>
                    </Container>
                </SwipeableDrawer>

            )}
        </Box>
    );
}

export default AppBar;