import React from 'react';
import './App_Editor.css';

// Import constants
import * as GLOBAL_CONSTANTS from './../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import EditorPage from './App_EditorPage'

// Api functions
import getEditorPage from './Func_getEditorPage';
import addCartCanvas from './Func_addCartCanvas';

class Editor extends React.Component {
    /*  Main react component for editor page mainly defining
        functionality of its subcomponents  */

    constructor(props){
        super(props);
        this.state = {
            canvasAddToCartLoading: false,

            // Main editor data with materials, styles, cutout images
            editorData: null,
            currentSelectedCutoutIndex: 0,
            currentSelectedMaterialOptionIndex: 0,
            currentSelectedStyleOptionIndex: 0,
            longestSidePick: 0,
            sizeSliderMin: 0,
            sizeSliderMax: 0,
            orderAmount: 1,
            canvasPrice: 0,
            canvasTotalPrice: 0,
            
            //// Canvas
            lineWidth: 50,
            canvasMaxLength: 2000, // Max pixel density per side
            canvasWidth: 0, 
            canvasHeight: 0,
            // Canvas element width-height will depend on cutout image
            // and its aspect ratio and canvasElementMaxLength 
            canvasElementMaxLength: 600,
            canvasElementWidth: 0,
            canvasElementHeight: 0,
            canvasPreviousPositionX: 0,
            canvasPreviousPositionY: 0,
            // Image canvas
            uploadedImageURL: null,
            imageCanvasRef: React.createRef(),
            imageCanvasContext: null,
            // EraserDeeraser canvas
            eraserDeeraserCanvasRef: React.createRef(),
            eraserDeeraserCanvasContext: null,
            // PaintDepaint canvas
            paintDepaintCanvasRef: React.createRef(),
            paintDepaintCanvasContext: null,
            paintDepaintCanvasColor: "#E54B4B",
            //
            currentCanvasDimensionWidth: 50,
            currentCanvasDimensionHeight: 50,
            currentCanvasColorBackground: "#0000FF",

            longestImageDim: 0,
            shortestCanvasDim: 0,
            
            // Design image
            image: new Image(),
            imageLoaded: false,
            imageWidth: 0, // Pixel density
            imageHeight: 0,
            imageToOriginalImageScale: 0,
            imageToCanvasScale: 1, // Percentage (shortest image dim)/(longest canvas dim)
            imagePositionX: 0,
            imagePositionY: 0,
            imageRotation: 0, // Rotation in degrees
            
            //// Tools
            currentSelectedTool: LOCAL_CONSTANTS.CANVAS_TOOLS['MOVE_TOOL'],
            currentSelectedToolState: LOCAL_CONSTANTS.MOVE_TOOL_STATES['INACTIVE'],

            // Canvas events (empty functions by default)
            canvasOnMouseMove: () => {console.log("*** canvas on move empty");},
            canvasOnMouseDown: () => {console.log("*** canvas on down empty");},
            canvasOnMouseUp: () => {console.log("*** canvas on up empty");},
        };
        this.loadImage = this.loadImage.bind(this);
        this.onChangeLongestSidePick =  this.onChangeLongestSidePick.bind(this);
        this.onChangeOrderAmount =  this.onChangeOrderAmount.bind(this);
        this.recalculatePrice =  this.recalculatePrice.bind(this);
        this.onImageUpload =  this.onImageUpload.bind(this);
        this.onAddCanvasToCart =  this.onAddCanvasToCart.bind(this);
        
        //// Tools
        this.onChangeTool = this.onChangeTool.bind(this);
        // Move tool;
        this.moveToolOnMouseMove = this.moveToolOnMouseMove.bind(this);
        this.moveToolOnMouseDown = this.moveToolOnMouseDown.bind(this);
        this.moveToolOnMouseUp = this.moveToolOnMouseUp.bind(this);
        // Eraser tool
        this.eraserDeeraserToolOnMouseMove = this.eraserDeeraserToolOnMouseMove.bind(this);
        this.eraserDeeraserToolOnMouseDown = this.eraserDeeraserToolOnMouseDown.bind(this);
        this.eraserDeeraserToolOnMouseUp = this.eraserDeeraserToolOnMouseUp.bind(this);
        // Eraser tool
        this.paintDepaintToolOnMouseMove = this.paintDepaintToolOnMouseMove.bind(this);
        this.paintDepaintToolOnMouseDown = this.paintDepaintToolOnMouseDown.bind(this);
        this.paintDepaintToolOnMouseUp = this.paintDepaintToolOnMouseUp.bind(this);

        this.changeCanvasBackground = this.changeCanvasBackground.bind(this);
        this.changeBrushColor = this.changeBrushColor.bind(this);
        this.onChangeLineWidth = this.onChangeLineWidth.bind(this);
        this.onChangeImageScale = this.onChangeImageScale.bind(this);

        // Changing options
        this.onCanvasCutoutChange = this.onCanvasCutoutChange.bind(this);
        this.onCanvasMaterialChange = this.onCanvasMaterialChange.bind(this);
        this.onCanvasStyleChange = this.onCanvasStyleChange.bind(this);
    }

