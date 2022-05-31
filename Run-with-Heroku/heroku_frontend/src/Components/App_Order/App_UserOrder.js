import React from 'react';
import './App_UserOrder.css';

  
// MUI
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';

function UserOrder(props){
    /* Return user order with its items and information */

    return(  
            <div className='orderDivWrapper'>
                <Grid   container 
                        justifyContent="center"
                        alignItems="center">

                    <Grid xs = {2} justifyContent="center">
                        <h4 className='centerAlign'>ID: {props.id}</h4>
                    </Grid>

                    <Grid xs = {3} justifyContent="center">
                        <h4 className='centerAlign'>Status: {props.status}</h4>
                    </Grid>

                    <Grid xs = {3}>
                        <h4 className='centerAlign'>Order price: {props.price}€</h4>
                    </Grid>
                    
                    <Grid xs = {4} justifyContent="right">
                        <h4 className='centerAlign'>Created: {props.creation_date}</h4>
                    </Grid>  
                </Grid> 

                <Grid   container 
                        justifyContent="center" 
                        alignItems="center">

                    {props.orderItemsData.map((order_item, order_item_index) => (

                        <Grid container>
                            <Grid xs = {2} display="flex" justifyContent="center">
                                <div className='orderStickerImgWrapper'>
                                    <img className='orderStickerImg' src={order_item.img}></img>
                                </div>
                            </Grid>

                            <Grid xs = {1}>
                            </Grid>

                            <Grid className='leftAlign' xs = {3}>
                                <p>{order_item.name}</p>
                            </Grid>

                            <Grid className='centerAlign' xs = {2}>
                                <p>{order_item.price}€ x {order_item.quantity}</p>
                            </Grid>

                            <Grid className='rightAlign' xs = {2}>
                                <p>{order_item.width} mm x {order_item.height} mm</p>
                            </Grid>

                            <Grid xs = {2}>
                            </Grid>
                        </Grid>    
                    ))} 
                </Grid>
            </div>
    );        
}

export default UserOrder
