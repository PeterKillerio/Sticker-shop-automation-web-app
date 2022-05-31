import React from 'react';
import './App_Footer.css';

// MUI 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Import constants
import * as GLOBAL_CONSTANTS from './../../GlobalConstants';

function FooterIconLInk(props){
    return(
        <div className='footerLinkWrapper'>
            <IconButton href={props.link} target='_blank' className='footerLinkIcon' size='small' aria-label="delete">
                <ion-icon name={props.ionIconName} style={{color: GLOBAL_CONSTANTS.COLORS.colorB}}></ion-icon>
            </IconButton>
        </div>
    );
}
  
class Footer extends React.Component {
    /* Component representing page footer */
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}} container>
                    <Grid xs={0} sm={5}></Grid>
                    <Grid xs={3} sm={0.5}>
                        <FooterIconLInk
                            color={GLOBAL_CONSTANTS.COLORS.colorB}
                            ionIconName='logo-instagram'
                            link='https://www.instagram.com/'
                        />
                    </Grid>
                    <Grid xs={3} sm={0.5}>
                        <FooterIconLInk
                            color={GLOBAL_CONSTANTS.COLORS.colorB}
                            ionIconName='logo-discord'
                            link='https://discord.com/'
                        />
                    </Grid>
                    <Grid xs={3} sm={0.5}>
                        <FooterIconLInk
                            color={GLOBAL_CONSTANTS.COLORS.colorB}
                            ionIconName='logo-twitter'
                            link='https://twitter.com/home'
                        />
                    </Grid>
                    <Grid xs={3} sm={0.5}>
                        <FooterIconLInk
                            color={GLOBAL_CONSTANTS.COLORS.colorB}
                            ionIconName='logo-youtube'
                            link='https://www.youtube.com/'
                        />
                    </Grid>
                    <Grid xs={0} sm={5}></Grid>
                </Grid>
            </Box>
        );
    }
}

export default Footer