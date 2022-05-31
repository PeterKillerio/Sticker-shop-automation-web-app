import React from 'react';
import './App_CartItem.css';

import { Link } from "react-router-dom";
  
// MUI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';

function CartItem(props){
    /*  Returns cart item which is used in a CartList with appropriate descriptions and functionality
        to remove such item from a list */

    const cartItemIndex = () => {
        return(
            <Grid xs = {1.5} sm = {1}>
                <h3 className='textAlignCenter'>{props.listIndex}</h3>
            </Grid>
        );
    }
    const cartItemImg = () => {
        if(props.type == 'sticker'){
            return(            
                <Grid xs = {3} sm = {2} display="flex" justifyContent="center">
                    <Link to={props.link} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className='cartImgWrapper'>
                            <img className='cartImg' src={props.img}></img>
                        </div>
                    </Link>
                </Grid>
            );
        }
        else if(props.type == 'canvas'){
            return(
                <Grid xs = {3} sm = {2} display="flex" justifyContent="center">
                    <Link style={{pointerEvents: "none"}} to=''>
                        <div className='cartImgWrapper'>
                            <img className='cartImg' src={props.img}></img>
                        </div>
                    </Link>
                </Grid>
            );
        }        
    }
    const cartItemInformation = () => {
        if(props.type == 'sticker'){
            return(
                <Grid xs = {4.5} sm = {6}>
                    <Link to={props.link} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className='textAlignLeft'>{props.name} ({props.material}, {props.style}) x{props.amount}</h3>
                        <p className='stickerInfo'>{props.price} €/item, {props.width} mm x {props.height} mm</p>
                    </Link>
                </Grid>
            );
        }
        else if (props.type == 'canvas'){
            return(
                <Grid xs = {4.5} sm = {6}>
                    <Link to='' style={{pointerEvents: "none", textDecoration: 'none', color: 'inherit'}}>
                        <h3 className='textAlignLeft'>{props.name} ({props.material}, {props.style}) x{props.amount}</h3>
                        <p className='stickerInfo'>{props.price} €/item, {props.width} mm x {props.height} mm</p>
                    </Link>
                </Grid>
            );
        }        
    }
    const finalItemPrice = () => {
        return(
            <Grid xs = {1} sm = {1}>
                <h3 className='textAlignCenter'>{props.finalPrice} €</h3>
            </Grid>
        );
    }
    const removeCartItemButton = () => {
        return(
            <Grid xs = {2} display="flex" justifyContent="center">
                <IconButton onClick={(event) => props.onRemoveItemFromCart(props.cartItemId)}
                            size='small' aria-label="delete"
                            sx={{padding: "21px"}}
                            >
                    <ion-icon name="close-circle-outline" style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}></ion-icon>
                </IconButton>
            </Grid>
        );
    }

    return(  
        <div>
            <Grid   container 
                    justifyContent="center"
                    alignItems="center">
                
                {/* Item index */}
                {cartItemIndex()}
                
                {/* Item image */}
                {cartItemImg()}
                
                {/* Cart item information: name, material, style, dimensions, ...  */}
                {cartItemInformation()}

                {/* Final price */}
                {finalItemPrice()}
                
                {/* Remove button */}
                {removeCartItemButton()}

            </Grid>                
        </div>
    ); 
           
}

export default CartItem
