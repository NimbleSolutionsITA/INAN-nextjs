import { createTheme } from "@mui/material/styles";

const primaryLight = '#fff';
const primary = '#fff';
const primaryDark = '#b3b3b3';
const secondaryLight = '#222';
const secondary = '#000';
const secondaryDark = '#000';
// const grigio = '#989EA1';
// const gray = '#F1F1F5';
// const error = '#E3241C';

let theme = createTheme({
    palette: {
        primary: {
            main: primary,
            light: primaryLight,
            dark: primaryDark,
            contrastText: '#fff',
        },
        secondary: {
            main: secondary,
            light: secondaryLight,
            dark: secondaryDark,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 735,
            md: 735,
            lg: 925,
            xl: 926,
        },
    },
    typography: {
        fontFamily: [
            'Helvetica Neue',
            'Helvetica',
            'Arial',
            'sans-serif'
        ].join(','),
    }
})

theme.typography = {
    ...theme.typography,
    h1: {
        fontSize: 60,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: '50px',
        padding: '12px 0 2px',
        [theme.breakpoints.down('sm')]: {
            fontSize: 40,
            padding: '8px 0 2px',
            lineHeight: '35px',
        },
    },
    h2: {
        fontSize: 15,
        padding: '5px 0',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: '15px',
    },
    h3: {
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: 1.167,
        [theme.breakpoints.down('sm')]: {
            fontSize: 14,
        },
    },
    body1: {
        fontSize: 10,
        lineHeight: '12px',
        padding: '5px 0',
        [theme.breakpoints.down('sm')]: {
            fontSize: 11,
        },
    },
    body2: {
        color: '#878787',
        padding: '5px 0',
        fontSize: 10,
        lineHeight: '12px',
        [theme.breakpoints.down('sm')]: {
            fontSize: 11,
        },
    }
};

theme.components = {
    MuiCssBaseline: {
        styleOverrides: `
            * , *:before, *:after{
              box-sizing:border-box;
              -moz-box-sizing:border-box;
              -webkit-box-sizing:border-box;
              -ms-box-sizing:border-box;
            }
            html * { -webkit-text-size-adjust: none; }
            html,
            body {
              padding: 0 !important;
              height: 100%;
              width: 100%;
              margin: 0;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              font-size: 11px;
              line-height: 13px;
              text-transform: uppercase;
              @media (min-width: 735px) {
                -webkit-text-size-adjust: 100%;
                font-size: 10px;
              }
            }
            :any-link {
              color: inherit;
              text-decoration: none;
            }
            @keyframes logoAnimation {
              0% { opacity: 0; }
              50% { opacity: 1; }
            }
            @-webkit-keyframes logoAnimation {
              0% { opacity: 0; }
              50% { opacity: 1; }
            }
            #logoINAN .logoIN {
              -webkit-animation: logoAnimation 4s infinite ;
              animation: logoAnimation 4s infinite ;
              animation-timing-function: step-end;
            }
            #logoINAN .logoAN {
              -webkit-animation: logoAnimation 4s infinite ;
              animation: logoAnimation 4s infinite;
              animation-timing-function: step-end;
              animation-delay: 2s;
            }           
            .carousel-item-padding-40-px {
              padding-right: 10px;
            }
            .ohnohoney{
              opacity: 0;
              position: absolute;
              top: 0;
              left: 0;
              height: 0;
              width: 0;
              z-index: -1;
            }
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active  {
              -webkit-box-shadow: 0 0 0 30px #fff inset !important;
            }
            input[type="text"] {
              font-size: inherit;
            }
            .react-multi-carousel-list {
              margin-left: 1px;
            }

      `,
    },
    MuiTextField: {
        defaultProps: {
            variant: 'standard'
        }
    },
    MuiDivider: {
        styleOverrides: {
            root: {
                backgroundColor: secondary
            },
        }
    },
    MuiFormLabel: {
        styleOverrides: {
            root: {
                color: secondary,
                fontWeight: 'bold',
                fontSize: '13px',
            }
        }
    },
    MuiInput: {
        styleOverrides: {
            underline: {
                '&:after': {
                    borderBottom: '1px solid #333'
                }
            }
        }
    },
    MuiInputBase: {
        styleOverrides: {
            input: {
                textTransform: 'uppercase',
                padding: '5px 0 0',
            },
        }
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                fontSize: 10,
                [theme.breakpoints.down('sm')]: {
                    fontSize: 11,
                },
            },
            formControl: {
                top: '6px',
            },
            shrink: {
                transform: 'translate(0, 1.5px) scale(1)',
            },
        }
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: '5px 20px 5px 0',
            }
        }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                minHeight: '21px',
                paddingTop: '1px',
                paddingBottom: '1px',
                fontSize: '10px',
                [theme.breakpoints.down('sm')]: {
                    fontSize: '11px',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                },
            },
            outlined: {
                paddingTop: 0,
                paddingBottom: 0,
            },
            containedSecondary: {
                backgroundColor: secondary,
                color: primary
            }
        }
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: 'none',
                }
            },
            colorSecondary: {
                '&:hover': {
                    backgroundColor: 'none',
                }
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                color: '#000',
            },
        }
    },
}

export default theme;