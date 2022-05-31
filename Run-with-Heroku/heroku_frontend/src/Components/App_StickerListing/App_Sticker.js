import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App_Sticker.css';
import { Link } from 'react-router-dom';

// MUI 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';

// Add to cart and favorites button
function StickerButton(props){
    // Ion-icons names: heart-outline, add-circle-outline
    return(
        <div className={'stickerButton ' + props.additionalClass}>
            <IconButton onClick={props.onClick} size='medium' aria-label="delete">
                <ion-icon name={props.iconName} style={{color: props.color}}></ion-icon>
            </IconButton>
        </div>
    );
}

function StickerItem(props){
    /* Definition of sticker item presented in the gallery */

    // Check if this sticker is in favorites list
    const favoriteButton = ()=>{
        // Check if item is already a favorite
        let isFavorite = false;
        if (props.favoriteStickersStyleOptionIds.includes(props.stickerStyleOptionId)){
            isFavorite = true;
        }

        // Return buttons with different functions and styling if the sticker is in favorites
        if (isFavorite){
            return(
                <StickerButton
                    iconName="heart"
                    color={GLOBAL_CONSTANTS.COLORS.colorA}
                    additionalClass="favoritesButton"
                    onClick={() => {props.onRemoveStickerFromFavorites(props.stickerStyleOptionId)}}
                />
            );
        }
        else{
            return(
                <StickerButton
                    iconName="heart-outline"
                    color={GLOBAL_CONSTANTS.COLORS.colorA}
                    additionalClass="favoritesButton"
                    onClick={() => {props.onAddStickerToFavorites(props.stickerStyleOptionId)}}
                />
            );
        }   
    }

    const pickBlocker = () => {
        if ((props.longestSidePick < props.longest_pick_limit_min) || (props.longestSidePick > props.longest_pick_limit_max)){
            return(
                <div className='pickBlocker'>
                    <p>Longest side <br/>{props.longest_pick_limit_min} mm - {props.longest_pick_limit_max} mm </p>
                </div>
            );
        }else{
            return(null);
        }        
    };

    return(
        <Grid container className='stickerItemContainer'>
            <div className="stickerItemWrapper">

            {/* {props.longest_pick_limit_min}-{props.longest_pick_limit_max} */}
                <Link to={props.link} target="_blank" style={{ textDecoration: 'none' }}>
                    <Grid xs={12}> 
                        <div className="stickerItemImageWrapperWrapper">
                            <div className="stickerItemImageWrapper">
                                <img src={props.imgDesign}></img>
                            </div>
                        </div>
                    </Grid>
                </Link>

                <Grid xs={12}> 
                    <Grid container  className='stickerInteractiveWrapper'>
                        {/* If the picked dimensions are too small, sticker is deactivated */}
                        {pickBlocker()}
                        
                        {/* Buttons */}
                        <StickerButton
                            iconName="add-circle-outline"
                            color={GLOBAL_CONSTANTS.COLORS.colorA}
                            additionalClass="cartButton"
                            onClick={() => {props.onAddStickerToCart(props.stickerStyleOptionId, 1, props.longestSidePick)}}
                        />

                        {favoriteButton()}    
                        
                        {/* Text */}
                        <p className='stickerPrice'>
                            {props.price} €
                        </p>
                        
                        <Grid xs={12} style={{}}>
                            <Link to={props.link} target="_blank" style={{color: GLOBAL_CONSTANTS.COLORS.colorA, textDecoration: 'none' }}>
                                <p className='stickerText'>
                                    {props.name}
                                    <br/>
                                    <span className='stickerMaterialStyleText'>
                                        {props.material}/{props.style}
                                    </span>
                                </p>   
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Grid>    
    );
}

export default StickerItem