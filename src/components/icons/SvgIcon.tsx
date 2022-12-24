import React from "react";
import * as SvgIconsComponent from './index'

type SvgIconProps = { name: string } & React.SVGProps<SVGSVGElement>

const SvgIcon = ({ name, ...rest}: SvgIconProps) => {
    const component = name.charAt(0).toUpperCase() + name.slice(1)
    if (component in SvgIconsComponent) {
        // @ts-ignore
        const IconComponent = SvgIconsComponent[component]
        return <IconComponent {...rest} />
    }
    return null
}

export default SvgIcon