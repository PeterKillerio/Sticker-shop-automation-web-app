import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

const createOrder = async function(full_name, email, country, street, city, postal_code, telephone_number, information_for_delivery){
    // API call: create user order.
    // This function is used in different levels of the application and returns 
    // api server response.
    let ret = null;

    await axios({
        method: 'post',
        url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                LOCAL_CONSTANTS.API_CALL_URLS.create_order,
        headers: { Authorization: "Bearer " + localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token) },
        data: {
            full_name: full_name,
            email: email,
            country: country,
            street: street,
            city: city,
            postal_code: postal_code,
            telephone_number: telephone_number,
            information_for_delivery: information_for_delivery
        },
        validateStatus: () => true
    }).then(res => {
        console.log("Func_createOrder.js res: " + JSON.stringify(res))
        if (res.status != 200){
            // Invalid request
            console.log("<WARNING:Func_createOrder.js>: Invalid request.");
        }else{
            // Valid request
            console.log("<INFO:Func_createOrder.js> Access token is valid.");
        }
        ret = res;
    });

    // Return after axios finished
    return ret;
}

export default createOrder
