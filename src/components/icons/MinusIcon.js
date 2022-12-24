
import React from "react";

const MinusIcon = ({color = '#000', ...props}) => {
    const style = {
        fill: 'none',
        stroke: color,
        strokeMiterlimit: 10,
        strokeWidth: '0.5px'
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.5 10.5" {...props}>
            <line style={style} x1="7.75" y1="5.25" x2="2.75" y2="5.25"/>
            <circle style={style} cx="5.25" cy="5.25" r="5"/>
        </svg>
    )
}

export default MinusIcon;