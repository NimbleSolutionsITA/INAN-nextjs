import { useEffect } from "react";
import Container from "../Container";
import { TextField } from "@mui/material";
import Dialog from "../Dialog";
import Layout from "./index";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { useRouter } from "next/router";
import { API_SALES_ENDPOINT } from "../../utils/endpoints";
import { setAuth } from "../../redux/authSlice";
import { SalesPageProps } from "../../../pages/private-sales";
import Loading from "../Loading";

type PrivateLayoutProps = SalesPageProps & { children: React.ReactNode };

const pageSettings = {
	bgColor: "#fff",
	headerColor: "#000",
	headerColorMobile: "#000",
	pageTitle: null,
};

export const AUTH_PASSWORD_KEY = "privateSales";

const PrivateLayout = ({
	                       layoutProps,
	                       page,
	                       links,
	                       news,
	                       children,
                       }: PrivateLayoutProps) => {
	const { privateSalesAccess } = useSelector((state: RootState) => state.auth);
	const { yoast_head, title: { rendered: pageTitle }, content } = page;
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loginChecked, setLoginChecked] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		const handleAutoLogin = async () => {
			try {
				const storedPassword = localStorage.getItem(AUTH_PASSWORD_KEY);
				if (!storedPassword) {
					setLoginChecked(true);
					return;
				}
				const response = await fetch(API_SALES_ENDPOINT, {
					method: "POST",
					body: JSON.stringify({ password: storedPassword }),
				});
				if (!response.ok) {
					throw new Error("Authentication failed.");
				}
				const { authenticated } = await response.json();
				if (authenticated) {
					dispatch(setAuth({ privateSalesAccess: true }));
				} else {
					localStorage.removeItem(AUTH_PASSWORD_KEY); // Clear invalid password
				}
			} catch {
				localStorage.removeItem(AUTH_PASSWORD_KEY); // Clear invalid password
			} finally {
				setLoginChecked(true);
			}
		};
		handleAutoLogin();
	}, [])

	const handlePasswordSubmit = async () => {
		try {
			const response = await fetch(API_SALES_ENDPOINT, {
				method: "POST",
				body: JSON.stringify({ password }),
			});
			if (!response.ok) {
				setError("Incorrect password or error fetching products.");
				return;
			}
			const { authenticated } = await response.json();
			if (authenticated) {
				dispatch(setAuth({ privateSalesAccess: true }));
				localStorage.setItem(AUTH_PASSWORD_KEY, password); // Save password locally
			} else {
				setError("Authentication failed.");
			}
		} catch (err) {
			setError("Incorrect password or error fetching products.");
		}
	};

	return (
		<Layout
			{...layoutProps}
			yoast={yoast_head}
			pageSettings={{ ...pageSettings, pageTitle }}
			links={links}
			news={news}
		>
			<Container headerPadding>
				{loginChecked ? (
					privateSalesAccess ? children : (
						<Dialog
							isActive={!privateSalesAccess}
							onCancel={() => router.push("/")}
							onConfirm={handlePasswordSubmit}
							title="Insert password to access private sales"
							message={
								<TextField
									autoFocus
									label="Password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									error={!!error}
									helperText={error}
								/>
							}
						/>
					)) : <Loading />
				}
			</Container>
		</Layout>
	);
};

export default PrivateLayout;
