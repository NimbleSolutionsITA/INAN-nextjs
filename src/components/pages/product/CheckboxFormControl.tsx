import React from "react"
import Checkbox from "../../Checkbox";
import {FormControl, FormControlLabel, FormGroup, Grid} from "@mui/material";
import {ProductAttribute} from "../../../../@types/woocommerce";

type CheckboxFromControl = {
    options: string[]
    type: string | null
    setType: Function
    colors?: ProductAttribute[]
    availableOptions?: (string | undefined)[]
}

const CheckboxFromControl = ({options, type, setType, colors, availableOptions}: CheckboxFromControl) => {
    const checked = (option: string, index: number) => type ? type === option : index === 0
    return (
        <FormControl component="fieldset" style={{width: '100%', padding: '0 3px'}}>
            <FormGroup aria-label="position" row>
                <Grid container>
                    {options.map((option, index) => (
                        <Grid key={option} item xs={6}>
                            <FormControlLabel
                                value={checked(option, index)}
                                control={
                                    <Checkbox
                                        checked={checked(option, index)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        onChange={() => setType(option)}
                                        color={colors?.filter(cl => cl.name === option)[0].description}
                                    />}
                                label={option}
                                labelPlacement="end"
                                sx={(checked(option, index) && colors) ? {
                                    '& .FormControlLabel-label': {
                                        textDecoration: 'line-through'
                                    }
                                } : undefined}
                                disabled={availableOptions ? !availableOptions.includes(option) : false}
                            />
                        </Grid>
                    ))}
                </Grid>
            </FormGroup>
        </FormControl>
    )
}

export default CheckboxFromControl