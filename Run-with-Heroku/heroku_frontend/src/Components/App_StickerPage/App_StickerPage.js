import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './App_StickerPage.css';
import mergeImages from 'merge-images';

import {
    useParams
  } from "react-router-dom";

// MUI
import Grid from '@mui/material/Grid';

// Components
import StickerPageOptions from './App_StickerPageOptions';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Function component to read the url parameter and pass it to class based component
export function withRouter(Component){
    return(props)=>{
       return <Component {...props}  url_parameters = {useParams()}/>
   }
}

function CanvasHandler(props){
    // If the sticker and presentational images loaded, load the canvas
    if (props.imgPresentationBackgroundLoaded == true && 
        props.imgPresentationStickerLoaded == true){

            props.canvasContext.drawImage(props.imgPresentationBackground,0,0,props.width,props.height);
            props.canvasContext.drawImage(props.imgPresentationSticker,props.width/2-props.stickerWidth/2
                            ,props.height/2-props.stickerHeight/2,
                            props.stickerWidth,
                            props.stickerHeight);
    }
    return(null);
}

class StickerPage extends React.Component {
    /* Main component representing sticker page and its functions */

    constructor(props){
        super(props);
        this.state = {
            sticker_id: props.url_parameters.sticker_id,
            stickerData: null,
            currentSelectedMaterialIndex: 0,
            currentSelectedStyleOptionIndex: 0,
            currentSelectedLongestSidePick: 60,
            currentStickerAmount: 1,
            currentStickerPrice: 'N/A',
            sizeTextField: "", // Size textfield exmpl: 30 mm x 30 mm
            stickerWidthmm: 0,
            stickerHieghtmm: 0,
            
            // Variable for dynamic sticker on presentational background
            canvasContext: null,
            canvasWidth: 2000, // Pixel density
            canvasHeight: 2000, // Pixel density
            PixelPermm: (0.7*2000)/304.0, // Manually defined 
            imgPresentationBackground: new Image(),
            imgPresentationBackgroundLoaded: false,
            imgPresentationSticker: new Image(),
            imgPresentationStickerLoaded: false,
            // Sticker parameters
            stickerAspectRatio: 1.0,
            stickerWidth: 0,
            stickerHeight: 0,

        }; 
        this.state.imgPresentationBackground.src = "https://sticker-app-storage.s3.eu-central-1.amazonaws.com/Media/ProductPage/Sticker/laptop.jpg";
        this.onSizeSliderChange = this.onSizeSliderChange.bind(this);
        this.onMaterialOptionClick = this.onMaterialOptionClick.bind(this);
        this.onStyleOptionClick = this.onStyleOptionClick.bind(this);
        this.onStickerAmountChange = this.onStickerAmountChange.bind(this);
    }

    componentDidMount(){
        // Ask for sticker data and set backgroundUrls
        this.updateStickerParameters();

        // Set callback function on loading presentational and sticker images
        const scope = this;
        this.state.imgPresentationBackground.onload = function() {scope.setState({imgPresentationBackgroundLoaded: true});}
        
        // Canvas context
        this.updateStickerDimensions();
        this.setState({canvasContext: this.refs.canvas.getContext('2d')});
        
        this.updateStickerPrice();
    }

    updateStickerImage(){
        // Set sticker image source, callback and aspect ratio
        this.state.imgPresentationSticker.src = this.state.stickerData.material_options[this.state.currentSelectedMaterialIndex].style_options[this.state.currentSelectedStyleOptionIndex].img_combi_url
        const scope = this;
        this.setState({imgPresentationStickerLoaded: false});
        this.state.imgPresentationSticker.onload = function() {scope.setState({imgPresentationStickerLoaded: true});}   
        
        this.setState({stickerAspectRatio: this.state.stickerData.material_options[this.state.currentSelectedMaterialIndex].style_options[this.state.currentSelectedStyleOptionIndex].aspect_ratio});
    }

