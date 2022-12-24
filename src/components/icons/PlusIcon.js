
import React from "react";

const PlusIcon = ({color = '#000', ...props}) => {
    const style = {
        fill: 'none',
        stroke: color,
        strokeMiterlimit: 10,
        strokeWidth: '0.5px'
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.5 10.5" {...props}>
            <g>
                <line style={style} x1="7.75" y1="5.25" x2="2.75" y2="5.25"/>
                <line style={style} x1="5.25" y1="7.75" x2="5.25" y2="2.75"/>
            </g>
            <circle style={style} cx="5.25" cy="5.25" r="5"/>
        </svg>
    )
}

export default PlusIcon;