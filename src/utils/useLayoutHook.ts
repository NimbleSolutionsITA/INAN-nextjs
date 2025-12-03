import {Router, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setHeader} from "../redux/headerSlice";
import {initCart} from "../redux/cartSlice";
import {initWishlist} from "../redux/wishlistSlice";
import {LinkItem, PageSettings} from "../../@types";
import {useIsMobile} from "./layout";

const useLayoutHook = (pageSettings: PageSettings, links?: LinkItem[], hasNews: boolean = false) => {
	const router = useRouter()
	const dispatch = useDispatch()
	const isMobile = useIsMobile()
	useEffect( () => {
		let settings;
		if (router.pathname === '/')
			settings = {
				pageTitle: pageSettings.pageTitle
			}
		else
			settings = pageSettings
		dispatch(setHeader(settings))
	}, [router.pathname] );

	useEffect(() => {
		if (isMobile)
			console.log(((pageSettings.pageTitle || links) ? 94 : 74) + (hasNews ? 25 : 0))
			dispatch(setHeader({ heightMobile: ((pageSettings.pageTitle || links) ? 94 : 74) + (hasNews ? 25 : 0) }))
	}, [isMobile]);

	useEffect(() => {
		Router.events.on('routeChangeStart', () => dispatch(setHeader({loading: true})));
		Router.events.on('routeChangeComplete', () => dispatch(setHeader({loading: false})));
		Router.events.on('routeChangeError', () => dispatch(setHeader({loading: false})));
		return () => {
			Router.events.off('routeChangeStart', () => dispatch(setHeader({loading: true})));
			Router.events.off('routeChangeComplete', () => dispatch(setHeader({loading: false})));
			Router.events.off('routeChangeError', () => dispatch(setHeader({loading: false})));
		};
	}, [Router.events]);

	useEffect( () => {
		if ( typeof window !== "undefined" ) {
			dispatch(initCart())
			dispatch(initWishlist())
		}
	}, [] );
}

export default useLayoutHook