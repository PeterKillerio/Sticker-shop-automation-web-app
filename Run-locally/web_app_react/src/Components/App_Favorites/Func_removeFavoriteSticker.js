import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants';

const removeFavoriteSticker = async function(stickerStyleOptionId){
    // API call: remove favorite sticker based on the current user
    // This function is used in different levels of the application and returns 
    // api server response
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.remove_favorite_sticker,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token), },
        data: {sticker_style_option_id: stickerStyleOptionId},
        validateStatus: () => true
    }).then(res => {
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:removeFavoriteSticker.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:removeFavoriteSticker.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}


export default removeFavoriteSticker
