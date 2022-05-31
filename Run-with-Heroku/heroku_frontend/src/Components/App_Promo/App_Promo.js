import React from 'react';
import './App_Promo.css';
import { Link } from 'react-router-dom';
    
// MUI 
import Grid from '@mui/material/Grid';

// Import constants
import * as GLOBAL_CONSTANTS from './../../GlobalConstants';

class Promo extends React.Component {
    /* Promo page with 2 images with redirect paths */

    constructor(props){
        super(props);
        this.state = {
            promoImageA: "/Media/Promo/a.png", // Path to promo image a
            promoImageB: "/Media/Promo/b.png", // Path to promo image b
        };
    }
    
    getPromoSlide(text,link,imagePath,color,xs,sm,md,lg,xl){
        return(
            <Grid xs={xs} sm={sm} md={md} lg={lg} xl={xl} className='promoImageGrid'>
                <Link to={link}>
                    <div className='promoImageWrapper'>
                        <h2 className='promoImageHeading'
                            style={{color: color}}>{text}</h2>
                        <img src={imagePath}></img>
                    </div>
                </Link>
            </Grid>
        );
    }

    render() {
        return (
            <div style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}>
                <Grid container justifyContent="center" className='promoImageContainer'>  
                    {this.getPromoSlide("Browse stickers", "/",this.state.promoImageA,GLOBAL_CONSTANTS.COLORS.colorA,6,6,6,6,6)}
                    {this.getPromoSlide("Make your own", "/editor", this.state.promoImageB,GLOBAL_CONSTANTS.COLORS.colorA,6,6,6,6,6)}
                </Grid>
            </div>
        );
    }
}

export default Promo