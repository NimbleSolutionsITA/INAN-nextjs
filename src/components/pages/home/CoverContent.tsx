
import Link from "../../Link";
import Container from "../../Container";
import styled from "@emotion/styled";
import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useIsMobile} from "../../../utils/layout";

type CoverContentProps = {
    title?: string
    ctaLink?: string | undefined
    ctaText?: string | undefined
    color: string | undefined
    colorMobile: string | undefined
}

const CoverWrapper = styled.div<{isMobile: boolean}>`
  width: 100%;
  position: ${({isMobile}) => isMobile ? 'relative' : 'fixed'};
  top: 0;  
  z-index: 1;
  overflow: hidden;
  -ms-overflow: hidden;
`;

const TitleWrapper = styled.div`
  width: 100%;
`;

const Cta = styled.div`
  width: 100%;
  border-bottom: 1px solid;
  text-align: right;
  margin-top: -30px;
  text-transform: uppercase;
  a {
    line-height: 18px;
  }
`;

const CoverContent = ({title, ctaLink, ctaText, color, colorMobile}: CoverContentProps) => {
    const { headerColor, headerColorMobile } = useSelector((state: RootState) => state.header);
    const isMobile = useIsMobile()
    return (
        <CoverWrapper isMobile={isMobile}>
            <Container sx={{color: {xs: colorMobile ?? headerColorMobile, md: color ?? headerColor}}}>
                <TitleWrapper>
                    {title && (
                        <Typography
                            sx={{
                                marginTop: {xs: '10px', md: '103px'},
                                textTransform: 'uppercase',
                                minHeight: '75px',
                                width: {xs: '100%', md: 'calc(100% - 80px)'},
                                lineHeight: '45px',
                                '& a:hover': {
                                    textDecoration: 'none',
                                }
                            }}
                            variant="h1"
                            component="h1"
                        >
                            <Link underline="none" color="inherit" href={ctaLink}>{title}</Link>
                        </Typography>
                    )}
                    {ctaLink && !isMobile && (
                        <Cta>
                            <Link underline="none" color="inherit" href={ctaLink}>{ctaText}</Link>
                        </Cta>
                    )}
                </TitleWrapper>
            </Container>
        </CoverWrapper>
    )
}

export default CoverContent;