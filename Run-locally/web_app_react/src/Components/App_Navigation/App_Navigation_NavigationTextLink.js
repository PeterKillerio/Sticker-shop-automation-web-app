import React from 'react';
import { Link } from 'react-router-dom';
import './App_Navigation.css';

// Mui
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

// Style badge for favorites and cart
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -11},}));

// Route link in menu
function NavigationTextLink(props){
    // General description of a text link in navigation menu 

    if (props.visible){
        // If argument badgeNumber is passed, badge with that number is created
        if (props.badgeNumber === undefined){
            return(
                <Grid xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>    
                        <div className='navigationTextLinkWrapper'>
                                <Link className='navigationTextLink' to={props.link}>
                                    <button className='navigationButton' style={{fontSize: props.fontSize}}>
                                        {props.text}
                                    </button>
                                </Link>
                        </div>
                </Grid>
            );
        }else{
            return(
                <Grid xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xl}>    
                        <div className='navigationTextLinkWrapper'>
                            <StyledBadge badgeContent={props.badgeNumber} color="primary" anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right"
                                }}>
    
                                <Link className='navigationTextLink' to={props.link}>
                                    <button className='navigationButton' style={{fontSize: props.fontSize}}>
                                        {props.text}
                                    </button>
                                </Link>
                            </StyledBadge>
                        </div>
                </Grid>
            );
        }
    }
    else{
        return(null);
    }
}

export default NavigationTextLink