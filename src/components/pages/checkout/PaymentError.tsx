import {Dispatch, SetStateAction} from "react";
import {Typography, Grid} from "@mui/material";
import Button from "../../../components/Button";

type PaymentErrorProps = {
    setPaypalError: Dispatch<SetStateAction<string | false>>
}

const PaymentError = ({setPaypalError}: PaymentErrorProps) => {
    const handleClick = () => setPaypalError(false)
    return (
        <div style={{marginTop: '30px'}}>
            <Typography variant="h2" style={{color: 'red', padding: 0}}>Something went wrong</Typography>
            <Typography variant="h2">try again to proceed with your order</Typography>
            <br />
            <Grid container>
                <Grid item xs={6}>
                    <Button fullWidth color="secondary" variant="contained" onClick={handleClick}>Proceed to payment</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default PaymentError