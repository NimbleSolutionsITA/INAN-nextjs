import {Box, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps} from "@mui/material";
import {DisabledByDefault, Square} from "@mui/icons-material";

type CheckboxProps = Partial<Omit<MuiCheckboxProps, 'color'>> & {
    color?: string
    isCrossed?: boolean
}

function lightenDarkenColor(col: string, amt: number) {
    let usePound;
    let color;

    if (col[0] === "#") {
        color = col.slice(1);
        usePound = true;
    }
    else {
        usePound = false
        color = col
    }

    const num = parseInt(color,16);

    const r = (num >> 16) + amt;
    let rr = 0

    if (r > 255) rr = 255;
    else if  (r < 0) rr = 0;

    const b = ((num >> 8) & 0x00FF) + amt;
    let bb = 0

    if (b > 255) bb = 255;
    else if  (b < 0) bb = 0;

    const g = (num & 0x0000FF) + amt;
    let gg = 0

    if (g > 255) gg = 255;
    else if (g < 0) gg = 0;

    return (usePound?"#":"") + (gg | (bb << 8) | (rr << 16)).toString(16);

}


const crossedCheckbox = {
    '& .MuiCheckbox-root .MuiBox-root:before': {
        background: `url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\' viewBox=\'0 0 100 100\'><path d=\'M100 0 L0 100 \' stroke=\'black\' stroke-width=\'10\'/><path d=\'M0 0 L100 100 \' stroke=\'black\' stroke-width=\'10\'/></svg>")`,
        display: 'block',
        width: 10,
        height: 10,
        margin: '3px',
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#232323',
    },
}

const defaultCheckbox = {
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        'input ~ &': {
        backgroundColor: '#000',
    },
    '& .MuiCheckbox-root .MuiBox-root:before': {
        display: 'block',
            width: 16,
            height: 16,
            content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#232323',
    },
}

const CheckboxIcon = ({
    color,
    isChecked,
    isCrossed
}: {
    color?: string,
    isChecked?: boolean,
    isCrossed?: boolean
}) => {
    return (
        <Box
            component="span"
            sx={{
                borderRadius: 0,
                width: 16,
                height: 16,
                boxShadow: `inset 0 0 0 2px #000, inset 0 -2px 0 #000}`,
                backgroundColor: color ?? '#ebf1f5',
                'input:disabled ~ &': {
                    boxShadow: 'none',
                    background: 'rgba(206,217,224,.5)',
                },
                ...(!isChecked ? {
                    'input:hover ~ &': {
                        backgroundColor: color ? lightenDarkenColor(color, -10) : '#ebf1f5',
                    },
                } : {}),
                ...(isChecked ? (isCrossed ? crossedCheckbox : defaultCheckbox) : {})
            }}
        />
    )
}

const Checkbox = ({color, isCrossed, ...rest}: CheckboxProps) => (
    <MuiCheckbox
        icon={<Square
            sx={{
                border: "2px solid black",
                borderRadius: 0,
                width: 16,
                height: 16,
                color: (color && color !== "") ? color : "#ebf1f5",
                fill: color ?? "#ebf1f5",
                background: color ?? "#ebf1f5"
            }} />}
        checkedIcon={<DisabledByDefault
            sx={{
                borderRadius: 0,
                width: 16,
                height: 16,
                color: "#ebf1f5",
                backgroundColor: "#000000"
            }}
        />}
        {...rest}
    />
)

export default Checkbox