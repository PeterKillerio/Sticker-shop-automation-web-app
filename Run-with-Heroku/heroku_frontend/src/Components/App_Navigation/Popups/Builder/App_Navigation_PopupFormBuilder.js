import React from 'react';
import './App_Navigation_PopupFormBuilder.css';
import axios from 'axios';

// MUI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Import constants
import * as GLOBAL_CONSTANTS from '../../../../GlobalConstants'
import * as LOCAL_CONSTANTS from '../../LocalContants'

// Popups by type
class PopupFormBuilder extends React.Component{
    /* Contains description of popups for login, registration and password change */

    constructor(props){
        super(props);
        this.state = {
            type: props.type,

            onCloseClick: props.onCloseClick,
            onForgotPasswordClick: props.onForgotPasswordClick,

            popupErrorInfoText: "",
            popupErrorUsername: "",
            popupErrorEmail: "",
            popupErrorPassword: "",

            // Form handling data
            username: '', // used to represent username & email (for login)
            email: '',
            password: '',

            // Registration-relevant
            onSuccessfulRegistration: props.onSuccessfulRegistration,
        };
        this.loginSubmit = this.loginSubmit.bind(this);
        this.changePopupErrorText = this.changePopupErrorText.bind(this);

    }

    handleInputChange(event, stateName) { this.setState({[stateName]:event.target.value});  console.log("!!!!!!!"+ stateName);}

    changePopupErrorText(errorVariable, text){
        this.setState({[errorVariable]: text});
        return(null);
    }
    resetPopupErrorTexts(){
        this.setState({ popupErrorInfoText: "",
                        popupErrorUsername: "",
                        popupErrorEmail: "",
                        popupErrorPassword: ""});
        return(null);
    }

    loginSubmit(event){
        event.preventDefault();

        axios({
            method: 'post',
            url: GLOBAL_CONSTANTS.API_CALL_BASE_URL + LOCAL_CONSTANTS.API_CALL_URLS.login_call,
            headers: {}, 
            data: {
                email: this.state.username,
                password: this.state.password,
            },
            validateStatus: () => true
        }).then(res => {
            console.log("Login: " + JSON.stringify(res, null, 2));
            if ((res.status != 200 && res.status != 201) || res.code == "token_not_valid"){
                console.log("<ERROR:App_SetTokensOnVisit.js>: Login is invalid.");
                // Inform user
                this.changePopupErrorText("popupErrorInfoText", res.data.non_field_errors);

            }else{ // Valid login
                // Set tokens, temp_user variable
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token, res.data.access);
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token, res.data.refresh);
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.is_temp, false);
                console.log("<INFO:App_Navigation_PopupFormBuilder.js> Valid login.");
                // Save username
                localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.username, res.data.username);

