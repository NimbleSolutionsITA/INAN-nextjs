import {ReactNode} from "react";
import {Container as MuiContainer, ContainerProps} from "@mui/material";
import {useIsMobile} from "../utils/layout";

type MuiContainerProps = {
    headerPadding?: boolean
    noPaddingBottom?: boolean
    children: ReactNode
} & Partial<ContainerProps>

const Container = (props: MuiContainerProps) => {
    const isMobile = useIsMobile()
    const {headerPadding, children, noPaddingBottom, ...rest} = props
    return (
        <div style={headerPadding ? {
            width: isMobile ? undefined : '100%',
            paddingBottom: noPaddingBottom ? 0 : '40px'
        } : {}}>
            <MuiContainer fixed maxWidth="xl" {...rest}>
                {children}
            </MuiContainer>
        </div>
    )
}

export default Container;