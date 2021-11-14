import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import React from 'react'



function CheckBox(props) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    color="default"
                    {...props}
                />
            }
            label={<Typography variant="subtitle2">{props.label}</Typography>}
        
        />
    )
}
export default CheckBox;