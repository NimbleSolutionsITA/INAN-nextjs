import {Divider, Grid, Typography} from "@mui/material";
import Button from "../../Button";
import LoginForm from "../login/LoginForm";
import {useIsMobile} from "../../../utils/layout";

const AccessCheckout = ({setIsGuest}: {setIsGuest: (isGuest: boolean) => void}) => {
	const isMobile = useIsMobile()
	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={4} style={{display: 'flex', flexDirection: 'column'}}>
				{isMobile  && <br/>}
				{isMobile  && <br/>}
				{isMobile  && <br/>}
				<Typography variant="h2">CONTINUE AS GUEST</Typography>
				{!isMobile && (
					<>
						<Divider />
						<br />
					</>
				)}
				<Typography>CONTINUE WITHOUT REGISTRATION.</Typography>
				<div style={{flexGrow: 1}}/>
				<br />
				<Button fullWidth variant="contained" color="secondary" onClick={() => setIsGuest(true)}>continue as guest</Button>
			</Grid>
			<Grid item xs={12} md={4}>
				{isMobile  && <br/>}
				{isMobile  && <br/>}
				<Typography variant="h2">LOGIN</Typography>
				{!isMobile  && <Divider/>}
				<LoginForm />
			</Grid>
			<Grid item xs={12} md={4} style={{display: 'flex', flexDirection: 'column'}}>
				{isMobile  && <br/>}
				{isMobile  && <br/>}
				<Typography variant="h2">REGISTER</Typography>
				{!isMobile  && <Divider/>}
				<br />
				<Typography>REGISTER TO COMPLETE CHECKOUT MORE QUICKLY, REVIEW ORDER INFORMATION and much more.</Typography>
				<div style={{flexGrow: 1, minHeight: '10px'}}/>
				<Button fullWidth variant="contained" color="secondary" href="/register?origin=checkout">register</Button>
			</Grid>
		</Grid>
	)
}

export default AccessCheckout