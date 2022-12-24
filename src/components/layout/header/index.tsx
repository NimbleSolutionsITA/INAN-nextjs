import {forwardRef } from "react";
import HeaderMobile from "./HeaderMobile";
import {HomeProps} from "../../../../pages";
import HeaderDesktop from "./HeaderDesktop";
import {LinkItem} from "../../../../@types";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type HeaderProps = {
    headerMenuItems: HomeProps['layoutProps']['header']['headerMenuItems'],
    links: LinkItem[] | undefined
    news: HomeProps['news']
    activeLink?: string
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ headerMenuItems, links, news, activeLink }, headerEl) => {
    const { isMobile } =  useSelector((state: RootState) => state.header);

    return isMobile ? (
        <HeaderMobile ref={headerEl} headerMenuItems={headerMenuItems} activeLink={activeLink} links={links} news={news}/>
    ) : (
        <HeaderDesktop ref={headerEl} headerMenuItems={headerMenuItems} activeLink={activeLink} links={links} news={news}/>
    )
})

export default Header;