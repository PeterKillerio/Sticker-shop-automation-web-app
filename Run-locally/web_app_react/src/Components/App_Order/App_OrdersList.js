import React, { useEffect } from 'react';
import './App_OrdersList.css';

// MUI
import Grid from '@mui/material/Grid';
// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import UserOrder from './App_UserOrder'

function OrdersList(props){
    /* Returns list of user's orders and their items   */
    if (props.ordersData.length){
        return(  
                <div>
                    <Grid container justifyContent="center" >  
                        <Grid xs = {12} >
                            <Grid   container justifyContent="center" className="ordersStickerListInnerWrapper"
                                    direction="column-reverse">
                                {props.ordersData.map((user_order, order_index) => (

                                    <UserOrder
                                        id = {user_order.id}
                                        price = {user_order.price}
                                        status = {user_order.status}
                                        creation_date = {user_order.creation_date}
                                        orderItemsData = {user_order.orderItemsData}
                                    />
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
                        <p style={{textAlign: "center"}}>You don't have any orders</p>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default OrdersList