    componentDidMount(){
        // Initial api call for editor data + process cutouts + load image 
        this.onGetEditorPage();

        // Set default canvas event listeners for current selected tool
        this.setCurrentCanvasEventListeners();  
    }

    assignCanvasContexts(){
        this.setState({
            imageCanvasContext: this.state.imageCanvasRef.current.getContext("2d"),
            eraserDeeraserCanvasContext: this.state.eraserDeeraserCanvasRef.current.getContext("2d"),
            paintDepaintCanvasContext: this.state.paintDepaintCanvasRef.current.getContext("2d")
        });
    }

    onGetEditorPage(){
        // Uses imported API function core and adds own functionality for this component
        const scope = this;
        // Custom response function
        getEditorPage().then(function(ret){
            if (ret.status == 200){ // 200 OK status code
                scope.setState({ 
                    editorData: ret.data,
                },
                    ()=>{
                        // Calculate size limits for canvas in mm for size slider
                        scope.recalculateCanvasLimits();

                        // Assign contexts to canvases
                        scope.assignCanvasContexts();
                        
                        // Process cutout image on response
                        scope.processCutoutImage();
                    });
            }else{
                alert("Error with getting data for the editor, contact the maintainer");
            }
        });
    }

    onAddCanvasToCart(canvasStyleOptionId, canvasCutoutOptionId, amount, longestSidePick, backgroundColor, imageCanvasContext,  eraserDeeraserCanvasContext,  paintDepaintCanvasContext){
        // Uses imported API function core and adds own functionality for this component
        const scope = this;
        // Custom response function
        this.setState({canvasAddToCartLoading: true});
        addCartCanvas(canvasStyleOptionId, canvasCutoutOptionId, amount, longestSidePick, backgroundColor, imageCanvasContext, eraserDeeraserCanvasContext, paintDepaintCanvasContext).then(function(ret){
            scope.setState({canvasAddToCartLoading: false});
            if (ret.status == 200){ // 200 OK status code
                scope.props.updateCartStickers();
                alert("Canvas has been added to your cart")
            }else{
                alert("There has been an error with status code " + ret.status + ". Try again, if the problem persists, please contact the maintainer.");
            }   
        });
    }

