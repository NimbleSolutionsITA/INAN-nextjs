import React from "react";

const INAN = ({height = 66, color='#000'}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 44" height={height} fill={color}>
            <g>
                <path d="M9.86-0.32v44.31H0.11V-0.32H9.86z"/>
                <path d="M26.12-0.32L44.61,29.4h0.12V-0.32h9.12v44.31h-9.74L25.68,14.32h-0.12v29.67h-9.12V-0.32H26.12z"/>
                <path d="M83.28-0.32l16.57,44.31H89.73l-3.35-9.87H69.81l-3.48,9.87h-9.81L73.29-0.32H83.28z M83.84,26.86L78.25,10.6h-0.12
				l-5.77,16.26H83.84z"/>
                <path d="M112.18-0.32l18.49,29.73h0.12V-0.32h9.12v44.31h-9.74l-18.43-29.67h-0.12v29.67h-9.12V-0.32H112.18z"/>
            </g>
        </svg>
    )
}

export default INAN;