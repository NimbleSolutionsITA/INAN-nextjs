import { useState } from "react";
import INAN from "./icons/INAN";
import INxxAN from "./icons/INxxAN";

const Logo = ({height = 43, color = "#000"}) => {
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
        >
            {isHover ? <INxxAN height={height} color={color} /> : <INAN height={height} color={color} />}
        </div>
    )
}

export default Logo