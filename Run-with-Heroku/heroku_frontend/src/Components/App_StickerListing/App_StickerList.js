import React from 'react';
import './App_StickerList.css';

// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';

// Components
import StickerItem from './App_Sticker'

function StickerList(props){
    /* Definition of the sticker list as a gallery of items that user's can order */

    return(  
        <div className='stickerList'>
            <Grid container justifyContent="center">  
                <Grid xs = {12} >
                    <Grid container justifyContent="center" className="stickerListInnerWrapper">
                        {props.stickerItems.map(item => (
                            <Grid xs = {6} sm = {4} md = {3} lg = {3} xl = {2} >
                                <StickerItem
                                        link = { GLOBAL_CONSTANTS.STICKER_PAGE_URL + item.id}
                                        stickerStyleOptionId = {item.stickerStyleOptionId}
                                        name = {item.name}
                                        price = {item.price}
                                        material = {item.material}
                                        style = {item.style}
                                        imgDesign = {item.imgDesign}
                                        favoriteStickersStyleOptionIds = {props.favoriteStickersStyleOptionIds}
                                        // Size
                                        longestSidePick = {props.longestSidePick}
                                        longest_pick_limit_min = {item.longest_pick_limit_min}
                                        longest_pick_limit_max = {item.longest_pick_limit_max}
                                        // Favorites
                                        onAddStickerToFavorites =  {props.onAddStickerToFavorites}
                                        onRemoveStickerFromFavorites = {props.onRemoveStickerFromFavorites}
                                        // Cart
                                        onAddStickerToCart = {props.onAddStickerToCart}
                                    /> 
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
    
}

export default StickerList