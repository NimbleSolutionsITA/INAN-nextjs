import React, {ReactNode} from "react";
import {Button as MaterialButton, ButtonProps as MuiButtonProps} from '@mui/material';
import RouterLink from 'next/link';

type ButtonProps = {
    disableGutters?: boolean
    disablePadding?: boolean
    disableHover?: boolean
    inactive?: boolean
    children: ReactNode
    lineThrough?: boolean
    href?: string
} & Partial<MuiButtonProps>

const Button = ({disableGutters, disablePadding, inactive, disableHover, children, lineThrough, ...rest}: ButtonProps) => {
    return (
        <MaterialButton
            sx={{
                borderRadius: 0,
                paddingRight: disableGutters ? 0 : undefined,
                paddingLeft: disableGutters ? 0 : undefined,
                paddingTop: disablePadding ? '2px' : undefined,
                paddingBottom: disablePadding ? '2px' : undefined,
                color: inactive ? '#999' : undefined,
                minWidth: '20px',
                transition: lineThrough ? 'textDecoration .75s ease' : undefined,
                '&:hover': (rest.variant !== 'contained' && rest.variant !== 'outlined') ? {
                    backgroundColor: 'transparent',
                    textDecoration: 'line-through'
                } : undefined
            }}
            component={rest.href ? RouterLink : 'button'}
            disableElevation
            {...rest}
        >
            {children}
        </MaterialButton>
    )
}

export default Button;