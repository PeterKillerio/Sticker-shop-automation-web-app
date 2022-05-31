import React from 'react';
import './App_LeftBar.css';

// MUI
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import OnChangeIndexButton from './App_OnChangeIndexButton'

function LeftBar(props){
    /* Left bar definition in the editor page */

    // If background image exists, doesnt show background color option
    const backgroundImageUrl = props.editorData.material_options[props.currentSelectedMaterialOptionIndex].style_options[props.currentSelectedStyleOptionIndex].style_background_image_url;
    
    return(  
        <div    className="canvasLeftBar"
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB, color: GLOBAL_CONSTANTS.COLORS.colorA,
                        boxShadow: '0px 0px 5px 1px rgba(255,255,255,0.70)'}}>
            <Grid container>
                <Grid container>
                    <Grid xs={12}>
                        <h5>Upload your sticker</h5>
                    </Grid>
                    <Grid xs={12}>
                        <input type="file" name="image" accept="image/jpeg,image/png" onChange={(event) => {props.onImageUpload(event)}}/>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid xs={12}>
                        <h5>Cutout shapes</h5>
                    </Grid>

                    <Grid container>
                        {props.editorData.cutout_options.map((item, index) => (
                            OnChangeIndexButton(item, index, props.currentSelectedCutoutIndex, props.onCanvasCutoutChange)   
                        ))}
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid xs={12}>
                        <h5>
                            Canvas size: <br/>{props.currentCanvasDimensionWidth}mm x {props.currentCanvasDimensionHeight}mm
                        </h5>
                    </Grid>
                    <Grid xs={12} className="canvasSizeSliderGrid">
                        <Slider
                            aria-label="Canvas size"
                            defaultValue={props.longestSidePick}
                            step={0.5}
                            marks
                            min={props.sizeSliderMin}
                            max={props.sizeSliderMax}
                            valueLabelDisplay="auto"
                            onChangeCommitted={(event, value) => props.onChangeLongestSidePick(value)}
                            style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}
                        />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid xs={12}>
                        <h5>Materials</h5>
                    </Grid>    
                    
                    <Grid container>
                        {props.editorData.material_options.map((item, index) => (
                            OnChangeIndexButton(item, index, props.currentSelectedMaterialOptionIndex, props.onCanvasMaterialChange)
                        ))}
                    </Grid>
                </Grid>
                
                <Grid container>
                    <Grid xs={12}>
                        <h5>Styles</h5>
                    </Grid>  
                    <Grid container>
                        {props.editorData.material_options[props.currentSelectedMaterialOptionIndex].style_options.map((item, index) => (
                            OnChangeIndexButton(item, index, props.currentSelectedStyleOptionIndex, props.onCanvasStyleChange)
                        ))}
                    </Grid>  
                </Grid>

                {backgroundImageUrl 
                ? 
                    <React.Fragment></React.Fragment>
                : 
                    <Grid container alignItems="center">
                        <Grid xs={6}>
                            <h5>Background</h5>
                        </Grid>
                        <Grid xs={6}>
                            <input  type="color" name="backgroundColor" 
                                    value={props.currentCanvasColorBackground}
                                    onChange={(event) => props.changeCanvasBackground(event)}>
                            </input>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </div>  
    );       
}

export default LeftBar
