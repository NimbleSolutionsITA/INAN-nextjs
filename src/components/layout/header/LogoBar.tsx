import Link from "../../Link";
import styled from "@emotion/styled";
import Logo from "../../Logo";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useIsMobile} from "../../../utils/layout";

const LogoWrapper = styled.div`
  width: 100%;
  height: 43px;
  margin: 20px 0;
  svg {
    transition: fill .25s ease;
  }
`;

const LogoBar = () => {
    const { headerColor, headerColorMobile } = useSelector((state: RootState) => state.header);
    const isMobile = useIsMobile()
    return (
        <LogoWrapper>
            <Link href="/">
                <Logo color={isMobile ? headerColorMobile : headerColor} />
            </Link>
        </LogoWrapper>
    )
}

export default LogoBar;