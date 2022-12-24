const CloseIcon = ({color = '#000', ...props}) => {
    const style = {
        fill: 'none',
        stroke: color,
        strokeMiterlimit: 10
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.71 20.71" {...props}>
            <g>
                <line style={style} x1="0.35" y1="0.35" x2="20.35" y2="20.35"/>
                <line style={style} x1="20.35" y1="0.35" x2="0.35" y2="20.35"/>
            </g>
        </svg>
    )
}

export default CloseIcon;