    processCutoutImage(){
        // Process cutout image and assign canvases heights/widths accordingly

        var currentSelectedCutoutIndex = this.state.currentSelectedCutoutIndex;
        var currentSelectedCutoutAspectRatio = this.state.editorData.cutout_options[currentSelectedCutoutIndex].img_aspect_ratio;
        if (currentSelectedCutoutAspectRatio >= 1.0){
            this.setState({
                canvasWidth: this.state.canvasMaxLength, 
                canvasHeight: this.state.canvasMaxLength*(1/currentSelectedCutoutAspectRatio),

                canvasElementWidth: this.state.canvasElementMaxLength,
                canvasElementHeight: this.state.canvasElementMaxLength*(1/currentSelectedCutoutAspectRatio),
            });
        }else if(currentSelectedCutoutAspectRatio < 1.0){
            this.setState({
                canvasWidth: this.state.canvasMaxLength*currentSelectedCutoutAspectRatio, 
                canvasHeight: this.state.canvasMaxLength,

                canvasElementWidth: this.state.canvasElementMaxLength*currentSelectedCutoutAspectRatio,
                canvasElementHeight: this.state.canvasElementMaxLength,                
            });
        }
    }

    loadImage(){
        // Load uploaded image
        if(this.state.uploadedImageURL){
            this.state.image.src = this.state.uploadedImageURL;
            // Set callback function on loading sticker image
            const scope = this;
            this.state.image.onload = function() {
                scope.setState({
                    imageLoaded: true,
                });
                // Set initial image dimensions, position and draw
                scope.initialImageDimensionsPosition();
            }
        }
    }

    initialImageDimensionsPosition(){
        // Find the longest dimension of the uploaded image and scale the other dimension so that 
        // the image can fit the canvas, get the smallest dimension of the canvas too

        var longestImageDim = Math.max(this.state.image.width, this.state.image.height);
        var shortestCanvasDim = Math.min(this.state.canvasWidth, this.state.canvasHeight);
        this.setState({
            longestImageDim: longestImageDim,
            shortestCanvasDim: shortestCanvasDim
        });

        var scale = this.state.imageToCanvasScale*(shortestCanvasDim/longestImageDim);

        // Set new image dimensions
        var new_image_w = Math.round(this.state.image.width*scale);
        var new_image_h = Math.round(this.state.image.height*scale);
        this.setState({
            imageToOriginalImageScale: scale,
            // Set new dimension
            imageWidth: new_image_w,
            imageHeight: new_image_h,
            // Set new center position
            imagePositionX: Math.round(this.state.canvasWidth/2) - Math.ceil(new_image_w/2),
            imagePositionY: Math.round(this.state.canvasHeight/2) - Math.ceil(new_image_h/2),
        });

        // Clear canvas and redraw the image
        this.clearCanvas();
        this.redrawImageOnCanvas();
    }

