import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

const addCartCanvas = async function(canvasStyleOptionId, canvasCutoutOptionId, amount, longestSidePick, backgroundColor, imageCanvasContext, eraserDeeraserCanvasContext, paintDepaintCanvasContext){
    // API call: add canvas to the user cart.
    // This function is used in different levels of the application and returns 
    // api server response.
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.add_cart_canvas,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token), },
        data: {
            canvas_style_option_id: canvasStyleOptionId,
            canvas_cutout_option_id: canvasCutoutOptionId,
            canvas_amount: amount,
            background_color: backgroundColor,
            longest_side_pick: longestSidePick,
            image_canvas: imageCanvasContext.canvas.toDataURL(),
            eraser_deeraser_canvas: eraserDeeraserCanvasContext.canvas.toDataURL(),
            paint_depaint_canvas: paintDepaintCanvasContext.canvas.toDataURL()
        },
            
        validateStatus: () => true
    }).then(res => {
        console.log("Func_addCartCanvas.js res: " + JSON.stringify(res))
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:Func_addCartCanvas.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:Func_addCartCanvas.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}

export default addCartCanvas
