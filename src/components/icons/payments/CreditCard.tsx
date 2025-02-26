import {SvgIcon} from "@mui/material";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import React from "react";

export default function CreditCard(props: SvgIconProps & {selected: boolean}) {
	return (
		<SvgIcon viewBox="0 0 38 38" aria-labelledby="paypal" {...props}>
			<title>card-default-fill</title>
			<rect fill={props.selected ? "#000" : "#eee"} strokeWidth={props.selected ? 'none' : "#000"} y="7" width="38" height="24" rx="5"/>
			<rect fill={props.selected ? "#fff" : "#000"} x="5" y="13" width="28" height="3"/>
			<rect fill={props.selected ? "#fff" : "#000"} x="25" y="22" width="8" height="3"/>
		</SvgIcon>
	);
}