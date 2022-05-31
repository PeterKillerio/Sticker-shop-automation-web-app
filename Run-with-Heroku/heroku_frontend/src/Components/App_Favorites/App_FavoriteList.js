import React from 'react';
import './App_FavoriteList.css';

// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import FavoriteSticker from './App_FavoriteSticker'

function FavoriteList(props){
    /* List of favorite items on a favorite items page */

    if (props.favoriteStickerItems.length){
        return(  
            <div>
                <Grid container justifyContent="center">  
                    <Grid xs = {12} >
                        <Grid container justifyContent="center" className="favoriteStickerListInnerWrapper">
                            {props.favoriteStickerItems.map((item, list_index) => (
                                <Grid xs = {12}>
                                    <FavoriteSticker
                                        listIndex = {list_index+1}
                                        name = {item.name}
                                        img = {item.img}
                                        stickerId = {item.sticker_id}
                                        link = {'/' + GLOBAL_CONSTANTS.STICKER_PAGE_URL + item.sticker_id}
                                        favoriteItemId = {item.favorite_item_id}
                                        stickerOptionId = {item.sticker_option_id}

                                        onRemoveStickerFromFavorites = {props.onRemoveStickerFromFavorites}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }else{
        return(  
            <div>
                <Grid container justifyContent="center">  
                    <Grid xs = {12}>
                        <p style={{textAlign: "center"}}>There are currently no stickers saved in your favorites</p>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default FavoriteList
