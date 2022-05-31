import React from 'react';
import './App_Navigation.css';

// MUI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Components
import NavigationTextLink from './App_Navigation_NavigationTextLink'; 
import NavigationTextButton from './App_Navigation_NavigationTextButton'; 

// Import constatns
import * as GLOBAL_CONSTANTS from './../../GlobalConstants'

function MobileNavigationMenu(props){
    // Mobile menu popup tab

    // Variable for handling logged in/out presenting variants
    var is_temp = (localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.is_temp) === 'true');

    return(
        <Grid className='mobileMenuTabGrid' style={{color: GLOBAL_CONSTANTS.COLORS.colorA}} sx={{ display: { xs: 'block', md : 'none' } }} container>
            <Grid xs={12}>
                <Grid container>

                <Grid xs={0.3}> </Grid> {/* Empty space */}

                <Grid xs={11.4}> 

                    <Grid className='mobileMenuTabContainer' style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorB}} container justifyContent="center">
                        {/* Close button */}
                        <Grid xs={12}> 
                            <Grid container>
                                <Grid xs={3} sm={2}></Grid>
                                <Grid xs={6} sm={8}>
                                    <h3>menu</h3>
                                </Grid>
                                <Grid xs={3} sm={2}>
                                    <div className='closeMobileMenuIconWrapper'>
                                        <IconButton onClick={props.onClickMobileMenu} style={{color: "inherit"}} size='large' aria-label="delete">
                                            <ion-icon name="close-outline"></ion-icon>
                                        </IconButton>
                                    </div>   
                                </Grid>
                                
                            </Grid>
                                                 
                        </Grid>

                        <NavigationTextLink
                            text = {localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.username)}
                            fontSize = {props.fontSize}
                            link = "/"
                            visible = {!is_temp}

                            xs={12} sm={12} md={12} lg={12} xl={12}
                        />

                        <NavigationTextLink
                            text = "browse stickers"
                            fontSize = {props.fontSize}
                            link = "/"
                            visible = {true}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextLink
                            text = "make your own sticker"
                            fontSize = {props.fontSize}
                            link = "/editor"
                            visible = {true}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextLink
                            text = "favorites"
                            fontSize = {props.fontSize}
                            link = {"/" + GLOBAL_CONSTANTS.FAVORITE_STICKERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.favoritesBadgeNumber}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextLink
                            text = "cart"
                            fontSize = {props.fontSize}
                            link = {"/" + GLOBAL_CONSTANTS.CART_STICKERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.cartBadgeNumber}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextLink
                            text = "your orders"
                            fontSize = {props.fontSize}
                            link = {"/" + GLOBAL_CONSTANTS.ORDERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.ordersBadgeNumber}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextButton
                            text = "login"
                            fontSize = {props.fontSize}

                            visible = {is_temp}// Handle visibility of these buttons

                            onClick={props.onClickLoginPopup}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextButton
                            text = "register"
                            fontSize = {props.fontSize}

                            visible = {is_temp}// Handle visibility of these buttons

                            onClick={props.onClickRegisterPopup}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                        <NavigationTextButton
                            text = "logout"
                            fontSize = {props.fontSize}

                            visible = {!is_temp}// Handle visibility of these buttons

                            onClick={props.onClickLogout}

                            xs={6} sm={6} md={6} lg={6} xl={6}
                        />

                    </Grid>
                
                </Grid>

                <Grid xs={0.3}> </Grid> {/* Empty space */}

                </Grid>
            </Grid>
        </Grid>
    );
}

export default MobileNavigationMenu