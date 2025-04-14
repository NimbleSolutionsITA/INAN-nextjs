'use client'

import { GoogleTagManager } from '@next/third-parties/google';
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {usePathname, useSearchParams} from "next/navigation";
import {getConsent, getLocalStorage, setLocalStorage} from "../../utils/helpers";
import CookieDrawer from "./CookieDrawer";
import CookieModal from "./CookieModal";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

const DEFAULT_SETTINGS = {
	analytics: false,
	profiling: false,
	usage: false,
	storage: false
};

export default function GoogleAnalytics() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const setDrawerOpenWithCookie = (open: boolean) => {
		setDrawerOpen(open)
		if (!open) {
			Cookies.set('is_cookies_seen', 'true');
		}
	}

	useEffect(() => {
		const savedCookieSettings = getLocalStorage("cookie_consent", undefined);
		if (!savedCookieSettings) {
			setLocalStorage('cookie_consent', DEFAULT_SETTINGS);
		}
		const cookieSettings = savedCookieSettings ?? DEFAULT_SETTINGS;

		// Delay GTM initialization by 10 seconds
		const timer = setTimeout(() => {
			window.gtag?.("consent", 'update', {
				ad_user_data: getConsent(cookieSettings.usage),
				ad_personalization: getConsent(cookieSettings.profiling),
				ad_storage: getConsent(cookieSettings.storage),
				analytics_storage: getConsent(cookieSettings.analytics),
			});
		}, 1000);

		const cookiesSeen = Cookies.get('is_cookies_seen');
		if (!cookiesSeen) {
			setDrawerOpen(true)
		}

		// Cleanup function to prevent memory leaks
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const url = pathname + searchParams.toString();

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('config', TAG_MANAGER_ID, {
				page_path: url,
			});
		}
	}, [pathname, searchParams]);

	if (!TAG_MANAGER_ID) return null;

	return (
		<>
			<GoogleTagManager gtmId={TAG_MANAGER_ID} />
			<CookieDrawer open={drawerOpen} setOpen={setDrawerOpenWithCookie} setDialogOpen={setDialogOpen} />
			<CookieModal open={dialogOpen} setOpen={setDialogOpen} />
		</>
	);
}