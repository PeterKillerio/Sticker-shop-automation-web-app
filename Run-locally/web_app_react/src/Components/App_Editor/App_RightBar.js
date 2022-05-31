import React from 'react';
import './App_RightBar.css';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

function RightBar(props){
    /* Right bar description in the editor page */

    const currentSelectedCanvasStyleOption = props.editorData.material_options[props.currentSelectedMaterialOptionIndex].style_options[props.currentSelectedStyleOptionIndex];
    const currentSelectedCutoutOption = props.editorData.cutout_options[props.currentSelectedCutoutIndex];
    
    // Depending on current add-to-cart loading status, show the button or loading 
    const addToCartButton = () => {
        if(props.canvasAddToCartLoading == true){
            return( <LoadingButton  loading variant="outlined"
                                    style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB }}
                                    >
                        Add to cart
                    </LoadingButton>);
        }else{
            return( <Button variant="contained"
                            style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB }}
                            onClick={() => {props.onAddCanvasToCart(currentSelectedCanvasStyleOption.option_id, currentSelectedCutoutOption.option_id, props.orderAmount, props.longestSidePick, props.currentCanvasColorBackground, props.imageCanvasContext,  props.eraserDeeraserCanvasContext,  props.paintDepaintCanvasContext)}}>
                        Add to cart
                    </Button>);
        }
    }

    return(  
        <div className="canvasRightBar"
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB, color: GLOBAL_CONSTANTS.COLORS.colorA,
                        boxShadow: '0px 0px 5px 1px rgba(255,255,255,0.70)'}}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                    
                <Grid>
                    <h5 className='rightBarText'>Amount</h5> 
                </Grid>

                <Grid className='amountFieldGrid'>
                    <div className='amountFieldWrapper'>
                        <TextField
                            id="filled-number"
                            className="amountField"
                            type="number"
                            defaultValue={props.orderAmount}
                            value={props.orderAmount}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: { min: 1 },
                                style: { color: GLOBAL_CONSTANTS.COLORS.colorA }
                            }}
                            size="small"
                            onChange={(event) => props.onChangeOrderAmount(event.target.value)}
                        />
                    </div>
                </Grid>
                
                <Grid className='rightBarText'>
                    <h5>Price</h5>
                </Grid>
                <Grid className='rightBarText'>
                    <p className='rightBarPriceText'>{props.canvasTotalPrice} €</p>
                </Grid>

                
                <Grid>
                    {addToCartButton()}
                </Grid>                
            </Grid>
        </div>     
    );       
}

export default RightBar
