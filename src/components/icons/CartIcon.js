import React from "react";

const CartIcon = ({color, items, ...props}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.7 18.42" {...props}>
            <g>
                <text style={{fontSize: '11px', textAlign: 'center', fontFamily: 'HelveticaNeue, Helvetica Neue', fill: color}} transform={items > 9 ? 'translate(2.5 14.76)' : 'translate(5.3 14.76)'}>{items}</text>
                <rect strokeMiterlimit={10} stroke={color} fill="none" className="cls-1" x="0.5" y="3.92" width="15.7" height="14"/>
                <path strokeMiterlimit={10} stroke={color} fill="none" className="cls-1" d="M4.93,3.93a3.43,3.43,0,1,1,6.85,0"/>
            </g>
        </svg>
    )
}

export default CartIcon;