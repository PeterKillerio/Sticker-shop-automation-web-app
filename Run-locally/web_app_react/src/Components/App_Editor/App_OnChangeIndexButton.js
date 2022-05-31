import React from 'react';
import './App_OnChangeIndexButton.css';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Button used for changing cutouts, materials and styles (their indexes)
function OnChangeIndexButton(item, currentIndex, selectedIndex, onClickFunction){
    // Return buttons with different styling
    if (currentIndex == selectedIndex){
        return(
            <Grid xs = {12} className='onChangeIndexButtonGrid'>
                <Button variant="contained"
                        className='onChangeIndexButton'
                        style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}>
                    {item.name} 
                </Button>
            </Grid>
        );
    }else{
        return(
            <Grid xs={12} className='onChangeIndexButtonGrid'>
                <Button variant="contained"
                        className='onChangeIndexButton'
                        onClick={() => onClickFunction(currentIndex)}
                        style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB, color: GLOBAL_CONSTANTS.COLORS.colorA}}>
                    {item.name}
                </Button>
            </Grid>
        );
    }
}

export default OnChangeIndexButton
