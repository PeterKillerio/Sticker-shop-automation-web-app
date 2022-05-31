import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './App_Orders.css';
import mergeImages from 'merge-images';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import OrdersList from './App_OrdersList'

class Orders extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div 
                style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}
                className="ordersWrapper"
            >

                <Grid container justifyContent="center">  
                    <Grid xs={12} className="ordersHeaderWrapper">
                            <h1>Orders</h1>
                    </Grid>


                    <Grid xs={12}>
                        <OrdersList
                            ordersData = {this.props.ordersData}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }    
}



export default Orders
