import React from 'react';
import './App_Navigation.css';

// MUI 
import Box from '@mui/material/Box';

// Import react components  
import MobileNavigationMenu from './App_Navigation_MobileNavigationMenu';
import DekstopNavigationMenu from './App_Navigation_DesktopNavigationMenu';
import PopupBuilder from './Popups/Builder/App_Navigation_PopupFormBuilder';

// Import constatns
import * as GLOBAL_CONSTANTS from './../../GlobalConstants'

// Logic for displaying login popup
function LoginPopupHandler(props){
    if (props.visible) {
        return (
            <PopupBuilder
                type = 'login'
                
                onCloseClick = {props.onCloseClick}
                onForgotPasswordClick = {props.onForgotPasswordClick}
            />
            );
    }else{
        return null;
    }
}

// Logic for displaying register popup
function RegisterPopupHandler(props){
    if (props.visible) {
        return (
            <PopupBuilder
                type = 'register'
                
                onCloseClick = {props.onCloseClick}
                onSuccessfulRegistration = {props.onSuccessfulRegistration}
            />
            );
    }else{
        return null;
    }
}

// Logic for displaying reset password popup
function ResetPasswordPopupHandler(props){
    if (props.visible) {
        return (
            <PopupBuilder
                type = 'resetpassword'

                onCloseClick = {props.onCloseClick}
            />
            );
    }else{
        return null;
    }
}

// Logic for displaying mobile menu
function MobileNavigationMenuHandler(props){
    if (props.visible) {
        return (
            <MobileNavigationMenu
                onClickMobileMenu = {props.onClickMobileMenu}  // Toggle for burger menu
                onClickLoginPopup = {props.onClickLoginPopup}  // Toggle for login popup
                onClickRegisterPopup = {props.onClickRegisterPopup}  // Toggle for login popup
                onClickResetPasswordPopup = {props.onClickResetPasswordPopup}  // Toggle for reset password popup
                onClickLogout = {props.onClickLogout}

                favoritesBadgeNumber = {props.favoritesBadgeNumber}
                cartBadgeNumber = {props.cartBadgeNumber}
                ordersBadgeNumber = {props.ordersBadgeNumber}
            />
            );
    }else{
        return null;
    }
}

// Main navigation component
class Navigation extends React.Component {
    /* Navigation displayed on the top of the window that includes mobile version popup */

    constructor(props){
        super(props);
        this.state = {
            mobileMenuVisible: false,
            loginPopupVisible: false,
            registerPopupVisible: false,
            resetPasswordPopupVisible: false,

            favoriteStickerItems: [],
        };
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.toggleLoginPopup = this.toggleLoginPopup.bind(this);
        this.toggleRegisterPopup = this.toggleRegisterPopup.bind(this);
        this.toggleResetPasswordPopup = this.toggleResetPasswordPopup.bind(this);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.handleSuccessfulRegistration = this.handleSuccessfulRegistration.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleMobileMenu() {
        this.setState({mobileMenuVisible: !this.state.mobileMenuVisible});
    };
    toggleLoginPopup() {
        this.setState({loginPopupVisible: !this.state.loginPopupVisible});
    };
    toggleRegisterPopup() {
        this.setState({registerPopupVisible: !this.state.registerPopupVisible});
    };
    toggleResetPasswordPopup() {
        this.setState({resetPasswordPopupVisible: !this.state.resetPasswordPopupVisible});
    };
    handleForgotPassword(){ 
        // Close login popup with the forgot password button and open forgot password popup
        this.setState({loginPopupVisible: false});
        this.setState({resetPasswordPopupVisible: true});
    }
    handleSuccessfulRegistration(){
        // Close registartion window and open login window
        this.setState({registerPopupVisible: false});
        this.setState({loginPopupVisible: true});
    }
    handleLogout(){
        // Remove tokens, is_temp variable, username and refresh the page 
        localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.access_token);
        localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.refresh_token);
        localStorage.setItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.is_temp, true);
        localStorage.removeItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.username);
        window.location.reload(false); // Refresh page
    }

    render() {
        return (
            <div>
                <Box sx={{ flexGrow: 1 }}>

                    {/* Popup for login */}
                    <LoginPopupHandler
                        visible = {this.state.loginPopupVisible}
                        
                        onCloseClick = {this.toggleLoginPopup} // Toggle for close menu
                        onForgotPasswordClick = {this.handleForgotPassword} // Open forgot password popup
                    />

                    {/* Popup for register */}
                    <RegisterPopupHandler
                        visible = {this.state.registerPopupVisible}

                        onCloseClick = {this.toggleRegisterPopup} // Toggle for close menu
                        onSuccessfulRegistration = {this.handleSuccessfulRegistration}
                    />

                    {/* Popup for reset password */}
                    <ResetPasswordPopupHandler
                        visible = {this.state.resetPasswordPopupVisible}

                        onCloseClick = {this.toggleResetPasswordPopup} // Toggle for close menu
                    />

                    {/* Popup menu for mobile */}
                    <MobileNavigationMenuHandler
                        visible = {this.state.mobileMenuVisible}
                        favoritesBadgeNumber = {this.props.favoriteStickersStyleOptionIds.length}
                        cartBadgeNumber = {this.props.totalCartItems}
                        ordersBadgeNumber = {this.props.ordersCount}
                        
                        onClickMobileMenu = {this.toggleMobileMenu}  // Toggle for burger menu
                        onClickLoginPopup = {this.toggleLoginPopup}  // Toggle for login popup
                        onClickRegisterPopup = {this.toggleRegisterPopup}  // Toggle for login popup
                        onClickResetPasswordPopup = {this.toggleResetPasswordPopup}  // Toggle for reset password popup
                        onClickLogout = {this.handleLogout}
                    />

                    {/* Desktop menu */}
                    <DekstopNavigationMenu
                        favoritesBadgeNumber = {this.props.favoriteStickersStyleOptionIds.length}
                        cartBadgeNumber = {this.props.totalCartItems}
                        ordersBadgeNumber = {this.props.ordersCount}

                        onClickMobileMenu = {this.toggleMobileMenu}  // Toggle for burger menu
                        onClickLoginPopup = {this.toggleLoginPopup}  // Toggle for login popup
                        onClickRegisterPopup = {this.toggleRegisterPopup}  // Toggle for login popup
                        onClickResetPasswordPopup = {this.toggleResetPasswordPopup}  // Toggle for reset password popup
                        onClickLogout = {this.handleLogout}
                    />
                </Box>
            </div>
        );
    }
}

export default Navigation