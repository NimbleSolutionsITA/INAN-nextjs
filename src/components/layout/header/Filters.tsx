import React, {useState} from "react"
import styled from "@emotion/styled"
import {List, ListItem, ListItemText} from "@mui/material";
import { LinkItem} from "../../../../@types";
import Container from "../../Container";
import Link from "../../Link";
import RightDrawer from "../../RightDrawer";
import {useRouter} from "next/router";
import {useIsMobile} from "../../../utils/layout";


type FiltersProps = {
    links: LinkItem[]
    activeLink?: string
}

const NavWrapper = styled.div<{isMobile: boolean}>`
  width: 100%;
  padding: ${({isMobile}) => !isMobile && '3px 0'};
  border-bottom: ${({isMobile}) => !isMobile && '1px solid'};
`;

const FilterMobileWrapper = styled.div<{isMobile: boolean}>`
  color: #000;
  border-top: ${({isMobile}) => isMobile && '1px solid'};
`

const Filters = ({links, activeLink}: FiltersProps) => {
    const isMobile = useIsMobile()
    const router = useRouter()
    const isCollection = router.route.startsWith('/collection')

    const [open, setOpen] = useState(false)

    const FilterLinks = links.map(link =>
            isMobile ? (
                <ListItem
                    key={link.slug}
                    component={Link}
                    disableGutters
                    color="inherit"
                    onClick={() => setOpen(false)}
                    href={link.url}
                >
                    <ListItemText primary={link.name} />
                </ListItem>
            ) : (
                <Link
                    key={link.slug}
                    color="inherit"
                    style={{
                        marginRight: isMobile ? undefined : '20px',
                    }}
                    isActive={activeLink === link.slug}
                    href={link.url}
                >
                    {link.name}
                </Link>
            )
        );

    return (
        <div style={{width: '100%', height: '19px'}}>
            <NavWrapper isMobile={isMobile}>
                {isMobile ? (
                    <FilterMobileWrapper isMobile={isMobile}>
                        <Container>
                            <Link
                                color="inherit"
                                style={{
                                    marginRight: '20px',
                                    padding: '2px 0',
                                    float: 'left',
                                }}
                                href={isCollection ? '/collection' : '/shop'}
                            >
                                {isCollection ? 'COLLECTION' : 'SHOP'}
                            </Link>
                            <Link
                                href="#"
                                color="inherit"
                                style={{
                                    marginLeft: '20px',
                                    padding: '2px 0',
                                    float: 'right',
                                }}
                                onClick={event => {
                                    event.preventDefault()
                                    setOpen(true)
                                }}
                            >
                                {isCollection ? 'PAST COLLECTIONS' : 'FILTER'}
                            </Link>
                        </Container>
                        <RightDrawer open={open} setOpen={setOpen} title={isCollection ? 'PAST COLLECTIONS' : 'FILTER'}>
                            <List style={{
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}>
                                {FilterLinks}
                            </List>
                        </RightDrawer>
                    </FilterMobileWrapper>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex'}}>
                            {FilterLinks}
                        </div>
                    </div>
                )}
            </NavWrapper>
        </div>
    )
}

export default Filters
