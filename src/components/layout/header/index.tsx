import HeaderMobile from "./HeaderMobile";
import {HomeProps} from "../../../../pages";
import HeaderDesktop from "./HeaderDesktop";
import {LinkItem} from "../../../../@types";
import {useIsMobile} from "../../../utils/layout";

type HeaderProps = {
    headerMenuItems: HomeProps['layoutProps']['header']['headerMenuItems'],
    links: LinkItem[] | undefined
    news: HomeProps['news']
    activeLink?: string
    pageTitle: string | null
}

const Header = ({ headerMenuItems, links, news, activeLink, pageTitle }: HeaderProps) => {
    const isMobile = useIsMobile()

    return isMobile ? (
        <HeaderMobile headerMenuItems={headerMenuItems} activeLink={activeLink} links={links} news={news} pageTitle={pageTitle}/>
    ) : (
        <HeaderDesktop headerMenuItems={headerMenuItems} activeLink={activeLink} links={links} news={news} pageTitle={pageTitle}/>
    )
}

export default Header;