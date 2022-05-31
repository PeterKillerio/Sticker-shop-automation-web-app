import React from 'react';
import './App_Favorites.css';

// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import FavoriteList from './App_FavoriteList'

class Favorites extends React.Component {
    /* Main component representing favorites page structure */

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div 
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}
                className="favoritesWrapper"
            >

                <Grid container justifyContent="center">  
                    <Grid xs={12} className="favoritesHeaderWrapper">
                            <h1>Favorites</h1>
                    </Grid>

                    <Grid xs={12}>
                        <FavoriteList
                            favoriteStickerItems = {this.props.favoriteStickerItems}
                            onRemoveStickerFromFavorites = {this.props.onRemoveStickerFromFavorites}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }    
}

export default Favorites
