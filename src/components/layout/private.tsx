import Container from "../Container";
import {TextField} from "@mui/material";
import Dialog from "../Dialog";
import Layout from "./index";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useState} from "react";
import {useRouter} from "next/router";
import {API_SALES_ENDPOINT} from "../../utils/endpoints";
import {setAuth} from "../../redux/authSlice";
import {SalesPageProps} from "../../../pages/private-sales";

type PrivateLayoutProps = SalesPageProps & { children: React.ReactNode }

const pageSettings = {
	bgColor: '#fff',
	headerColor: '#000',
	headerColorMobile: '#000',
	pageTitle: null
}

const PrivateLayout = ({ layoutProps, page, links, news, children }: PrivateLayoutProps) => {
	const {  privateSalesAccess } = useSelector((state: RootState) => state.auth);
	const  { yoast_head, title: {rendered: pageTitle}, content} = page
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	const dispatch = useDispatch();
	const handlePasswordSubmit = async () => {
		try {
			// Make a request to WooCommerce to fetch products with authentication
			const response = await fetch(API_SALES_ENDPOINT, { method: 'POST', body: JSON.stringify({ password }) });
			if (!response.ok) {
				setError('Incorrect password or error fetching products.');
			}
			const { authenticated } = await response.json();
			if (authenticated) {
				dispatch(setAuth({ privateSalesAccess: true }))
			}
		} catch (err) {
			setError('Incorrect password or error fetching products.');
		}
	};
	return (
		<Layout {...layoutProps} yoast={yoast_head} pageSettings={{...pageSettings, pageTitle}} links={links} news={news}>
			<Container headerPadding>
				{privateSalesAccess ? children : (
					<Dialog
						isActive={!privateSalesAccess}
						onCancel={() => router.push('/')}
						onConfirm={handlePasswordSubmit}
						title="Insert password to access private sales"
						message={(
							<TextField
								autoFocus
								label="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								error={!!error}
								helperText={error}
							/>
						)}
					/>
				)}
			</Container>
		</Layout>
	)
}

export default PrivateLayout