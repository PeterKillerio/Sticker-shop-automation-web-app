import React from 'react';
import './App_Order.css';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Import api functions
import getCreateOrderPage from './Func_getCreateOrderPage';
import createOrder from './Func_createOrder';

class Order extends React.Component {
    /* Main component representing user's Order page */

    constructor(props){
        super(props);
        this.state = {
            finalPrice: 0,
            itemCount: 0,
            
            // Form error handling data
            popupErrorFullName: "",
            popupErrorEmail: "",
            popupErrorCountry: "",
            popupErrorStreet: "",
            popupErrorCity: "",
            popupErrorPostalCode: "",
            popupErrorTelephoneNumber: "",
            popupErrorInformationForDelivery: "",
            popupErrorGeneral: "",

            // Form handling data
            full_name: '',
            email: '',
            country: '',
            country: '',
            city: '',
            postal_code: '',
            telephone_number: '',
            information_for_delivery: '',            
        }
    }

    componentDidMount(){
        this.updateOrderFinalPrice();
    }

    handleInputChange(event, stateName) { this.setState({[stateName]:event.target.value});}

    changePopupErrorText(errorVariable, text){
        console.log("text: " + text);
        this.setState({[errorVariable]: text});
    }

    updateOrderFinalPrice(){
        const scope = this;
        // Custom response function
        getCreateOrderPage().then(function(ret){
            if (ret.status == 200){ // 200 OK status code
                scope.setState({ finalPrice: ret.data.finalPrice});
                scope.setState({ itemCount: ret.data.itemCount});
            }
        });
    }

    onCreateOrder(event){
        event.preventDefault();

        // Use api function core and add own functionality
        // Create scope variable to be used inside .then function
        const scope = this;
        // Custom response function
        createOrder(
            this.state.full_name, 
            this.state.email, 
            this.state.country, 
            this.state.street, 
            this.state.city, 
            this.state.postal_code, 
            this.state.telephone_number, 
            this.state.information_for_delivery
        ).then(function(ret){
            // Set favorite stickers
            console.log("#$#$#$ret.status: " + ret.status)
            if (ret.status != 200 && ret.status != 201){ // 200 OK status code
                // Set error messages appropriatelly if there are any
                if (ret.data.full_name){scope.changePopupErrorText("popupErrorFullName", ret.data.full_name);}
                if (ret.data.email){scope.changePopupErrorText("popupErrorEmail", ret.data.email);}
                if (ret.data.country){scope.changePopupErrorText("popupErrorCountry", ret.data.country);}
                if (ret.data.street){scope.changePopupErrorText("popupErrorStreet", ret.data.street);}
                if (ret.data.city){scope.changePopupErrorText("popupErrorCity", ret.data.city);}
                if (ret.data.postal_code){scope.changePopupErrorText("popupErrorPostalCode", ret.data.postal_code);}
                if (ret.data.telephone_number){scope.changePopupErrorText("popupErrorTelephoneNumber", ret.data.telephone_number);}
                if (ret.data.information_for_delivery){scope.changePopupErrorText("popupErrorInformationForDelivery", ret.data.information_for_delivery);}
                if (ret.data.detail){scope.changePopupErrorText("popupErrorGeneral", ret.data.detail);}
                
            }else{
                // Valid request
                console.log("<INFO:Func_createOrder.js> Access token is valid.");
                // Update orders
                scope.props.updateOrders();
                // Redirect to home
                window.location.href = "/";
            }
        });
    }

    resetPopupErrorTexts(){
        this.setState({
            popupErrorFullName: "",
            popupErrorEmail: "",
            popupErrorCountry: "",
            popupErrorStreet: "",
            popupErrorCity: "",
            popupErrorPostalCode: "",
            popupErrorTelephoneNumber: "",
            popupErrorInformationForDelivery: "",
            popupErrorGeneral: ""
        });
        return(null);
    }

    optionTextField(popupErrorText, label, onChangeVariable, fieldRequiered){
        /* Text field for 'name'/'email'/ ... */
        let ConditionalTextField = null;

        if(fieldRequiered == true){
            ConditionalTextField = 
                <TextField
                    sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                    required
                    id="outlined-required"
                    label={label}
                    focused
                    onChange={(event) => this.handleInputChange(event,onChangeVariable)}
                />
        }else{
            ConditionalTextField =
                <TextField
                    sx={{ input: { color: GLOBAL_CONSTANTS.COLORS.colorB } }}
                    id="outlined-required"
                    label={label}
                    focused
                    onChange={(event) => this.handleInputChange(event,onChangeVariable)}
                />
        }

        return(
            <Grid xs={12}>
                <Grid container>
                    <Grid xs={12}> 
                        <p  className='popupErrorInfoText' 
                            style={{color: GLOBAL_CONSTANTS.COLORS.colorC, textAlign: 'center'}}>
                            {popupErrorText}
                        </p>
                    </Grid>

                    <Grid xs={12}> 
                        <div className='textFieldWrapper'>
                            {ConditionalTextField}
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    render() {

        if(this.state.itemCount){
            return (
                <Grid container style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}
                    className="orderWrapper">   

                    <Grid xs={12} className="formWrapper"> 
                        <form 
                            onSubmit={(event) => { this.onCreateOrder(event); this.resetPopupErrorTexts(); }}
                            >
                            <Grid   container style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA}}> 
                                <Grid xs={12} className="orderHeaderWrapper">
                                    <h1>Finalize your order</h1>
                                </Grid>

                                {/* full_name */}
                                
                                {this.optionTextField(this.state.popupErrorFullName, "Full name", "full_name", true)}
                                
                                {/* email */}
                                {this.optionTextField(this.state.popupErrorEmail, "Email", "email", true)}

                                {/* country */}
                                {this.optionTextField(this.state.popupErrorCountry, "Country", "country", true)}

                                {/* street */}
                                {this.optionTextField(this.state.popupErrorStreet, "Street", "street", true)}

                                {/* city */}
                                {this.optionTextField(this.state.popupErrorCity, "City", "city", true)}

                                {/* postal_code */}
                                {this.optionTextField(this.state.popupErrorPostalCode, "Postal code", "postal_code", true)}

                                {/* telephone_number */}
                                {this.optionTextField(this.state.popupErrorTelephoneNumber, "Telephone number", "telephone_number", true)}

                                {/* information_for_delivery */}
                                {this.optionTextField(this.state.popupErrorInformationForDelivery, "Information for delivery", "information_for_delivery", false)}

                                <Grid xs={12}>
                                    <p>To be paid: {this.state.finalPrice} €</p>
                                </Grid>

                                {/* Additional error related to order not to specific field */}
                                <Grid xs={12}> 
                                    <p  className='popupErrorInfoText' 
                                        style={{color: GLOBAL_CONSTANTS.COLORS.colorC, textAlign: 'center'}}>
                                        {this.state.popupErrorGeneral}
                                    </p>
                                </Grid>

                                <Grid xs={12}> 
                                    <Button variant="contained"
                                        style={{border: '1px solid ' + GLOBAL_CONSTANTS.COLORS.colorB}}
                                        type="submit"
                                        sx={{ borderRadius: 28 }}>
                                        Continue and pay
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            );
        }else{
            return (
                <Grid container style={{backgroundColor: GLOBAL_CONSTANTS.COLORS.colorA, color: GLOBAL_CONSTANTS.COLORS.colorB}}
                    className="orderWrapper">   
                    <Grid xs={12} style={{textAlign: "center"}}>
                        <p>Your cart is empty</p>
                    </Grid>
                </Grid>
            );
        }
    }    
}



export default Order
