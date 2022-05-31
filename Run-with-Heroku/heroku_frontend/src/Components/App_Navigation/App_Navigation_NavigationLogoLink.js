import React from 'react';
import './App_Navigation.css';
import { Link } from 'react-router-dom';

// Media
import {ReactComponent as WhiteMenuLogo} from './../../Images/Logo/white.svg';

// Clickable logo link
function NavigationLogoLink(props){
    return(
        <div className='logoWrapper'>
            <Link to={ props.link }>
                <WhiteMenuLogo className='logo'/>
            </Link>
        </div>
    );
}

export default NavigationLogoLink
