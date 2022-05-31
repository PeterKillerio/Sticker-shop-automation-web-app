import React from 'react';
import './App_BottomBar.css';

// MUI
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

function BottomBar(props){
    /* Returns bottom tool bar on the edior page */

    const brushTool = () => {
        // Logic for paint tool option selection

        var brushTool = null;

        var brushToolSize = "medium";
        var addPaintSize = "small";
        var removePaintSize = "small";
        var addPaintSizeIonIconName = "add-circle-outline";
        var removePaintSizeIonIconName = "remove-circle-outline";

        if( props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL']){
            addPaintSize = "medium";
            addPaintSizeIonIconName = "add-circle";
        }
        else if (props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL']){
            removePaintSize = "medium";
            removePaintSizeIonIconName = "remove-circle";
        }

        if (( props.currentSelectedTool != LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL']) && 
            (props.currentSelectedTool != LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL'])){
            // Paint tool is not selected

            brushTool = (<Grid>
                <IconButton onClick={(event) => {props.onChangeTool('PAINT_TOOL')}}
                            size={brushToolSize}>
                    <ion-icon name="brush-outline" style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                </IconButton>
            </Grid>);
        }else{
            brushTool = (
                <React.Fragment>
                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('PAINT_TOOL')}}
                                    size={brushToolSize}>
                            <ion-icon name="brush" style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>
    
                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('PAINT_TOOL')}}
                                    size={addPaintSize}>
                            <ion-icon name={addPaintSizeIonIconName} style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>
    
                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('DEPAINT_TOOL')}}
                                    size={removePaintSize}>
                            <ion-icon name={removePaintSizeIonIconName} style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>
    
                    <Grid>
                        <input  type="color" name="brushColor" 
                                value={props.paintDepaintCanvasColor}
                                onChange={(event) => props.changeBrushColor(event)}>
                        </input>
                    </Grid>
    
                </React.Fragment>
                );
        }

        return(brushTool);
    };

    const lineWidthSlider = () => {
        // Display logic for brush tool width slider

        var widthSlider = null;

        if( props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL'] || 
            (props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL']) ||
            (props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']) ||
            (props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL'])
        ){
            widthSlider = (
                <React.Fragment>
                    <Grid xs={2}>
                        <h5> Line width </h5>
                    </Grid>
                    <Grid xs={10}>
                        <Slider
                            // className="sideSlider"
                            aria-label="Line width slider"
                            defaultValue={props.lineWidth}
                            step={1}
                            marks
                            min={1}
                            max={250}
                            valueLabelDisplay="auto"
                            onChangeCommitted={(event, value) => props.onChangeLineWidth(value)}
                            style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}
                        />
                    </Grid>
                </React.Fragment>
            );
        }

        return(widthSlider);
    };

    const eraserTool = () => {
        // Logic for eraser tool option selection

        var eraserTool = null;

        var eraserToolSize = "medium";
        var addEraserSize = "small";
        var removeEraserSize = "small";
        var addEraserSizeIonIconName = "add-circle-outline";
        var removeEraserSizeIonIconName = "remove-circle-outline";

        if( props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']){
            addEraserSize = "medium";
            addEraserSizeIonIconName = "add-circle";
        }
        else if (props.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL']){
            removeEraserSize = "medium";
            removeEraserSizeIonIconName = "remove-circle";
        }

        if (( props.currentSelectedTool != LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']) && 
            (props.currentSelectedTool != LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL'])){
            // Eraser tool is not selected
            eraserTool = (
                <React.Fragment>
                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('ERASER_TOOL')}}
                                    size={eraserToolSize}>
                            <ion-icon name="eye-off-outline" style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>
                </React.Fragment>
            );
            
        }else{
            eraserTool = (
                <React.Fragment>
                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('ERASER_TOOL')}}
                                    size={eraserToolSize}>
                            <ion-icon name="eye-off" style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>

                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('ERASER_TOOL')}}
                                    size={addEraserSize}>
                            <ion-icon name={addEraserSizeIonIconName} style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>

                    <Grid>
                        <IconButton onClick={(event) => {props.onChangeTool('DEERASER_TOOL')}}
                                    size={removeEraserSize}>
                            <ion-icon name={removeEraserSizeIonIconName} style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                        </IconButton>
                    </Grid>
                </React.Fragment>
            );            
        }
        return(eraserTool);
    };

    return(  
        <div    className="canvasBottomBar"
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB, color: GLOBAL_CONSTANTS.COLORS.colorA,
                        boxShadow: '0px 0px 5px 1px rgba(255,255,255,0.70)'}}>
            <Grid container direction="row" justifyContent="center" alignItems="center">

                <Grid display="flex" justifyContent="center">
                    <IconButton onClick={(event) => {props.onChangeTool('MOVE_TOOL')}}
                                size='medium'>
                        <ion-icon name="move" style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}></ion-icon>
                    </IconButton>
                </Grid>
            
                {brushTool()}
                
                {eraserTool()}

                <Grid>
                    <h5>
                        Image scale:
                    </h5>
                </Grid>
                <Grid className='imageScaleSliderGrid'>
                    <Slider
                        aria-label="Image scale slider"
                        defaultValue={props.imageToCanvasScale}
                        step={0.1}
                        marks
                        min={0.2}
                        max={4}
                        valueLabelDisplay="auto"
                        onChange={(event, value) => props.onChangeImageScale(value)}
                        style={{color: GLOBAL_CONSTANTS.COLORS.colorA}}
                    />
                </Grid>
            </Grid>

            <Grid container alignItems="center">
                {lineWidthSlider()}                
            </Grid>
        </div>        
    );       
}

export default BottomBar