    updateStickerDimensions(){
        // Recalculate sticker width and height based on current size picked by user
        let stickerWidth = 0;
        let stickerHeight = 0;
        let stickerWidthmm = 0;
        let stickerHeightmm = 0;
        if(this.state.stickerAspectRatio >= 1){
            stickerWidth = this.state.currentSelectedLongestSidePick*this.state.PixelPermm;
            stickerHeight = (this.state.currentSelectedLongestSidePick*this.state.PixelPermm)/this.state.stickerAspectRatio;
            stickerWidthmm = this.state.currentSelectedLongestSidePick;
            stickerHeightmm = this.state.currentSelectedLongestSidePick/this.state.stickerAspectRatio;
        }else{
            stickerWidth = (this.state.currentSelectedLongestSidePick*this.state.PixelPermm)*this.state.stickerAspectRatio; 
            stickerHeight = this.state.currentSelectedLongestSidePick*this.state.PixelPermm;
            stickerWidthmm = (this.state.currentSelectedLongestSidePick)*this.state.stickerAspectRatio;
            stickerHeightmm = this.state.currentSelectedLongestSidePick;
        }
        this.setState({
            stickerWidth: stickerWidth,
            stickerHeight: stickerHeight,
            stickerWidthmm: Math.round((stickerWidthmm + Number.EPSILON) * 100) / 100,
            stickerHeightmm: Math.round((stickerHeightmm + Number.EPSILON) * 100) / 100,
        });
    }

    updateStickerPrice(){
        if (this.state.stickerData != null){
            let priceRaw = this.state.currentStickerAmount*this.state.currentSelectedLongestSidePick*this.state.stickerData.material_options[this.state.currentSelectedMaterialIndex].style_options[this.state.currentSelectedStyleOptionIndex].price_parameter;
            console.log('raw price: '+ priceRaw);
            this.setState({ currentStickerPrice: Math.round((priceRaw + Number.EPSILON) * 100) / 100});
        }
    }

    updateStickerParameters(){
        // Call server api for sticker information
        console.log("API REQUEST: " + GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                        LOCAL_CONSTANTS.API_CALL_URLS.get_sticker 
                        + this.state.sticker_id + "/");
        
        axios({
            method: 'get',
            url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                    LOCAL_CONSTANTS.API_CALL_URLS.get_sticker + 
                    this.state.sticker_id + "/",
            validateStatus: () => true
        }).then(res => {
            console.log("App_StickerPage res: " + JSON.stringify(res))
            if (res.status != 200){
                // Invalid request
                console.log("<WARNING:App_StickerPage.js>: Invalid request.")
                // On 404, redirect to homepage
                if (res.status == 404){
                    alert("404: Sticker doesn't exist or is inactive")
                    window.location.replace("/");
                }
                
            }else{
                // Valid request
                console.log("<INFO:App_StickerPage.js> Valid request")

                // Set default slider pick in the middle
                var styleOption = res.data.material_options[this.state.currentSelectedMaterialIndex].style_options[this.state.currentSelectedStyleOptionIndex];
                const sizeSlideMax = styleOption.maximal_side_length_mm;
                const sizeSlideMin = Math.ceil(Math.max(styleOption.aspect_ratio, 1/styleOption.aspect_ratio)*styleOption.minimal_side_length_mm);
                this.setState({ currentSelectedLongestSidePick: Math.ceil((sizeSlideMax+sizeSlideMin)/2)});
                
                // Save the sent information
                this.setState({ stickerData: res.data});
                // Update sticker image
                this.updateStickerImage();
                // Update sticker dimensions
                this.updateStickerDimensions();
                // Update sticker price
                this.updateStickerPrice();
            }
        });
    }

    onStickerAmountChange(value){
        // Set new amount of stickers and update sticker price
        this.setState({ currentStickerAmount: value},
            function(){
                this.updateStickerPrice();
            }
        );
    }

