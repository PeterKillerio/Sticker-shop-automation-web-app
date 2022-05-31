import React from 'react';
import './App_EditorPage.css';

// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import BottomBar from './App_BottomBar'
import LeftBar from './App_LeftBar'
import RightBar from './App_RightBar';

function EditorPage(props){
    /* Contains page structure description using react components */

    const canvasBackgroundImage = () => {
        const backgroundImageUrl = props.editorData.material_options[props.currentSelectedMaterialOptionIndex].style_options[props.currentSelectedStyleOptionIndex].style_background_image_url;
        if(backgroundImageUrl){
            return(
                <img    src={backgroundImageUrl}
                        style={{ width: '100%', height: '100%'}}>
                </img>
            );
        }else{
            return(null);            
        }
    };

    return(  
        <div className="canvasContainerWrapper">
            <Grid container className="canvasContainer" style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}>  
                <Grid   xs={12} 
                        style={{width: props.canvasElementWidth, height: props.canvasElementHeight}}>

                    <div className="canvasWrapper"
                        style={{width: props.canvasElementWidth, height: props.canvasElementHeight }}>   
                        
                        <div    className='canvasBackgrouondColor'
                                style={{    backgroundColor: props.currentCanvasColorBackground}}>   
                            {canvasBackgroundImage()}
                        </div>

                        {/* Main presented canvas */}
                        <canvas
                            ref={props.imageCanvasRef} 
                            width={props.canvasWidth} height={props.canvasHeight}
                            style={{maxWidth: props.canvasElementWidth, maxHeight: props.canvasElementHeight }}
                            // References other canvases as well
                            onMouseDown={props.canvasOnMouseDown}
                            onMouseUp={props.canvasOnMouseUp}
                            onMouseMove={props.canvasOnMouseMove}
                        >   
                        </canvas>
                        
                        {/* Hidden canvas for EraserDeeraser layer */}
                        <canvas 
                            ref={props.eraserDeeraserCanvasRef} 
                            width={props.canvasWidth} height={props.canvasHeight}
                            style={{maxWidth: props.canvasElementWidth, maxHeight: props.canvasElementHeight , 
                                    visibility: "hidden", display: "none"}}>   
                        </canvas>

                        {/* Hidden canvas for PaintDepaint layer */}
                        <canvas 
                            ref={props.paintDepaintCanvasRef} 
                            width={props.canvasWidth} height={props.canvasHeight}
                            style={{maxWidth: props.canvasElementWidth, maxHeight: props.canvasElementHeight,
                                    visibility: "hidden", display: "none"}}>   
                        </canvas>   

                        {/* Cutout image */}
                        {/* 2 images inverted to each other to makeup for black on black camouflage */}
                        <img    className='canvasCutoutImage'
                            style={{width: props.canvasElementWidth, height: props.canvasElementHeight, 
                                    opacity: 0.6, pointerEvents: 'none'}}
                            src={props.editorData.cutout_options[props.currentSelectedCutoutIndex].img_url}>
                        </img>
                        <img    className='canvasCutoutImage'
                            style={{width: props.canvasElementWidth, height: props.canvasElementHeight, 
                                    opacity: 0.2, pointerEvents: 'none',
                                    filter: 'invert(100%)' }}
                            src={props.cutoutImateSrc}>
                        </img>

                        <div className='dimensionTextWrapper dimensionTextWrapperWidth'>
                            <p>width: {props.currentCanvasDimensionWidth}mm</p>
                        </div>

                        <div className='dimensionTextWrapperHeight'>
                            <p>height: {props.currentCanvasDimensionHeight}mm</p>
                        </div>                        
                    </div>
                </Grid>

                {/* All tools will have absolute position */}
                {/* props.editorData */}

                <LeftBar
                    editorData = {props.editorData}
                    currentSelectedCutoutIndex = {props.currentSelectedCutoutIndex}
                    currentSelectedMaterialOptionIndex = {props.currentSelectedMaterialOptionIndex}
                    currentSelectedStyleOptionIndex = {props.currentSelectedStyleOptionIndex}
                    currentCanvasColorBackground = {props.currentCanvasColorBackground}
                    currentCanvasDimensionWidth = {props.currentCanvasDimensionWidth}
                    currentCanvasDimensionHeight = {props.currentCanvasDimensionHeight}


                    longestSidePick = {props.longestSidePick}
                    sizeSliderMin = {props.sizeSliderMin}
                    sizeSliderMax = {props.sizeSliderMax}

                    onCanvasCutoutChange = {props.onCanvasCutoutChange}
                    onCanvasMaterialChange = {props.onCanvasMaterialChange}
                    onCanvasStyleChange = {props.onCanvasStyleChange}
                    onChangeLongestSidePick = {props.onChangeLongestSidePick}
                    onImageUpload = {props.onImageUpload}

                    changeCanvasBackground = {props.changeCanvasBackground}
                />

                <BottomBar
                    imageToCanvasScale = {props.imageToCanvasScale}
                    onChangeImageScale = {props.onChangeImageScale}
                    onChangeTool = {props.onChangeTool}
                    lineWidth = {props.lineWidth}

                    currentSelectedTool = {props.currentSelectedTool}
                    currentSelectedToolState = {props.currentSelectedToolState}

                    changeBrushColor = {props.changeBrushColor}
                    paintDepaintCanvasColor = {props.paintDepaintCanvasColor}   
                    onChangeLineWidth = {props.onChangeLineWidth}
                />

                <RightBar
                    canvasAddToCartLoading = {props.canvasAddToCartLoading}

                    editorData = {props.editorData}
                    currentSelectedCutoutIndex = {props.currentSelectedCutoutIndex}
                    currentSelectedMaterialOptionIndex = {props.currentSelectedMaterialOptionIndex}
                    currentSelectedStyleOptionIndex = {props.currentSelectedStyleOptionIndex}
                    currentCanvasColorBackground = {props.currentCanvasColorBackground}
                    longestSidePick = {props.longestSidePick}
                    canvasTotalPrice = {props.canvasTotalPrice}
                    orderAmount = {props.orderAmount}
                    canvasPrice = {props.canvasPrice}

                    imageCanvasContext = {props.imageCanvasContext}
                    eraserDeeraserCanvasContext = {props.eraserDeeraserCanvasContext}
                    paintDepaintCanvasContext = {props.paintDepaintCanvasContext} 
                    
                    onChangeOrderAmount = {props.onChangeOrderAmount}
                    onAddCanvasToCart = {props.onAddCanvasToCart}
                />
                
            </Grid>
        </div>
    );       
}


export default EditorPage
