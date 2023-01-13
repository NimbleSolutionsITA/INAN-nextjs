import {Box, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps} from "@mui/material";

type CheckboxProps = Partial<Omit<MuiCheckboxProps, 'color'>> & {
    color?: string
    isCrossed?: boolean
}

function isDark(color: string) {
    if (color === 'black')
        return true
    if (color === 'white')
        return false
    const c = color.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 40;
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


const crossedCheckbox = (onBlack: boolean | undefined) => ({
    '&:before': {
        background: `url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' preserveAspectRatio=\'none\' viewBox=\'0 0 100 100\'><path d=\'M100 0 L0 100 \' stroke=\'${onBlack ? 'white' : 'black'}\' stroke-width=\'10\'/><path d=\'M0 0 L100 100 \' stroke=\'${onBlack ? 'white' : 'black'}\' stroke-width=\'10\'/></svg>")`,
        display: 'block',
        width: 10,
        height: 10,
        margin: '3px',
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: onBlack ? '#ccc' : '#232323',
    },
})

const defaultCheckbox = (onBlack: boolean | undefined) => ({
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        'input ~ &': {
        backgroundColor: onBlack ? '#fff' : '#000',
    },
    '&:before': {
        display: 'block',
            width: 16,
            height: 16,
            content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: onBlack ? '#ccc' : '#232323',
    },
})

const CheckboxIcon = ({
    color,
    isChecked,
    isCrossed
}: {
    color?: string,
    isChecked?: boolean,
    isCrossed?: boolean
}) => {
    const onBlack = !!color && !isDark(color)
    return (
        <Box
            component="span"
            sx={{
                borderRadius: 0,
                width: 16,
                height: 16,
                boxShadow: `inset 0 0 0 2px ${((color !== '#ffffff') && color) || (onBlack ? '#fff' : '#000')}, inset 0 -2px 0 ${(color !== '#ffffff' && color) || (onBlack ? '#fff' : '#000')}`,
                'input ~ &': {
                    backgroundColor: color || (onBlack ? 'transparent' : '#ebf1f5'),
                },
                'input:disabled ~ &': {
                    boxShadow: 'none',
                    background: 'rgba(206,217,224,.5)',
                },
                ...(!isChecked ? {
                    'input:hover ~ &': {
                        backgroundColor: color ? lightenDarkenColor(color, -10) : ( onBlack ? '#333' : '#ebf1f5' ),
                    },
                } : {}),
                ...(isChecked ? (isCrossed ? crossedCheckbox(onBlack) : defaultCheckbox(onBlack)) : {})
            }}
        />
    )
}

const Checkbox = ({color, isCrossed, ...rest}: CheckboxProps) => (
    <MuiCheckbox
        sx={{'&:hover': { backgroundColor: 'transparent' }}}
        checkedIcon={<CheckboxIcon isChecked color={color} isCrossed={isCrossed}/>}
        icon={<CheckboxIcon color={color} isCrossed={isCrossed} />}
        {...rest}
    />
)

export default Checkbox