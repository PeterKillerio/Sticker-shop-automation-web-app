import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants';

const removeCartSticker = async function(stickerCartItemId){
    // API call: remove sticker from the cart based on the current user
    // This function is used in different levels of the application and returns 
    // api server response
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.remove_cart_sticker,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token), },
        data: {sticker_cart_item_id: stickerCartItemId},
        validateStatus: () => true
    }).then(res => {
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:removeCartSticker.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:removeCartSticker.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}


export default removeCartSticker
