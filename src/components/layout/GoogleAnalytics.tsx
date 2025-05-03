'use client'

import { GoogleTagManager } from '@next/third-parties/google';
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {usePathname, useSearchParams} from "next/navigation";
import CookieDrawer from "./CookieDrawer";
import CookieModal from "./CookieModal";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;
export const COOKIE_CONSENT_NAME = process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME as string;

export type Consent = {
	adConsentGranted: boolean,
	functionalityConsentGranted: boolean,
	securityConsentGranted: boolean,
} & OptionalConsent

export type OptionalConsent = {
	adUserDataConsentGranted: boolean,
	adPersonalizationConsentGranted: boolean,
	analyticsConsentGranted: boolean,
	personalizationConsentGranted:boolean,
}

export default function GoogleAnalytics() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [consentListeners, setConsentListeners] = useState<any[]>([]);
	const cookieModalOpen = useSelector<RootState>(state => state.auth.cookieModalOpen) as boolean;

	const onConsentChange = (consent: OptionalConsent) => {
		const newConsent = {
			...consent,
			adConsentGranted: true,
			functionalityConsentGranted: true,
			securityConsentGranted: true,
		}
		consentListeners.forEach((callback: (consent: Consent) => void) => {
			callback(newConsent);
		});
		Cookies.set(COOKIE_CONSENT_NAME, JSON.stringify(consent), { path: '/', sameSite: 'Lax' });
		setDrawerOpen(false);
	};

	useEffect(() => {
		window.addConsentListener = (callback: any) => {
			setConsentListeners([...consentListeners, callback]);
		};
		if (!Cookies.get(COOKIE_CONSENT_NAME)) {
			setDrawerOpen(true)
		}
	}, []);

	useEffect(() => {
		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('config', TAG_MANAGER_ID, {
				page_path: pathname + searchParams.toString(),
			});
		}
	}, [pathname, searchParams]);

	if (!TAG_MANAGER_ID) return null;

	return (
		<>
			<GoogleTagManager gtmId={TAG_MANAGER_ID} />
			<CookieDrawer open={drawerOpen} onConsentChange={onConsentChange} />
			{cookieModalOpen && <CookieModal onConsentChange={onConsentChange}/>}
		</>
	);
}