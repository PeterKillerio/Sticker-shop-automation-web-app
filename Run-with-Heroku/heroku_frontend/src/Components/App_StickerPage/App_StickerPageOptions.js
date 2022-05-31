import React from 'react';
import './App_StickerPageOptions.css';

// MUI
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

 const styles = theme => ({
    disabledButton: {
      backgroundColor: theme.palette.secondary || 'red'
    }
  });

function StickerPageOptions(props){
    /*  Component representing sticker options (material, style, size, amount, ...) 
        on the sticker page */

    function sliderValueText(value) {
        // Slider value floating text 
        return `${value} mm`;
    }

    if (props.stickerData != null){
        // Variables
        var materialOption = props.stickerData.material_options[props.currentSelectedMaterialIndex]
        var styleOption = props.stickerData.material_options[props.currentSelectedMaterialIndex].style_options[props.currentSelectedStyleOptionIndex];

        // Favorite button handler
        const favoriteButton = ()=>{
            // Check if item is already a favorite
            let isFavorite = false;
            var stickerStyleOptionId = styleOption.style_option_id;
            if (props.favoriteStickersStyleOptionIds.includes(stickerStyleOptionId)){
                isFavorite = true;
            }
            // Return buttons with different functions and styling if the sticker is in favorites
            if (isFavorite){
                return(
                    <Button variant="contained"
                            onClick={() => {props.onRemoveStickerFromFavorites(stickerStyleOptionId)}}>
                        Remove from favorites
                    </Button>
                );
            }
            else{
                return(
                    <Button variant="outlined"
                            onClick={() => {props.onAddStickerToFavorites(stickerStyleOptionId)}}>
                        Add to favorites
                    </Button>
                );
            }   
        }

        // Min and max slide size picker values
        const sizeSlideMax = styleOption.maximal_side_length_mm;
        // What would be min for largest side if we set our smallest side to min
        const sizeSlideMin = Math.ceil(Math.max(styleOption.aspect_ratio, 1/styleOption.aspect_ratio)*styleOption.minimal_side_length_mm);

        return(
            <div className='stickerPageSideWrapper'>
                <div className='stickerPageSide rightSideWrapper'>
                    <Grid container justifyContent="left">
                        <Grid xs = {12}>
                            {/* Description */}
                            <p>{props.stickerData.description}</p>
                        </Grid>
                        <Grid xs = {12}>
                            <h4>Material Options</h4>
                        </Grid>
                        
                        <Grid className='stickerPageButtonWrapper' xs={12}>

                            {/* Conditional visual render for material picking */}
                            {props.stickerData.material_options.map((materialOption, index) => (

                                index == props.currentSelectedMaterialIndex
                                    ? (<Button  
                                                variant="contained"
                                                onClick={() => props.onMaterialOptionClick(index)}
                                            >{materialOption.material_name}
                                        </Button>)
                                    : (<Button  variant="outlined"
                                                onClick={() => props.onMaterialOptionClick(index)}
                                            >{materialOption.material_name}
                                        </Button>)
                                
                            ))}
                        </Grid>
                        
                        <Grid xs = {12}>
                            <h4>Style Options</h4>
                        </Grid>
                        
                        <Grid className='stickerPageButtonWrapper'xs={12}>
                            {materialOption.style_options.map((styleOption, index)=> (
                                
                                index == props.currentSelectedStyleOptionIndex
                                    ? (<Button  variant="contained"
                                                onClick={() => props.onStyleOptionClick(index)}
                                            >{styleOption.style_option_name}
                                        </Button>)
                                    : (<Button  variant="outlined" 
                                                onClick={() => props.onStyleOptionClick(index)}
                                            >{styleOption.style_option_name}
                                        </Button>)
 
                            ))}
                        </Grid>
                        
                        <Grid xs = {12}>
                            <h4>Size: width x height</h4> 
                            <Input 
                                disabled
                                value={props.stickerWidthmm + "mm x " + props.stickerHeightmm + "mm"}
                            />
                        </Grid>
                        <Grid xs = {12}>
                            <Slider
                                // className="sideSlider"
                                aria-label="Longest side picker"
                                defaultValue={props.currentSelectedLongestSidePick}
                                valueLabelFormat={sliderValueText}
                                step={1}
                                marks
                                min={sizeSlideMin}
                                max={sizeSlideMax}
                                valueLabelDisplay="auto"
                                onChangeCommitted={(event, value) => props.onSizeSliderChange(value)}
                            />
                        </Grid>
                        <Grid xs = {12}>
                            <h4>Amount</h4>
                        </Grid>
                        <Grid xs = {12}>
                            <TextField
                                id="filled-number"
                                type="number"
                                defaultValue={props.currentStickerAmount}
                                value={props.currentStickerAmount}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: { min: 1 },
                                    style: { color: GLOBAL_CONSTANTS.COLORS.colorB }
                                }}
                                focused
                                variant="filled"
                                onChange={(event) => props.onStickerAmountChange(event.target.value)}
                            />
                        </Grid>
                        <Grid xs = {12}>
                            <h4>Price</h4>
                        </Grid>
                        <Grid xs = {12}>
                            <p>{props.currentStickerPrice} €</p>
                        </Grid>

                        <Grid className='stickerPageButtonWrapper' xs = {12}>
                            <Button variant="outlined"
                                    onClick={() => {props.onAddStickerToCart(styleOption.style_option_id, props.currentStickerAmount, props.currentSelectedLongestSidePick)}}
                            >Buy</Button>
                            
                            {favoriteButton()}
                        </Grid>

                    </Grid>
                </div>
            </div>
        );}
    else{
        return(null);
    }
}

export default StickerPageOptions