    clearCanvas(){
        // Make canvas empty
        this.state.imageCanvasContext.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    redrawImageOnCanvas(){        
        // Draw uploaded image
        this.state.imageCanvasContext.globalCompositeOperation="source-over";
        this.state.imageCanvasContext.drawImage(this.state.image,this.state.imagePositionX,this.state.imagePositionY,this.state.imageWidth,this.state.imageHeight);
        // Use eraser canvas to remove pixels from the sticker image
        this.state.imageCanvasContext.globalCompositeOperation="destination-out";
        this.state.imageCanvasContext.drawImage(this.state.eraserDeeraserCanvasContext.canvas, this.state.imagePositionX, this.state.imagePositionY, Math.round(this.state.canvasWidth*this.state.imageToCanvasScale),Math.round(this.state.canvasHeight*this.state.imageToCanvasScale));
        // On top of that, add paint layer
        this.state.imageCanvasContext.globalCompositeOperation="source-over"; 
        this.state.imageCanvasContext.drawImage(this.state.paintDepaintCanvasContext.canvas,0,0,this.state.canvasWidth,this.state.canvasHeight);
    }

    onChangeImageScale(imageToCanvasScale){
        // Recalculates image dimensions after user changes image scale

        var imageToOriginalImageScale = imageToCanvasScale*(this.state.shortestCanvasDim/this.state.longestImageDim);
        this.setState({
            imageToCanvasScale: imageToCanvasScale,
            imageToOriginalImageScale: imageToOriginalImageScale,
        }, () => {
            // Set new image dimensions
            this.setState({
                imageWidth: Math.round(this.state.image.width*imageToOriginalImageScale),
                imageHeight: Math.round(this.state.image.height*imageToOriginalImageScale)
            }, () => {
                this.clearCanvas();
                this.redrawImageOnCanvas(); 
            });
        });
    }

    // TOOLS //
    // Move tool:
    // Moving the image on the canvas will work so that after clicking
    // we are in the state to move/redraw the image on every move and thus adding 
    // event listener on mousemove. On mouse up we will remove the event listener
    moveToolOnMouseDown(event){
        // Activate the move tool
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.MOVE_TOOL_STATES['ACTIVE'],
        }, () => {
            this.setCurrentCanvasEventListeners();
        });
    }
    moveToolOnMouseMove(event){
        var trueCanvasPosition = this.getTrueCanvasPosition(event);
        var x = trueCanvasPosition[0];
        var y = trueCanvasPosition[1];

        this.setState({
            // Center image position
            imagePositionX: x - Math.round(this.state.imageWidth/2),
            imagePositionY: y - Math.round(this.state.imageHeight/2),
        },() => {
            this.clearCanvas();
            this.redrawImageOnCanvas();
        });
    }
    moveToolOnMouseUp(){
        // Deactivate the move tool
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.MOVE_TOOL_STATES['INACTIVE']
        }, () => {
            this.setCurrentCanvasEventListeners();
        });
    }
    // Eraser + deeraser tool:
    eraserDeeraserToolOnMouseDown(event){
        var trueFollowingDrawCanvasPosition = this.getTrueFollowingDrawCanvasPosition(event);
        var x = trueFollowingDrawCanvasPosition[0];
        var y = trueFollowingDrawCanvasPosition[1];

        // Eraser vs Deeraser
        if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']){
            this.drawLineToCanvas(  this.state.eraserDeeraserCanvasContext,
                [x, y],[x, y],
                "source-over", "rgba(0,0,0,1)",
                this.state.lineWidth
            );
        }else if(this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL']){
            this.drawLineToCanvas(  this.state.eraserDeeraserCanvasContext,
                [x, y],[x, y],
                "destination-out", "rgba(0,0,0,1)",
                this.state.lineWidth
            );
        }
        
        this.redrawImageOnCanvas();

        // Activate eraser/deeraser, save previous position, set events to canvas
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.ERASER_DEERASER_TOOL_STATES['ACTIVE'],
            canvasPreviousPositionX: x, canvasPreviousPositionY: y
        }, () => {
            this.setCurrentCanvasEventListeners(); 
        });
    }
    eraserDeeraserToolOnMouseMove(event){
        if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.ERASER_DEERASER_TOOL_STATES['ACTIVE']){

            var trueFollowingDrawCanvasPosition = this.getTrueFollowingDrawCanvasPosition(event);
            var x = trueFollowingDrawCanvasPosition[0]; // - scaled image/drawcanvas 
            var y = trueFollowingDrawCanvasPosition[1];
            
            // Draw with Eraser vs Deeraser
            if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']){
                this.drawLineToCanvas(  this.state.eraserDeeraserCanvasContext,
                    [this.state.canvasPreviousPositionX, this.state.canvasPreviousPositionY],[x, y],
                    "source-over", "rgba(0,0,0,1)",
                    this.state.lineWidth
                );
            }else if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL']){
                this.drawLineToCanvas(  this.state.eraserDeeraserCanvasContext,
                    [this.state.canvasPreviousPositionX, this.state.canvasPreviousPositionY],[x, y],
                    "destination-out", "rgba(0,0,0,1)",
                    this.state.lineWidth
                );
            }

            this.clearCanvas();
            this.redrawImageOnCanvas();
            // Save previous position
            this.setState({
                canvasPreviousPositionX: x,
                canvasPreviousPositionY: y
            });  
        }else if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.ERASER_DEERASER_TOOL_STATES['INACTIVE']){
            // Canvas real position is different because element dimensions are different
            var trueCanvasPosition = this.getTrueCanvasPosition(event);
            var x = trueCanvasPosition[0];
            var y = trueCanvasPosition[1];

            this.clearCanvas();
            this.redrawImageOnCanvas();

            this.drawLineToCanvas(  this.state.imageCanvasContext,
                [x, y],[x, y],
                "source-over", "rgba(255,0,0,0.5)",
                this.state.lineWidth*(this.state.imageToCanvasScale)
            );
        }
    }
    eraserDeeraserToolOnMouseUp(){
        // Deactivate the eraser tool and set canvas event listeners
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.ERASER_DEERASER_TOOL_STATES['INACTIVE']
        }, () => {
            this.setCurrentCanvasEventListeners();
        });
    }
    // Paint + Depaint tool:
    paintDepaintToolOnMouseDown(event){
        var trueCanvasPosition = this.getTrueCanvasPosition(event);
        var x = trueCanvasPosition[0];
        var y = trueCanvasPosition[1];

        // Paint vs Depaint
        if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL']){
            this.drawLineToCanvas(  this.state.paintDepaintCanvasContext,
                [x, y],[x, y],
                "source-over", this.state.paintDepaintCanvasColor,
                this.state.lineWidth
            );
        }else if(this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL']){
            this.drawLineToCanvas(  this.state.paintDepaintCanvasContext,
                [x, y],[x, y],
                "destination-out", "rgba(0,0,0,1)",
                this.state.lineWidth
            );
        }
        
        this.redrawImageOnCanvas();
        // Activate paint/depaint, save previous position, set events to canvas
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.PAINT_DEPAINT_TOOL_STATES['ACTIVE'],
            canvasPreviousPositionX: x, canvasPreviousPositionY: y
        }, () => {
            this.setCurrentCanvasEventListeners(); 
        });
    }
    paintDepaintToolOnMouseMove(event){
        if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.PAINT_DEPAINT_TOOL_STATES['ACTIVE']){

            var trueCanvasPosition = this.getTrueCanvasPosition(event);
            var x = trueCanvasPosition[0];
            var y = trueCanvasPosition[1];
            
            // Draw with Paint vs Depaint
            if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL']){
                this.drawLineToCanvas(  this.state.paintDepaintCanvasContext,
                    [this.state.canvasPreviousPositionX, this.state.canvasPreviousPositionY],[x, y],
                    "source-over", this.state.paintDepaintCanvasColor,
                    this.state.lineWidth
                );
            }else if (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL']){
                this.drawLineToCanvas(  this.state.paintDepaintCanvasContext,
                    [this.state.canvasPreviousPositionX, this.state.canvasPreviousPositionY],[x, y],
                    "destination-out", "rgba(0,0,0,1)",
                    this.state.lineWidth
                );
            }

            this.clearCanvas();
            this.redrawImageOnCanvas();
            // Save previous position
            this.setState({
                canvasPreviousPositionX: x,
                canvasPreviousPositionY: y
            });  
        }else if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.PAINT_DEPAINT_TOOL_STATES['INACTIVE']){
            // Canvas real position is different because element dimensions are different
            var trueCanvasPosition = this.getTrueCanvasPosition(event);
            var x = trueCanvasPosition[0];
            var y = trueCanvasPosition[1];

            this.clearCanvas();
            this.redrawImageOnCanvas();

            this.drawLineToCanvas(  this.state.imageCanvasContext,
                [x, y],[x, y],
                "source-over", "rgba(255,0,0,0.5)",
                this.state.lineWidth
            );
        }
    }
    changeBrushColor(event){
        this.setState({paintDepaintCanvasColor: event.target.value});
    }

    paintDepaintToolOnMouseUp(){
        // Deactivate the eraser tool and set canvas event listeners
        this.setState({
            currentSelectedToolState: LOCAL_CONSTANTS.PAINT_DEPAINT_TOOL_STATES['INACTIVE']
        }, () => {
            this.setCurrentCanvasEventListeners();
        });
    }

    getTrueCanvasPosition(event){
        // Canvas element has different 'real' displayed resolution than the internal one
        var rect = event.currentTarget.getBoundingClientRect();
        // Canvas real position is different because element is different
        var scale_x = this.state.canvasWidth/this.state.canvasElementWidth;
        var scale_y = this.state.canvasHeight/this.state.canvasElementHeight;
        var x = scale_x*(event.clientX - rect.left);
        var y = scale_y*(event.clientY - rect.top);
        return [x,y]
    }
    getTrueFollowingDrawCanvasPosition(event){
        // Get position on the drawing canvas so that it will overlap image
        // even though it is scaled to cover the image (with aspect ratio 1) 
        var trueCanvasPosition = this.getTrueCanvasPosition(event);
        var x = (trueCanvasPosition[0]-(this.state.imagePositionX))*(1/this.state.imageToCanvasScale);
        var y = (trueCanvasPosition[1]-(this.state.imagePositionY))*(1/this.state.imageToCanvasScale);
        return [x,y]
    }

    drawLineToCanvas(canvasContext, fromXY, whereXY, globalCompositeOperation, color, lineWidth){
        canvasContext.beginPath();
        canvasContext.globalCompositeOperation=globalCompositeOperation;
        canvasContext.strokeStyle =  color;
        canvasContext.lineCap = "round";
        canvasContext.lineJoin = "round";
        canvasContext.lineWidth = lineWidth;
        
        canvasContext.moveTo(fromXY[0], fromXY[1]);
        canvasContext.lineTo(whereXY[0], whereXY[1]);
        canvasContext.stroke();
        canvasContext.globalCompositeOperation="source-over";
    }
    
    setCurrentCanvasEventListeners(){
        // Reset all event listeners first
        this.resetCanvasEventListeners();

        // Current active tool-based and tool-state-based assigment
        if(this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['MOVE_TOOL']){
            if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.MOVE_TOOL_STATES['INACTIVE']){
                this.setState({
                    canvasOnMouseMove: () => {},
                    canvasOnMouseDown: this.moveToolOnMouseDown,
                    canvasOnMouseUp: this.moveToolOnMouseUp,
                });
            }else if(this.state.currentSelectedToolState == LOCAL_CONSTANTS.MOVE_TOOL_STATES['ACTIVE']){
                this.setState({
                    canvasOnMouseMove: this.moveToolOnMouseMove,
                    canvasOnMouseDown: this.moveToolOnMouseDown,
                    canvasOnMouseUp: this.moveToolOnMouseUp,
                });
            }
        }else if((this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['ERASER_TOOL']) || 
                (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEERASER_TOOL'])){
            this.setState({
                canvasOnMouseMove: this.eraserDeeraserToolOnMouseMove,
                canvasOnMouseDown: this.eraserDeeraserToolOnMouseDown,
                canvasOnMouseUp: this.eraserDeeraserToolOnMouseUp,
            });
        }else if((this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['PAINT_TOOL']) || 
        (this.state.currentSelectedTool == LOCAL_CONSTANTS.CANVAS_TOOLS['DEPAINT_TOOL'])){
            this.setState({
                canvasOnMouseMove: this.paintDepaintToolOnMouseMove,
                canvasOnMouseDown: this.paintDepaintToolOnMouseDown,
                canvasOnMouseUp: this.paintDepaintToolOnMouseUp,
            });
        }
    }

    resetCanvasEventListeners(){
        this.setState({
            canvasOnMouseMove: () => {},
            canvasOnMouseDown: () => {},
            canvasOnMouseUp: () => {},
        });
    }

    changeCanvasBackground(event){
        this.setState({currentCanvasColorBackground: event.target.value});
    }
    onCanvasCutoutChange(index){
        this.setState({
            currentSelectedCutoutIndex: index
        },() => {
            // Process cutout image on response
            this.processCutoutImage();
                        
            // Load image -> after -> initial dimensions, position and draw too
            this.loadImage();

            // Recalculate canvas dimensions
            this.recalculateCanvasRealDimensions();
        });
    }
    onCanvasMaterialChange(index){
        this.setState({
            currentSelectedMaterialOptionIndex: index,
            currentSelectedStyleOptionIndex: 0
        }, this.recalculateCanvasRealDimensions());
    }
    onCanvasStyleChange(index){
        this.setState({
            currentSelectedStyleOptionIndex: index,
        }, this.recalculateCanvasRealDimensions());
    }
    onChangeTool(toolName){
        // console.log("toolname: " + toolName);
        this.setState({
            currentSelectedTool: LOCAL_CONSTANTS.CANVAS_TOOLS[toolName]
        }, this.setCurrentCanvasEventListeners);
    }
    onChangeLineWidth(value){
        this.setState({
            lineWidth: value
        });
    }
    onChangeLongestSidePick(longestSidePick){
        this.setState({longestSidePick: longestSidePick}, 
            () => this.recalculateCanvasLimits());
    }
    onChangeOrderAmount(value){
        this.setState({
            orderAmount: value
        }, ()=> this.recalculatePrice());
    } 
    onImageUpload(event){
        const file = event.target.files[0];

        const imageURL = URL.createObjectURL(file);
        this.setState({
            uploadedImageURL: imageURL
        }, () => this.loadImage() );
    }

    recalculateCanvasLimits(){
        // After user changes cutout image we have to recalculate allowed canvas size dimensions (limits)

        // Check and recalculate limits and longest side pick
        var longestSidePick_var = this.state.longestSidePick;
        // Calculations for slider limits
        var currentSelectedStyleOption = this.state.editorData.material_options[this.state.currentSelectedMaterialOptionIndex].style_options[this.state.currentSelectedStyleOptionIndex];
        var cutoutAspectRatio = this.state.editorData.cutout_options[this.state.currentSelectedCutoutIndex].img_aspect_ratio;
        // Min and max slide size picker values
        const sizeSliderMax = currentSelectedStyleOption.maximal_side_length_mm;
        // What would be min for largest side if we set our smallest side to min
        const sizeSliderMin = Math.ceil(Math.max(cutoutAspectRatio, 1/cutoutAspectRatio)*currentSelectedStyleOption.minimal_side_length_mm);
        // Change longest side pick if its smaller/bigger than these limits
        if((longestSidePick_var < sizeSliderMin) || (longestSidePick_var > sizeSliderMax)){
            longestSidePick_var = Math.ceil((sizeSliderMin+sizeSliderMax)/2)
        }
        this.setState({
            sizeSliderMin: sizeSliderMin,
            sizeSliderMax: sizeSliderMax,
            longestSidePick: longestSidePick_var
        }, () => {
            this.recalculateCanvasRealDimensions();
            this.recalculatePrice();
        })
    }

    recalculateCanvasRealDimensions(){
        // After new canvas limits are received, canvas 'real' dimensions are recalculated as we also changed
        // the aspect ratio of the final sticker 

        var cutoutAspectRatio = this.state.editorData.cutout_options[this.state.currentSelectedCutoutIndex].img_aspect_ratio;

        // Recalculate canvas real width and height dimensions based on current picked longest side
        let currentCanvasDimensionWidth = 0;
        let currentCanvasDimensionHeight = 0;
        if(cutoutAspectRatio >= 1){
            currentCanvasDimensionWidth = this.state.longestSidePick;
            currentCanvasDimensionHeight = this.state.longestSidePick/cutoutAspectRatio;
        }else{
            currentCanvasDimensionWidth = (this.state.longestSidePick)*cutoutAspectRatio;
            currentCanvasDimensionHeight = this.state.longestSidePick;
        }
        this.setState({
            currentCanvasDimensionWidth: Math.round((currentCanvasDimensionWidth + Number.EPSILON) * 100) / 100,
            currentCanvasDimensionHeight: Math.round((currentCanvasDimensionHeight + Number.EPSILON) * 100) / 100,
        }, () => this.recalculatePrice());
    }

    recalculatePrice(){
        var currentSelectedStyleOption = this.state.editorData.material_options[this.state.currentSelectedMaterialOptionIndex].style_options[this.state.currentSelectedStyleOptionIndex];
        const currentSelectedPriceParameter = currentSelectedStyleOption.price_parameter;
        var canvasPrice = currentSelectedPriceParameter*this.state.longestSidePick;
        this.setState({
            canvasPrice: Math.round((canvasPrice + Number.EPSILON) * 100) / 100,
            canvasTotalPrice: Math.round((this.state.orderAmount*canvasPrice + Number.EPSILON) * 100) / 100
        });
    }


    render() { 
        if(this.state.editorData != null){
            return(
                <div>
                    <EditorPage
                        canvasAddToCartLoading = {this.state.canvasAddToCartLoading}

                        canvasElementWidth = {this.state.canvasElementWidth}
                        canvasElementHeight = {this.state.canvasElementHeight}                    
                        currentCanvasColorBackground = {this.state.currentCanvasColorBackground}
                        lineWidth = {this.state.lineWidth}
                        paintDepaintCanvasColor = {this.state.paintDepaintCanvasColor}
                        canvasWidth = {this.state.canvasWidth}
                        canvasHeight = {this.state.canvasHeight}
                        currentCanvasDimensionWidth = {this.state.currentCanvasDimensionWidth}
                        currentCanvasDimensionHeight = {this.state.currentCanvasDimensionHeight}
                        imageToCanvasScale = {this.state.imageToCanvasScale}

                        imageCanvasContext = {this.state.imageCanvasContext}
                        eraserDeeraserCanvasContext = {this.state.eraserDeeraserCanvasContext}
                        paintDepaintCanvasContext = {this.state.paintDepaintCanvasContext} 
                        
                        longestSidePick = {this.state.longestSidePick}
                        sizeSliderMin = {this.state.sizeSliderMin}
                        sizeSliderMax = {this.state.sizeSliderMax}
                        orderAmount = {this.state.orderAmount}
                        canvasTotalPrice = {this.state.canvasTotalPrice}
                        canvasPrice = {this.state.canvasPrice}

                        editorData = {this.state.editorData}
                        currentSelectedCutoutIndex = {this.state.currentSelectedCutoutIndex}
                        currentSelectedMaterialOptionIndex = {this.state.currentSelectedMaterialOptionIndex}
                        currentSelectedStyleOptionIndex = {this.state.currentSelectedStyleOptionIndex}
                        // Tool
                        currentSelectedTool = {this.state.currentSelectedTool}
                        currentSelectedToolState = {this.state.currentSelectedToolState}
                        onChangeTool = {this.onChangeTool}

                        onCanvasCutoutChange = {this.onCanvasCutoutChange}
                        onCanvasMaterialChange = {this.onCanvasMaterialChange}
                        onCanvasStyleChange = {this.onCanvasStyleChange}
    
                        canvasOnMouseDown = {this.state.canvasOnMouseDown}
                        canvasOnMouseUp = {this.state.canvasOnMouseUp}
                        canvasOnMouseMove = {this.state.canvasOnMouseMove}
                        changeCanvasBackground = {this.changeCanvasBackground}
                        onChangeLineWidth = {this.onChangeLineWidth}
                        changeBrushColor = {this.changeBrushColor}
                        onChangeImageScale = {this.onChangeImageScale}
                        onChangeLongestSidePick = {this.onChangeLongestSidePick}
                        onChangeOrderAmount = {this.onChangeOrderAmount}
                        onImageUpload = {this.onImageUpload}
                        onAddCanvasToCart = {this.onAddCanvasToCart}
    
                        imageCanvasRef = {this.state.imageCanvasRef}
                        eraserDeeraserCanvasRef = {this.state.eraserDeeraserCanvasRef}
                        paintDepaintCanvasRef = {this.state.paintDepaintCanvasRef}
                    />      
                </div>
            );
        }else{
            return(null);
        }
        
    }
}

export default Editor