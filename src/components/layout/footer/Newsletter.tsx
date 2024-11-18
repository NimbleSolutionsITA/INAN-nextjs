import {useEffect, useState} from "react"
import NewsletterForm from "./NewsletterForm";
import Container from "../../Container";
import {Dialog, Grid, IconButton, Typography} from "@mui/material";
import CloseIcon from "../../icons/CloseIcon";

const Newsletter = ({isMobile}: {isMobile: boolean}) => {
    const [open, setOpen] = useState(false)
    const [subscribed, setSubscribed] = useState<boolean>(false)

    const handleClick = () => {
        localStorage.setItem(
            'inan_Newsletter',
            'seen'
        )
        setOpen(false)
    }

    useEffect(() => {
        if (localStorage.getItem('inan_Newsletter') !== 'seen') {
            setOpen(true)
        }
    }, []);

    return (
        <Dialog
            open={open}
            onClose={handleClick}
            style={{zIndex: 1401}}
            fullScreen
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    height: '100%',
                }
            }}
        >
            <Container style={{marginTop: isMobile ? 'calc(100vh - 350px)' : 'calc(50vh - 220px)'}}>
                <IconButton disableRipple onClick={handleClick} style={{position: 'absolute', right: 20, top: 20}}><CloseIcon color="#fff" width="21px" /></IconButton>
                <Grid spacing={0} container>
                    <Grid item xs={12} sm={9} md={9}>
                        <Typography style={{color: '#fff'}} variant="h1">{subscribed ? 'thank you' : 'Subscribe to INAN newsletter'}</Typography>
                        <br />
                    </Grid>
                    {!subscribed && (
                        <Grid item xs={12} sm={6} md={6}>
                            <NewsletterForm isModal sendFeedback={setSubscribed} />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Dialog>
    )
}

export default Newsletter