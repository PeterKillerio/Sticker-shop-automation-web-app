import React, { useEffect } from 'react';
import './App_Cart.css';
import { Link } from "react-router-dom";

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import CartList from './App_CartList'

class Cart extends React.Component {
    /* Component representing main content of the user's cart page. */

    constructor(props){
        super(props);
    }

    render() {
         
        const listBottom = ()=>{
            /* Bottom part of the page consisting of total item price and continue button */
            if (this.props.totalCartItems){
                let cartPrice = 0;
                for(let i = 0; i < this.props.cartStickerItems.length; i++){
                    cartPrice += this.props.cartStickerItems[i].finalPrice;
                }
                for(let i = 0; i < this.props.cartCanvasItems.length; i++){
                    cartPrice += this.props.cartCanvasItems[i].finalPrice;
                }
                
                return(
                    <Grid container justifyContent="center">
                        <Grid xs={12} style={{textAlign: "center"}} >
                            <p><strong>Final price:</strong> {Number(Math.round(cartPrice+'e2')+'e-2')} €</p>
                        </Grid>

                        <Grid xs={12}>
                            <div className='textAlignCenter'>
                                <Link to={"/" + GLOBAL_CONSTANTS.ORDER_CREATION_PAGE_URL} style={{textDecoration: 'none'}}>
                                    <Button variant="contained"
                                        sx={{ borderRadius: '28px' }}
                                    >Continue with ordering</Button>
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                );
            }
            else{
                return(null);
            }
        }

        return (
            <div 
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}
                className="cartWrapper"
            >

                <Grid container>  
                    <Grid xs={12} className="textAlignCenter">
                            <h1>Cart</h1>
                    </Grid>

                    <Grid xs={12}>
                        <CartList
                            cartStickerItems = {this.props.cartStickerItems}
                            cartCanvasItems = {this.props.cartCanvasItems}
                            totalCartItems = {this.props.totalCartItems}
                            onRemoveStickerFromCart = {this.props.onRemoveStickerFromCart}
                            onRemoveCanvasFromCart = {this.props.onRemoveCanvasFromCart}
                        />
                    </Grid>

                    {/* Total cart price + continue button */}
                    {listBottom()}
                    
                </Grid>
            </div>
        );
    }    
}

export default Cart
