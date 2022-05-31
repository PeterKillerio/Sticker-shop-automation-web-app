import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

const getCartStickers = async function(){
    // API call: get cart stickers based on the current user
    // This function is used in different levels of the application and returns 
    // api server response
    let ret = null;

    await axios({
        method: 'get',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.get_cart_stickers,
        headers: {
            Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token),
        },
        validateStatus: () => true
    }).then(res => {
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:App_getCartStickers.js>: Invalid request.")
        }else{
            // Valid request
            console.log("<INFO:App_getCartStickers.js> Access token is valid.")
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}

export default getCartStickers
