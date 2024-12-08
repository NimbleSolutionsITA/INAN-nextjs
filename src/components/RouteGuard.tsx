import {useCallback, useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/router';
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../redux/store";
import {checkLoginUser} from "../utils/auth";
import {setAuth} from "../redux/authSlice";
import {setCustomer} from "../redux/customerSlice";

export { RouteGuard };

class RouteGuardProps {
    children!: JSX.Element
}

function RouteGuard({ children }: RouteGuardProps) {
    const authenticated = useSelector((state: RootState) => state.auth.authenticated);
    const router = useRouter();
    const privateRoute = router.pathname.startsWith('/account')
    const authData = useRef({privateRoute, authenticated})
    const [authorized, setAuthorized] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        authData.current = {privateRoute, authenticated}
    }, [privateRoute, authenticated]);

    useEffect(() => {
        const authenticate = async (): Promise<void> => {
            const customer = await checkLoginUser()
            if (customer) {
                dispatch(setCustomer(customer))
                dispatch(setAuth({
                    authenticated: !!customer, authenticating: false, user: customer ? {
                        id: customer.id,
                        email: customer.email,
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        username: customer.username,
                    } : undefined
                }))
                return
            }
        }
        dispatch(setAuth({authenticated: false, authenticating: true}))
        authenticate().then(r => r)
        // on initial load - run auth check
        authCheck()
        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);
        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)
        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, []);

    const authCheck = async () =>  {
        if (authData.current.privateRoute && !authData.current.authenticated) {
            setAuthorized(false);
            await router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        }
        else {
            setAuthorized(true);
        }
    }

    return authorized ? children : <span />;
}