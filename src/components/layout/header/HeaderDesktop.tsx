import styled from "@emotion/styled";
import Container from "../../Container";
import NewsFeed from "./NewsFeed";
import {BasePageProps, LinkItem} from "../../../../@types";
import PageTitle from "./PageTitle";
import Filters from "./Filters";
import LogoBar from "./LogoBar";
import NavBar from "./NavBar";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type HeaderDesktopProps = {
    links: LinkItem[] | undefined
    news: BasePageProps['news']
    headerMenuItems: BasePageProps['layoutProps']['header']['headerMenuItems']
    activeLink?: string
    pageTitle: string | null
}

const HeaderWrapper = styled.div<{color: string, bgColor: string}>`
  position: fixed;
  width: 100%;
  color: ${({color}) => color};
  z-index: 2;
  transition: fill .25s ease;
  background-color: ${({bgColor}) => bgColor};
`;

const HeaderDesktop = ({ links, news, headerMenuItems, activeLink, pageTitle }: HeaderDesktopProps) => {
    const { headerColor, sizeGuideOpen, open, bgColor, height } = useSelector((state: RootState) => state.header);
    console.log('HeaderDesktop', bgColor)
    return (
        <div style={{height, width: '100%'}}>
            <HeaderWrapper color={headerColor} bgColor={bgColor}>
                <Container>
                    <NewsFeed  currentNews={news}/>
                    <LogoBar />
                    {!sizeGuideOpen && (
                        <>
                            <NavBar headerMenuItems={headerMenuItems} />
                            {links && <Filters activeLink={activeLink} links={links} />}
                            {!open && <PageTitle pageTitle={pageTitle} />}
                        </>
                    )}
                </Container>
            </HeaderWrapper>
        </div>
    )
}

export default HeaderDesktop