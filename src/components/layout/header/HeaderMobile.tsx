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
    pageTitle: string | null
}

const HeaderMobile = ({  headerMenuItems, links, news, activeLink, pageTitle }: HeaderMobileProps) => {
    const { open, sizeGuideOpen, height } = useSelector((state: RootState) => state.header);
    return (
        <AppBar
            navLinks={headerMenuItems}
            height={height}
        >
            {!open && !sizeGuideOpen && (
                <>
                    <NewsFeed currentNews={news} />
                    {links && activeLink && <Filters activeLink={activeLink} links={links}/>}
                    <PageTitle pageTitle={pageTitle}/>
                </>
            )}
        </AppBar>
    )

}

export default HeaderMobile