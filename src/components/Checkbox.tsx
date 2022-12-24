import {Box, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps} from "@mui/material";

type CheckboxProps = Partial<Omit<MuiCheckboxProps, 'color'>> & {
    color?: string
    onBlack?: boolean
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

const CheckboxIcon = ({color, onBlack, isChecked}: {color?: string, onBlack?: boolean, isChecked?: boolean}) => (
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
            'input:hover ~ &': {
                backgroundColor: color ? lightenDarkenColor(color, -10) : ( onBlack ? '#333' : '#ebf1f5' ),
            },
            'input:disabled ~ &': {
                boxShadow: 'none',
                background: 'rgba(206,217,224,.5)',
            },
            ...(isChecked ? {
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
            } : {})
        }}
    />
)

const Checkbox = ({color, onBlack, ...rest}: CheckboxProps) => (
    <MuiCheckbox
        sx={{'&:hover': { backgroundColor: 'transparent' }}}
        checkedIcon={<CheckboxIcon isChecked onBlack={onBlack} color={color} />}
        icon={<CheckboxIcon onBlack={onBlack} color={color} />}
        {...rest}
    />
)

export default Checkbox