import {FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField, Typography} from "@mui/material";
import Checkbox from "../../Checkbox";
import React from "react";
import {Attribute} from "../../../utils/products";
import ExpansionPanel from "../product/ExpansionPanel";

type FiltersProps = {
	attributes: Attribute[];
	selectedFilters: Record<string, string|string[]|undefined>
	handleFilterChange: (attributeSlug: string, optionSlug: string, checked?: boolean) => void
}

const Filters = ({attributes, selectedFilters, handleFilterChange}: FiltersProps) => {
	return (
		<ExpansionPanel title="">
			<div style={{marginBottom: "20px", marginTop: "20px"}}>
				<Grid container>
					<Grid item xs={6}>
						<FormControl component="fieldset" style={{width: '100%', padding: '8px 3px'}}>
							<FormLabel component="legend" sx={{"&.Mui-focused": {color: "#000000"}}}>Cerca per nome</FormLabel>
							<TextField value={selectedFilters['name'] ?? ""} onChange={e => handleFilterChange("name", e.target.value, )} />
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControlLabel
							control={
								<Checkbox
									checked={selectedFilters['stock_status'] === 'instock'}
									inputProps={{'aria-label': 'primary checkbox'}}
									onChange={(e) =>
										handleFilterChange('stock_status', 'instock', e.target.checked)
									}
									isCrossed
								/>}
							label={'Only in stock'}
							labelPlacement="end"
						/>
					</Grid>
				</Grid>

				{attributes.map((attribute) => (
					<FormControl key={attribute.slug} component="fieldset" style={{width: '100%', padding: '8px 3px'}}>
						<FormLabel component="legend" sx={{"&.Mui-focused": {color: "#000000"}}}>{attribute.name}</FormLabel>
						<FormGroup aria-label="position" row>
							<Grid container>
								{attribute.options.map((option) => option && (
									<Grid key={option.slug} item xs={4} sm={3} md={2}>
										<FormControlLabel
											control={
												<Checkbox
													checked={selectedFilters[attribute.slug]?.includes(option.slug) || false}
													inputProps={{'aria-label': 'primary checkbox'}}
													onChange={(e) =>
														handleFilterChange(attribute.slug, option.slug, e.target.checked)
													}
													color={option.description}
													isCrossed
												/>}
											label={option.name}
											labelPlacement="end"
											sx={((selectedFilters[attribute.slug]?.includes(option.slug) || false) && attribute.slug === "pa_color") ? {
												'& .FormControlLabel-label': {
													textDecoration: 'line-through'
												}
											} : undefined}
										/>
									</Grid>
								))}
							</Grid>
						</FormGroup>
					</FormControl>
				))}
			</div>
		</ExpansionPanel>
	)
}

export default Filters