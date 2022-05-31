import React from 'react';
import './App_FavoriteSticker.css';

import { Link } from "react-router-dom";

// MUI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';

function FavoriteSticker(props){
    /*  Structure definion of favorite (sticker) item listed in the favoritelist on page with
        favorites page */
    return(  
        <div>
            <Grid   container 
                    justifyContent="center"
                    alignItems="center">
                <Grid xs = {1.5} sm = {1}>
                    <h3 className='stickerListIndex'>{props.listIndex}</h3>
                </Grid>

                <Grid xs = {3} sm = {2} display="flex" justifyContent="center">
                    <Link to={props.link} target="_blank">
                        <div className='favoriteStickerImgWrapper'>
                            <img className='favoriteStickerImg' src={props.img}></img>
                        </div>
                    </Link>
                </Grid>
                
                <Grid xs = {5.5} sm = {7}>
                    <Link to={props.link} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 className='stickerName'>{props.name}</h3>
                    </Link>
                </Grid>
                
                <Grid xs = {2} display="flex" justifyContent="center">
                    <IconButton onClick={(event) => props.onRemoveStickerFromFavorites(props.stickerOptionId)}
                                size='small' aria-label="delete"
                                sx={{padding: "21px"}}
                                >
                        <ion-icon name="close-circle-outline" style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}></ion-icon>
                    </IconButton>
                </Grid>
            </Grid>                
        </div>
    );        
}

export default FavoriteSticker