                window.location.reload(); // Reload site
            }
        });
    }

    registerSubmit(event){
        event.preventDefault();

        axios({
            method: 'post',
            url: GLOBAL_CONSTANTS.API_CALL_BASE_URL + LOCAL_CONSTANTS.API_CALL_URLS.register_call,
            headers: {}, 
            data: {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
            },
            validateStatus: () => true
        }).then(res => {
            console.log("Register: " + JSON.stringify(res));
            if ((res.status != 200 && res.status != 201) || res.code == "token_not_valid"){
                console.log("<ERROR:App_SetTokensOnVisit.js>: Registration is invalid.");

                // Set error messages appropriatelly 
                if (res.data.username){this.changePopupErrorText("popupErrorUsername", res.data.username);}
                if (res.data.email){this.changePopupErrorText("popupErrorEmail", res.data.email);}
                if (res.data.password){this.changePopupErrorText("popupErrorPassword", res.data.password);}

                // Inform user
                this.changePopupErrorText("popupErrorInfoText", res.data.non_field_errors);
            }else{ // Valid registration
                console.log("<INFO:App_Navigation_PopupFormBuilder.js> Valid registration.");
                // Close registartion window, open login window
                this.state.onSuccessfulRegistration();
            }
        });
    }
    
    render(){
        // Each popup has its own return function
        if (this.state.type == "login"){
            return(
                <Grid   className='popupOuterContainer' 
                        container 
                        justifyContent="center" 
                        alignItems="center"
                        style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}
                        >
        
                    <Grid xs={12} className='popupInnerContainerWrapper'> 
                        <form onSubmit={(event) => { this.loginSubmit(event); this.resetPopupErrorTexts(); }}>
                            <Grid   className='popupInnerContainer' container
                                    style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}>
        
                                <div className='closePopupButton'>
                                    <IconButton onClick={this.state.onCloseClick} style={{color: "inherit"}} size='large' aria-label="delete">
                                        <ion-icon name="close-outline"></ion-icon>
                                    </IconButton>
                                </div> 
        
                                <Grid xs={12}> 
                                    <h3>login</h3>
                                </Grid>
                                
        
                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="username/email"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"username")}
                                        />
                                    </div>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField 
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="password" 
                                            variant="outlined"
                                            type="password"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"password")}
                                            />
                                    </div>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <Button onClick={this.state.onForgotPasswordClick} variant="text">
                                        forgot password?
                                    </Button>
                                </Grid>

                                {/* Inform user on invalid login */}
                                <Grid xs={12}> 
                                    <p  className='popupErrorInfoText' 
                                        style={{color: GLOBAL_CONSTANTS.COLORS.colorC}}>
                                        {this.state.popupErrorInfoText}
                                    </p>
                                </Grid>

                                <Grid xs={12}>
                                    <Button variant="text"
                                        style={{border: '1px solid ' + GLOBAL_CONSTANTS.COLORS.colorB}}
                                        type="submit">
                                        login
                                    </Button>
                                    
                                </Grid>
        
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );
        }else if (this.state.type == "register"){
            return(
                <Grid   className='popupOuterContainer' 
                        container 
                        justifyContent="center" 
                        alignItems="center"
                        style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}
                        >
        
                    <Grid xs={12} className='popupInnerContainerWrapper'> 
                        <form onSubmit={(event) => { this.registerSubmit(event); this.resetPopupErrorTexts(); }}>
                            <Grid   className='popupInnerContainer' container
                                    style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}>
        
                                <div className='closePopupButton'>
                                    <IconButton onClick={this.state.onCloseClick} style={{color: "inherit"}} size='large' aria-label="delete">
                                        <ion-icon name="close-outline"></ion-icon>
                                    </IconButton>
                                </div> 
        
                                <Grid xs={12}> 
                                    <h3>register</h3>
                                </Grid>

                                {/* Inform user on invalid username */}
                                <Grid xs={12}> 
                                    <p  className='popupErrorInfoText' 
                                        style={{color: GLOBAL_CONSTANTS.COLORS.colorC, textAlign: 'center'}}>
                                        {this.state.popupErrorUsername}
                                    </p>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="username"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"username")}
                                        />
                                    </div>
                                </Grid>

                                {/* Inform user on invalid email */}
                                <Grid xs={12}> 
                                    <p  className='popupErrorInfoText' 
                                        style={{color: GLOBAL_CONSTANTS.COLORS.colorC}}>
                                        {this.state.popupErrorEmail}
                                    </p>
                                </Grid>

                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="email"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"email")}
                                        />
                                    </div>
                                </Grid>

                                {/* Inform user on invalid password */}
                                <Grid xs={12}> 
                                    <p  className='popupErrorInfoText' 
                                        style={{color: GLOBAL_CONSTANTS.COLORS.colorC}}>
                                        {this.state.popupErrorPassword}
                                    </p>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField 
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="password" 
                                            variant="outlined"
                                            type="password"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"password")}
                                            />
                                    </div>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <Button variant="text"
                                        style={{border: '1px solid ' + GLOBAL_CONSTANTS.COLORS.colorB}}
                                        type="submit">
                                        register
                                    </Button>
                                </Grid>
        
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );
        }else if (this.state.type == "resetpassword"){
            return(
                <Grid   className='popupOuterContainer' 
                        container 
                        justifyContent="center" 
                        alignItems="center"
                        style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}
                        >
        
                    <Grid xs={12} className='popupInnerContainerWrapper'> 
                        <form>
                            <Grid   className='popupInnerContainer' container
                                    style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}>
        
                                <div className='closePopupButton'>
                                    <IconButton onClick={this.state.onCloseClick} style={{color: "inherit"}} size='large' aria-label="delete">
                                        <ion-icon name="close-outline"></ion-icon>
                                    </IconButton>
                                </div> 
        
                                <Grid xs={12}> 
                                    <h3>reset password</h3>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <div className='textFieldWrapper'>
                                        <TextField
                                            sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                                            required
                                            id="outlined-required"
                                            label="email"
                                            focused
                                            onChange={(event) => this.handleInputChange(event,"email")}
                                        />
                                    </div>
                                </Grid>
        
                                <Grid xs={12}> 
                                    <Button variant="text"
                                        style={{border: '1px solid ' + GLOBAL_CONSTANTS.COLORS.colorB}}>
                                        send password reset link
                                    </Button>
                                </Grid>
        
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );
        }else{
            return <h1>Wrong popup type</h1>
        }  
    }  
}

export default PopupFormBuilder