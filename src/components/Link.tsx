import { forwardRef } from 'react';
import {Link as MaterialLink, LinkProps as MuiLinkProps} from '@mui/material';
import NextLink from 'next/link';

type LinkProps = { isActive?: boolean, href?: string, isUnderline?: boolean} & Partial<MuiLinkProps>

const LinkBehaviour = forwardRef<HTMLAnchorElement, { href: string }>(function LinkBehaviour(props, ref) {
    return <NextLink ref={ref} {...props} />;
});


const Link = ({isActive, isUnderline, children, ...rest}: LinkProps) => (
    <MaterialLink
        component={LinkBehaviour}
        sx={{
            textDecoration: isActive ? 'line-through' : (isUnderline ? 'underline ': 'none'),
            transition: 'textDecoration .75s ease',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'line-through'
            }
        }}
        href="#"
        {...rest}
    >
        {children}
    </MaterialLink>
)

export default Link;