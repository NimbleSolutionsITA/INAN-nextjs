
import Link from "../../Link";
import Container from "../../Container";
import styled from "@emotion/styled";
import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";

type CoverContentProps = {
    title?: string
    ctaLink?: string | undefined
    ctaText?: string | undefined
}

const CoverWrapper = styled.div`
  width: 100%;
  position: fixed;
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

const CoverContent = ({title, ctaLink, ctaText}: CoverContentProps) => {
    const { headerColor, headerColorMobile, isMobile } = useSelector((state: RootState) => state.header);
    return (
        <CoverWrapper>
            <Container sx={{color: {xs: headerColorMobile, md: headerColor}}}>
                <TitleWrapper>
                    {title && (
                        <Typography
                            sx={{
                                marginTop: {xs: '10px%', md: '5px'},
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