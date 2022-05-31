import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

const addCartSticker = async function(stickerStyleOptionId, amount, longestSidePick){
    // API call: add sticker to the user cart.
    // This function is used in different levels of the application and returns 
    // api server response.
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.add_cart_sticker,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token), },
        data: {
            sticker_style_option_id: stickerStyleOptionId,
            sticker_amount: amount,
            longest_side_pick: longestSidePick},
        validateStatus: () => true
    }).then(res => {
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:Func_addCartSticker.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:Func_addCartSticker.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}

export default addCartSticker
