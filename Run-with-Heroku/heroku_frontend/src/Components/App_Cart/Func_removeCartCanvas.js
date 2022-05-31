import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants';

const removeCartCanvas = async function(canvasCartItemId){
    // API call: remove sticker from the cart based on the current user
    // This function is used in different levels of the application and returns 
    // api server response
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.remove_cart_canvas,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token), },
        data: {canvas_cart_item_id: canvasCartItemId},
        validateStatus: () => true
    }).then(res => {
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:removeCartCanvas.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:removeCartCanvas.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}


export default removeCartCanvas
