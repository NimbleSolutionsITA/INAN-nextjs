import {HcmsResponse} from "../../../../@types/wordpress";
import Link from "next/link";
import styled from "@emotion/styled";
import Container from "../../Container";
import {Grid, List, ListItem, ListItemText, Typography} from "@mui/material";
import InAnLogo from "../../icons/InAnLogo";
import Newsletter from "./Newsletter";
import NewsletterForm from "./NewsletterForm";
import {useIsMobile} from "../../../utils/layout";

type FooterProps = HcmsResponse['data']['footer']

const NavWrapper = styled.div`
  width: 100%;
  height: 18px;
  border-top: 1pt solid;
  border-bottom: 1pt solid;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  padding: 1px 0;
`;

const FooterWrapper = styled.div<{isMobile: boolean}>`
  background-color: ${({isMobile}) => isMobile ? '#000' : '#fff'};
  color: ${({isMobile}) => isMobile ? '#fff' : '#000'};
  width: 100%;
  text-transform: uppercase;
  padding: 40px 0 60px;
`

const Footer = ({ footerMenuItems }: FooterProps) => {
    const isMobile = useIsMobile()
    return(
        <>
            <Newsletter />
            <FooterWrapper isMobile={isMobile}>
                <Container>
                    {isMobile ? (
                        <>
                            <List>
                                {Array.isArray(footerMenuItems) && footerMenuItems.map((link) => (
                                    <ListItem component={Link} href={link.url} disableGutters button key={link.ID}>
                                        <ListItemText primary={link.title} />
                                    </ListItem>
                                ))}
                            </List>
                            <div style={{marginTop: '30px', paddingBottom: '5px', marginBottom: '5px', borderBottom: '1px solid #fff', display: 'flex', justifyContent: 'space-between'}}>
                                <Typography variant="body1" component="p">NEWSLETTER</Typography>
                                <Link href={process.env.NEXT_PUBLIC_INSTAGRAM || ''} target="_blank" rel="noopener noreferrer">
                                    Instagram
                                </Link>
                            </div>
                            <NewsletterForm />
                            <div style={{position: 'relative'}}>
                                <div>© {new Date().getFullYear()} INAN. All Rights Reserved</div>
                                <div style={{marginTop: "16px", display: 'flex'}}>
                                    Made with
                                    <svg style={{transform: 'scale(0.5) translate(0px, -9px)'}} width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill='#9a9a9a' stroke='#9a9a9a'>
                                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
                                    </svg>
                                    by <a style={{textDecoration: 'none', paddingLeft: '5px'}} href="http://www.nimble-lab.com" target="_blank" rel="noopener noreferrer">Nimble Lab</a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Grid container>
                            <Grid item md={4} lg={6} style={{position: 'relative'}}>
                                <div style={{position: 'absolute', bottom: '10px', left: '0'}}>
                                    <InAnLogo color="#000" height="50px" />
                                </div>
                            </Grid>
                            <Grid item md={8} lg={6}>
                                <NewsletterForm />
                                <NavWrapper>
                                    {Array.isArray(footerMenuItems) && footerMenuItems.map((link) => (
                                        <Link
                                            key={link.ID}
                                            color="inherit"
                                            href={link.url}
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                </NavWrapper>
                                <div style={{position: 'relative', padding: '3px 0'}}>
                                    <div>© {new Date().getFullYear()} INAN. All Rights Reserved</div>
                                    <div style={{display: 'flex', paddingTop: '4px'}}>
                                        Made with
                                        <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='#9a9a9a' stroke='#9a9a9a' style={{margin: "0 4px"}}>
                                            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
                                        </svg>
                                        by <a style={{textDecoration: 'none', marginLeft: '4px'}} href="http://www.nimble-lab.com" target="_blank" rel="noopener noreferrer">Nimble Lab</a>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </FooterWrapper>
        </>
    )
}

export default Footer