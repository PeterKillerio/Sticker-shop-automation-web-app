import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App_Navigation.css';

// MUI 
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';

// Import React components
import NavigationTextLink from './App_Navigation_NavigationTextLink'; 
import NavigationTextButton from './App_Navigation_NavigationTextButton'; 
import NavigationLogoLink from './App_Navigation_NavigationLogoLink'; 
import NavigationBurgerMenu from './App_Navigation_NavigationBurgerMenu'; 

// Import constatns
import * as GLOBAL_CONSTANTS from './../../GlobalConstants'

// Style badge for favorites and cart
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -10,
      top: 26
    },}));


function DekstopNavigationMenu(props){
    // Desktop navigation menu on the top of the page

    // Variable for handling logged in/out presenting variants
    // This format helps with missing localStorage variable -> missing means is_temp == true
    var is_temp = !(localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.is_temp) === 'false');

    return(
        <div style={{ 
                backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}>
            <Grid
                className='desktopNavigationMenuContainer' 
                style={{ 
                    backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, 
                    color: GLOBAL_CONSTANTS.COLORS.colorB}} 
                container
            >
                
                {/* xs: 'none' -> hiding the options and giving the option to open mobile popup menu */}
                <Grid sx={{ display: { xs: 'none', md : 'block' } }}  xs={5}>
                    <Grid container>          

                        <NavigationTextLink
                            text = "browse stickers"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = "/"
                            visible = {true}

                            xs={12} sm={12} md={3} lg={3} xl={3}
                        />

                        <NavigationTextLink
                            text = "make your own sticker"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = "/editor"
                            visible = {true}

                            xs={12} sm={12} md={4} lg={4} xl={4}
                        />

                    </Grid>
                </Grid>

                <Grid xs={12} md={2}>
                    <Grid container justifyContent="left">

                        <Grid sx={{ display: { xs: 'block', md : 'none' } }} xs={3}> </Grid>

                        <Grid xs={6} md={12}>
                            <NavigationLogoLink
                                link = '/'
                            />
                        </Grid>

                        {/* Burger menu active from '< md' */}
                        <Grid sx={{ display: { xs: 'block', md : 'none' } }} xs={3}> 
                            <NavigationBurgerMenu
                                onClick={ props.onClickMobileMenu }
                                color = { GLOBAL_CONSTANTS.COLORS.colorB }
                            />
                        </Grid>

                    </Grid>
                </Grid>

                <Grid sx={{ display: { xs: 'none', md : 'block' } }} xs={5}>
                    <Grid container justifyContent="right">

                        {/* favorite stickers */}
                        <NavigationTextLink
                            text = "favorites"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = {"/" + GLOBAL_CONSTANTS.FAVORITE_STICKERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.favoritesBadgeNumber}

                            xs={12} sm={12} md={2} lg={2} xl={2}
                        />

                        {/* cart */}
                        <NavigationTextLink
                            text = "cart"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = {"/" + GLOBAL_CONSTANTS.CART_STICKERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.cartBadgeNumber}

                            xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}
                        />

                        {/* orders listing */}
                        <NavigationTextLink
                            text = "your orders"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = {"/" + GLOBAL_CONSTANTS.ORDERS_PAGE_URL}
                            visible = {true}

                            badgeNumber = {props.ordersBadgeNumber}

                            xs={12} sm={12} md={2} lg={2} xl={2}
                        />

                        <NavigationTextLink
                            text = {localStorage.getItem(GLOBAL_CONSTANTS.LOCAL_STORAGE.username)}
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            link = "/"
                            visible = {!is_temp}

                            xs={12} sm={12} md={3} lg={3} xl={3}
                        />

                        <NavigationTextButton
                            text = "login"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}

                            visible = {is_temp}// Handle visibility of these buttons

                            onClick={props.onClickLoginPopup}

                            xs={12} sm={12} md={2} lg={2} xl={2}
                        />                 
                        <NavigationTextButton
                            text = "register"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}

                            visible = {is_temp}// Handle visibility of these buttons

                            onClick={props.onClickRegisterPopup}

                            xs={12} sm={12} md={2} lg={2} xl={2}
                        />

                        <NavigationTextButton
                            text = "logout"
                            fontSize = {GLOBAL_CONSTANTS.FONT_SIZES.sizeA}
                            visible = {!is_temp}// Handle visibility of these buttons
                            onClick={props.onClickLogout}
                            xs={12} sm={12} md={2} lg={2} xl={2}
                        />

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default DekstopNavigationMenu