import {ReactNode, SyntheticEvent, useState} from "react"
import {Accordion, AccordionSummary, AccordionDetails, SxProps} from "@mui/material"
import {ExpandMore, Add, Remove} from '@mui/icons-material';

type ExpansionPanelProps = {
    children: ReactNode
    title: ReactNode | string
    plusMinus?: boolean,
    sx?:  SxProps
}

const ExpansionPanel = ({children ,title, plusMinus, sx}: ExpansionPanelProps) => {
    const [expanded, setExpanded] = useState<boolean | string>(false)

    const handleChange = (panel: boolean | string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    const expandIcon = () => {
        if (plusMinus) return expanded ? <Remove /> : <Add />
        return <ExpandMore />
    }

    return (
        <Accordion
            square
            elevation={0}
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            sx={{
                marginTop: {xs: '10px', md: 0},
                marginBottom: 0,
                textTransform: 'uppercase',
                '&.Mui-expanded': {
                    marginBottom: 0,
                    marginTop: {xs: '10px', md: 0},
                },
                '&::before': {
                    display: 'none',
                },
                ...sx
            }}
        >
            <AccordionSummary
                id="panel1bh-header"
                expandIcon={expandIcon()}
                aria-controls="panel1bh-content"
                sx={{
                    padding: 0,
                    minHeight: '25px',
                    '&.Mui-expanded': {
                        minHeight: '25px',
                    },
                    '& .MuiAccordionSummary-content': {
                        margin: '0',
                        '&.Mui-expanded': {
                            margin: '0',
                        },
                    },
                    '& .MuiAccordionSummary-expandIcon': {
                        padding: '5px',
                        marginRight: '-8px',
                    }
                }}
            >
                {title}
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block', padding: 0}}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default ExpansionPanel