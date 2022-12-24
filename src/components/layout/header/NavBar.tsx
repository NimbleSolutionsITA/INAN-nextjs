import styled from "@emotion/styled";
import {useRouter} from "next/router";
import {Divider} from "@mui/material";
import Link from "../../Link";
import {BasePageProps} from "../../../../@types";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type NavBarProps = {
    headerMenuItems: BasePageProps['layoutProps']['header']['headerMenuItems']
}

const NavWrapper = styled.div`
  width: 100%;
  height: 20px;
  line-height: 18px;
  border-top: 1pt solid;
  border-bottom: 1pt solid;
`;

const NavTools = styled.div`
  float: right;
  & span {
    padding-left: 20px;
  }
`;

const Blink = styled.span`
  animation:blinkingText .75s;
  @keyframes blinkingText{
    0%{ color: transparent; }
    33%{ color: #000; }
    66%{ color: transparent; }
    100%{ color: #000; }
}
`;

const NavBar = ({headerMenuItems}: NavBarProps) => {
    const {
        cart: { items: cart }, wishlist: { items: wishlist }, auth: { authenticated }
    } = useSelector((state: RootState) => state);
    const router = useRouter()
    const cartItems = cart?.length
    const wishlistItems = wishlist?.length
    return (
        <>
            {router.pathname === '/checkout' ? <Divider /> :
                <NavWrapper>
                    {Array.isArray(headerMenuItems) && headerMenuItems.map(link => (
                        <Link
                            key={link.ID}
                            color="inherit"
                            style={{marginRight: '20px'}}
                            href={link.url}
                            isActive={router.pathname.startsWith(link.url)}
                        >
                            {link.title}
                        </Link>
                    ))}
                    <NavTools>
                        <Link
                            color="inherit"
                            style={{marginRight: '20px'}}
                            href={authenticated ? '/account' : '/login'}
                            isActive={router.pathname.startsWith('/account')}
                        >
                            {authenticated ? 'ACCOUNT' : 'LOGIN'}
                        </Link>

                        <Link
                            color="inherit"
                            style={{marginRight: '20px'}}
                            href="/wishlist"
                            isActive={router.pathname === '/wishlist'}
                        >
                            <Blink key={wishlistItems}>WISHLIST ({wishlistItems && `${wishlistItems}`})</Blink>
                        </Link>
                        <Link
                            color="inherit"
                            href="/bag"
                            isActive={router.pathname === '/bag'}
                        >
                            <Blink key={cartItems}>BAG ({cartItems && `${cartItems}`})</Blink>
                        </Link>
                    </NavTools>
                </NavWrapper>
            }
        </>
    )
}

export default NavBar;