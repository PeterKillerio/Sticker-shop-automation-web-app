import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

const getEditorPage = async function(){
    // API call: get editor page data, materials, options, cutouts
    let ret = null;

    await axios({
        method: 'get',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.get_editor_page,
        headers: {},
        validateStatus: () => true
    }).then(res => {
        console.log("Func_getEditorPage res: " + JSON.stringify(res))
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:Func_getEditorPage.js>: Invalid request")
        }else{
            // Valid request
            console.log("<INFO:Func_getEditorPage.js> Request valid")
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}

export default getEditorPage
