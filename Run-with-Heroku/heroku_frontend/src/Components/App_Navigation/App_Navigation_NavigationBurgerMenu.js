import React from 'react';
import './App_Navigation.css';
import IconButton from '@mui/material/IconButton';

// Mobile burger menu
function NavigationBurgerMenu(props){
    return(
        <div className='burgerMenuIconWrapper'>
            <IconButton className='burgerMenuIcon' onClick={props.onClick} size='large' aria-label="delete">
                <ion-icon name="menu" style={{color: props.color}}></ion-icon>
            </IconButton>
        </div>
    );
}

export default NavigationBurgerMenu