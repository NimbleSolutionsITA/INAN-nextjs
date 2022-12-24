import {forwardRef} from "react";
import AppBar from "./AppBar";
import NewsFeed from "./NewsFeed";
import {BasePageProps, LinkItem} from "../../../../@types";
import Filters from "./Filters";
import PageTitle from "./PageTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type HeaderMobileProps = {
    headerMenuItems: BasePageProps['layoutProps']['header']['headerMenuItems']
    links: LinkItem[] | undefined
    news: BasePageProps['news']
    activeLink?: string
}

const HeaderMobile = forwardRef<HTMLDivElement, HeaderMobileProps>(({  headerMenuItems, links, news, activeLink }, headerEl) => {
    const { open, sizeGuideOpen } = useSelector((state: RootState) => state.header);
    return (
        <AppBar
            ref={headerEl}
            navLinks={headerMenuItems}
        >
            {!open && !sizeGuideOpen && (
                <>
                    <NewsFeed currentNews={news} />
                    {links && activeLink && <Filters activeLink={activeLink} links={links}/>}
                    <PageTitle />
                </>
            )}
        </AppBar>
    )

})

export default HeaderMobile