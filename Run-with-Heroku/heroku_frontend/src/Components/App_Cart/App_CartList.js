import React from 'react';
import './App_CartList.css';

// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import CartItem from './App_CartItem'

function CartList(props){
    /* Return a list of all items in user's cart page */

    if (props.totalCartItems){
        return(  
            <div>
                <Grid container justifyContent="center">  
                    <Grid xs = {12} >
                        <Grid container justifyContent="center" className="cartItemsListInnerWrapper">
                            {props.cartCanvasItems.map((item, list_index) => (
                                <Grid xs = {12}>
                                    <CartItem
                                        type = 'canvas'
                                        listIndex = {list_index+1}
                                        name = {item.name}
                                        img = {item.img}
                                        itemId = {item.finished_canvas_id}
                                        cartItemId = {item.cart_canvas_id}
                                        price = {item.price}
                                        finalPrice = {item.finalPrice}
                                        amount = {item.amount}
                                        material = {item.material}
                                        style = {item.style}
                                        width = {item.width}
                                        height = {item.height}
                                        link = {'/' + GLOBAL_CONSTANTS.STICKER_PAGE_URL + item.sticker_id}
                                        
                                        onRemoveItemFromCart = {props.onRemoveCanvasFromCart}
                                    />
                                </Grid>
                            ))}

                            {props.cartStickerItems.map((item, list_index) => (
                                <Grid xs = {12}>
                                    <CartItem
                                        type = 'sticker'
                                        listIndex = {list_index+1}
                                        name = {item.name}
                                        img = {item.img}
                                        itemId = {item.sticker_id}
                                        cartItemId = {item.cart_sticker_id}
                                        price = {item.price}
                                        finalPrice = {item.finalPrice}
                                        amount = {item.amount}
                                        material = {item.material}
                                        style = {item.style}
                                        width = {item.width}
                                        height = {item.height}
                                        link = {'/' + GLOBAL_CONSTANTS.STICKER_PAGE_URL + item.sticker_id}
                                        
                                        onRemoveItemFromCart = {props.onRemoveStickerFromCart}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }else{
        return(  
            <div>
                <Grid container justifyContent="center">  
                    <Grid xs = {12}>
                        <p style={{textAlign: "center"}}>Your cart is empty</p>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default CartList
