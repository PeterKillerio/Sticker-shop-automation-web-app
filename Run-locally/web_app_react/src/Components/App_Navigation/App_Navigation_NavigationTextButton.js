import React from 'react';
import './App_Navigation.css';
import Grid from '@mui/material/Grid';

// Button event in menu
function NavigationTextButton(props){
    if (props.visible){
        return(
            <Grid xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>    
                <div className='navigationTextLinkWrapper'>
                    <button className='navigationButton' onClick={props.onClick} style={{fontSize: props.fontSize, color: props.color}}>
                        {props.text}
                    </button>
                </div>
            </Grid>
        );
    }else{
        return(null);
    }
}

export default NavigationTextButton