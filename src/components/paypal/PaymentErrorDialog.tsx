import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Button} from "@mui/material";


const PaymentErrorDialog = ({ error, setError}: {error?: string, setError: (error:string|undefined) => void}) => {
	return (
		<Dialog
			open={!!error}
			onClose={() => setError(undefined)}
			aria-labelledby="stripe-payment-error"
		>
			<DialogTitle id="alert-dialog-title">
				{"Payment error"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{error}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => {
					setError(undefined);
				}}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default PaymentErrorDialog