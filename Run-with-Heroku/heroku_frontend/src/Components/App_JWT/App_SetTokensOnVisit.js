import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

class SetTokensOnVisit extends React.Component{
    /*  Component responsible for token setting, reseting, refreshing (JWT)
        on page visit */

    constructor(props) {
        super(props)
        this.VerifyAccessTokenSTATE = this.VerifyAccessTokenSTATE.bind(this);
        this.AskForNewAccessTokenSTATE = this.AskForNewAccessTokenSTATE.bind(this);
        this.CreateAndSetTempUserSTATE = this.CreateAndSetTempUserSTATE.bind(this);
    }

    VerifyAccessTokenSTATE(){
        axios({
            method: 'post',
            url: GLOBAL_CONSTANTS.API_CALL_BASE_URL + LOCAL_CONSTANTS.API_CALL_URLS.verify_access_token,
            headers: {}, 
            data: {
                token: localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token),
            },
            validateStatus: () => true
        }).then(res => {
            console.log("access_token: " + JSON.stringify(res, null, 2))
            if (res.status != 200 || res.code == "token_not_valid"){
                // Ask for new  access token using refresh token
                console.log("<WARNING:App_SetTokensOnVisit.js>: Access token is invalid. Asking for new access token using refesh token.") 
                this.AskForNewAccessTokenSTATE();
            }else{
                // Access token is valid
                console.log("<INFO:App_SetTokensOnVisit.js> Access token is valid.")
            }
        });
    }

    AskForNewAccessTokenSTATE(){
        axios({
            method: 'post',
            url: GLOBAL_CONSTANTS.API_CALL_BASE_URL + LOCAL_CONSTANTS.API_CALL_URLS.get_new_access_token,
            headers: {}, 
            data: {
                refresh: localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token),
            },
            validateStatus: () => true
        }).then(res => {
            console.log("Refresh token: " + JSON.stringify(res, null, 2))
            if (res.status != 200 || res.code == "token_not_valid"){
                // Refresh token is invalid, set tokens for temp user and refresh
                console.log("<WARNING:App_SetTokensOnVisit.js>: Refresh token is invalid. Removing tokens. Setting temp user and refershing page.");
                localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token);
                localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token);
                this.CreateAndSetTempUserSTATE();
                window.location.reload(false);
            }else{
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token, res.data.access);
                console.log("<INFO:App_SetTokensOnVisit.js> Refresh token is valid, received new access token.");
            }
        });
    }

    CreateAndSetTempUserSTATE(){
        axios({
            method: 'get',
            url: GLOBAL_CONSTANTS.API_CALL_BASE_URL + LOCAL_CONSTANTS.API_CALL_URLS.get_new_temp_user_tokens,
            headers: {}, 
            data: {},
            validateStatus: () => true
        }).then(res => {
            console.log("CreateAndSetTempUser: " + JSON.stringify(res))
            if (res.status == 200){
                // Save the tokens to local storage
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token, res.data[0].access);
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token, res.data[0].refresh);
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.is_temp, true);
                console.log("<INFO:App_SetTokensOnVisit.js> Tokens for temp user has been saved.")
            }else{
                // Report error
                console.log("<ERROR:App_SetTokensOnVisit.js>: Wrong status code. Tokens for temp user couldn't be set.")
            }
        });
    }

    render(){
        // See 'page visit' diagram/FSM
        const access = localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token);
        const refresh = localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token);

        // Check if user has both access and refersh tokens set
        if ((access == null) || (refresh == null)){ // User is missing tokens, set new tokens for temp user
            console.log("<WARNING:App_SetTokensOnVisit.js> User is missing tokens. Setting new tokens for temp user.")
            this.CreateAndSetTempUserSTATE();
            
        }else{ // User has tokens, verifying access token
            console.log("<INFO:App_SetTokensOnVisit.js> User has tokens. Veryfying access token.")
            this.VerifyAccessTokenSTATE();
        }

        return(null);
    }
}

export default SetTokensOnVisit