    onSizeSliderChange(value){
        // Save value
        this.setState({currentSelectedLongestSidePick: value});
        // Resize sticker
        this.updateStickerDimensions();
        this.updateStickerPrice();
    }

    onMaterialOptionClick(index){
        // Set current selected material option index
        this.setState({
            currentSelectedMaterialIndex: index,
            currentSelectedStyleOptionIndex: 0
        },
            function(){
                // Update image and price
                this.updateStickerImage();
                this.updateStickerDimensions();
                // Recalculate price
                this.updateStickerPrice();
            });
    }
    onStyleOptionClick(index){
        // Set current selected style option index
        this.setState({currentSelectedStyleOptionIndex: index}, 
            function(){
                // Update image
                this.updateStickerImage();
                this.updateStickerDimensions();
                // Recalculate price
                this.updateStickerPrice();
            });
    }
   
    render() {
        var stickerName = "";
        if (this.state.stickerData != null){
            // Set sticker name
            stickerName = this.state.stickerData.name;
        }

        return (
                <div    className='stickerPageContainerWrapper'
                        style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA,
                                color: GLOBAL_CONSTANTS.COLORS.colorB}}>
                    <Grid container justifyContent="center">  

                        <Grid xs = {12}>
                            <h2 style={{textAlign: 'center'}}
                                >{stickerName}</h2>
                        </Grid>

                        <Grid xs = {12} sm = {12} md = {6}>
                            <div className='stickerPageSideWrapper'>
                                <div className='stickerPageSide leftSideWrapper'>
                                    <div className='stickerImageCollection'>
                                        
                                        <CanvasHandler
                                            canvasContext={this.state.canvasContext}
                                            // Show only when both true
                                            imgPresentationBackgroundLoaded={this.state.imgPresentationBackgroundLoaded}
                                            imgPresentationStickerLoaded={this.state.imgPresentationStickerLoaded}
                                            // Pass images
                                            imgPresentationBackground={this.state.imgPresentationBackground}
                                            imgPresentationSticker={this.state.imgPresentationSticker}
                                            // Canvas parameters
                                            width={this.state.canvasWidth}
                                            height={this.state.canvasHeight}
                                            // For sticker logic
                                            stickerWidth={this.state.stickerWidth}
                                            stickerHeight={this.state.stickerHeight}
                                        />
                                        <canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight}></canvas>
                                    </div>
                                </div>
                            </div>
                        </Grid>

                        <Grid xs = {12} sm = {12} md = {6}>
                            <StickerPageOptions
                                currentSelectedMaterialIndex = {this.state.currentSelectedMaterialIndex}
                                currentSelectedStyleOptionIndex = {this.state.currentSelectedStyleOptionIndex}
                                currentSelectedLongestSidePick = {this.state.currentSelectedLongestSidePick}
                                currentStickerAmount = {this.state.currentStickerAmount}
                                currentStickerPrice = {this.state.currentStickerPrice}
                                stickerData = {this.state.stickerData}
                                // Size textfield
                                stickerWidthmm = {this.state.stickerWidthmm}
                                stickerHeightmm = {this.state.stickerHeightmm}
        
                                
                                onSizeSliderChange = {this.onSizeSliderChange}
                                onMaterialOptionClick = {this.onMaterialOptionClick}
                                onStyleOptionClick = {this.onStyleOptionClick}
                                onStickerAmountChange = {this.onStickerAmountChange}

                                // Handling favorites
                                favoriteStickersStyleOptionIds={this.props.favoriteStickersStyleOptionIds}
                                onAddStickerToFavorites={this.props.onAddStickerToFavorites}
                                onRemoveStickerFromFavorites={this.props.onRemoveStickerFromFavorites}
                                // Handling cart
                                onAddStickerToCart={this.props.onAddStickerToCart}
                            />
                        </Grid>
                    </Grid>
                </div>
        );
    }    
}

export default withRouter(StickerPage)
