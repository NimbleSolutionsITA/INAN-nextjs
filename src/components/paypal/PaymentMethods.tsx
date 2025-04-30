import React from "react";
import {
	Accordion, AccordionDetails, AccordionSummary,
	Box, CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	Typography
} from "@mui/material";
import {
	PayPalNameField,
	PayPalMessages,
	PayPalCVVField,
	PayPalExpiryField,
	PayPalNumberField,
	PayPalButtons,
	usePayPalCardFields
} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import ApplePay from "../icons/payments/ApplePay";
import GooglePay from "../icons/payments/GooglePay";
import CreditCard from "../icons/payments/CreditCard";
import PayPal from "../icons/payments/PayPal";
import usePayPalCheckout from "./PayPalCheckoutProvider";
import {Controller, useFormContext} from "react-hook-form";
import Checkbox from "../Checkbox";
import {FormFields} from "./usePayPalFormProvider";
import GooglePayButton from "./GooglePayButton";
import Button from "../Button";
import ApplePayButton from "./ApplePayButton";

const PAYMENT_METHODS = ['paypal', 'applepay', 'googlepay', 'card'];

const PaymentMethods = () => {
	const { applePayConfig, googlePayConfig, items } = useSelector((state: RootState) => state.cart);
	const { control } = useFormContext<FormFields>()
	const {isPaying, updateShippingMethod, totals, countries, createOrder, onError, onApprove} = usePayPalCheckout()
	const availablePaymentMethods = PAYMENT_METHODS.filter(m => {
		if (m === 'applepay' && (!applePayConfig?.isEligible || !window.ApplePaySession)) return false;
		return !(m === 'googlepay' && !googlePayConfig?.isEligible);
	})
	return (
		<Box id="payment-methods" sx={{display: 'flex', flexDirection: 'column', mt: '16px'}}>
			<Controller
				name={"payment_method"}
				control={control}
				render={({ field: { onChange, value }}) => (
					<FormControl disabled={isPaying} component="fieldset" style={{width: '100%', padding: '0 3px', marginBottom: "20px"}}>
						<FormGroup aria-label="position" row>
							<Grid container>
								{availablePaymentMethods.map((method) => (
									<Accordion
										key={method}
										disableGutters
										sx={{
											width: "100%",
											borderBottom: "1px solid black"
										}}
										expanded={method === value}
										elevation={0}
										square
									>
										<AccordionSummary
											expandIcon={getPaymentIcon(method === value, method)}
											sx={{
												padding: 0,
												".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
													transform: "none"
												}
											}}
										>
											<FormControlLabel
												value={method}
												control={
													<Checkbox
														checked={method === value}
														inputProps={{ 'aria-label': 'primary checkbox' }}
														onChange={() => onChange({target: {value: method}})}
														isCrossed
													/>}
												label={{
													applepay: "ApplePay",
													googlepay: "GooglePay",
													card: "Credit Card",
													paypal: "PayPal"
												}[method]}
												labelPlacement="end"
												sx={method === value ? {
													'& .FormControlLabel-label': {
														textDecoration: 'line-through'
													}
												} : undefined}
											/>
										</AccordionSummary>
										<AccordionDetails sx={{padding: "8px 0 16px"}}>
											{method === "card" && method === value && (
												<Grid container>
													<Grid item xs={12}>
														<PayPalNameField placeholder="CARDHOLDER NAME (OPTIONAL)" />
													</Grid>
													<Grid item xs={12}>
														<PayPalNumberField placeholder="CARDNUMBER" />
													</Grid>
													<Grid container spacing={4}>
														<Grid item xs={6}>
															<PayPalExpiryField  />
														</Grid>
														<Grid item xs={6}>
															<PayPalCVVField />
														</Grid>
													</Grid>
													<SubmitPayment />
													<Typography variant="body2" sx={{m: '16px 0', textAlign: 'justify'}}>
														Your credit card information is processed securely by PayPal. INANSTUDIO does not store, process, or have access to your card details in any way. All transactions are handled directly by PayPal, ensuring a secure and encrypted payment experience.
													</Typography>
												</Grid>
											)}
											{method == "paypal" && method === value && (
												<>
													<PayPalButtons
														createOrder={createOrder}
														onApprove={onApprove}
														onCancel={onError}
														onError={onError}
														style={{
															borderRadius: 0,
															disableMaxWidth: true,

															color: "black",
															shape: "rect",
															height: 25
														}}
														message={{
															amount: totals.total,
															align: "center",
															color: "black",
															position: 'top'
														}}
													/>
													<br />
													<PayPalMessages
														amount={totals.total}
														currency="EUR"
														style={{
															layout: "flex",
															color: "black",
															logo: {
																type: "alternative",
																position: "right"
															},
															ratio: "20x1"
														}}
														placement="payment"
													/>
												</>
											)}
											{method == "googlepay" && method === value && (
												<GooglePayButton
													items={items}
													updateShippingMethod={updateShippingMethod}
													countries={countries}
													totals={totals}
												/>
											)}
											{method == "applepay" && method === value && (
												<ApplePayButton
													items={items}
													updateShippingMethod={updateShippingMethod}
													countries={countries}
													totals={totals}
												/>
											)}
										</AccordionDetails>
									</Accordion>
								))}
							</Grid>
						</FormGroup>
					</FormControl>
				)}
			/>
		</Box>
	);
};

const radioButtonProps = {
	sx: {
		height: 'auto',
		width: '50px'
	}
}

const getPaymentIcon = (selected: boolean, method: string) => ({
	applepay: <ApplePay {...radioButtonProps} selected={selected} />,
	googlepay: <GooglePay {...radioButtonProps} selected={selected} />,
	card: <CreditCard {...radioButtonProps} selected={selected} />,
	paypal: <PayPal {...radioButtonProps} selected={selected} />
}[method])

const SubmitPayment = () => {
	const { cardFieldsForm } = usePayPalCardFields();
	const { isPaying, setIsPaying, onError} = usePayPalCheckout();

	const handleClick = async () => {
		if (!cardFieldsForm) {
			const childErrorMessage =
				"Unable to find any child components in the <PayPalCardFieldsProvider />";

			throw new Error(childErrorMessage);
		}
		const formState = await cardFieldsForm.getState();

		if (!formState.isFormValid) {
			return alert("The payment form is invalid");
		}
		setIsPaying(true);

		cardFieldsForm.submit().catch(onError);
	};

	return (
		<Button
			fullWidth
			disabled={isPaying}
			variant="contained"
			color="secondary"
			onClick={handleClick}
			sx={{marginTop: '16px'}}
			startIcon={isPaying && <CircularProgress thickness={5} size={18} />}
		>
			<b>PAY WITH CARD</b>
		</Button>
	);
};

export default PaymentMethods;