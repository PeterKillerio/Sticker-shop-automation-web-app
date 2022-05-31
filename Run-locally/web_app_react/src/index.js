import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Apps and components
import SetTokensOnVisit from './Components/App_JWT/App_SetTokensOnVisit';
import Navigation from './Components/App_Navigation/App_Navigation';
import Promo from './Components/App_Promo/App_Promo'
import StickerListingFilter from './Components/App_StickerListing/App_StickerListingFilter';
import Footer from './Components/App_Footer/App_Footer';
import StickerPage from './Components/App_StickerPage/App_StickerPage';
import Favorites from './Components/App_Favorites/App_Favorites';
import Cart from './Components/App_Cart/App_Cart';
import Order from './Components/App_Order/App_Order'
import Orders from './Components/App_Order/App_Orders'
import Editor from './Components/App_Editor/App_Editor'

// Root style
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Import constants
import * as GLOBAL_CONSTANTS from './GlobalConstants';

// Import functions
// Favorites api functions
import getFavoriteStickers from './Components/App_Favorites/Func_getFavoriteStickers';
import removeFavoriteSticker from './Components/App_Favorites/Func_removeFavoriteSticker';
import addFavoriteSticker from './Components/App_Favorites/Func_addFavoriteSticker';
// Cart and order api functions
import getCartStickers from './Components/App_Cart/Func_getCartStickers';
import removeCartSticker from './Components/App_Cart/Func_removeCartSticker';
import removeCartCanvas from './Components/App_Cart/Func_removeCartCanvas';
import addCartSticker from './Components/App_Cart/Func_addCartSticker';
import getOrders from './Components/App_Order/Func_getOrders';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: GLOBAL_CONSTANTS.COLORS.colorB,
    },
    secondary: {
      main: GLOBAL_CONSTANTS.COLORS.colorA,
    },
    error: {
      main: GLOBAL_CONSTANTS.COLORS.colorC,
    },
    text: {
      disabled: GLOBAL_CONSTANTS.COLORS.colorB,
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});

// Handling requests and routing
class Index extends React.Component {
  /*  Core of the frontend of the application, contains url handling, 
      and description of each page that this application offers as well as 
      function definitions that are used by one or more subcomponents. */

  constructor(props){
      super(props);
      this.state = {
          // Favorites
          favoriteStickerItems: [],
          favoriteStickersStyleOptionIds: [],

          // Cart
          cartStickerItems: [],
          cartCanvasItems: [],
          cartStickerIds: [],
          totalCartItems: 0,
          
          // Orders
          ordersData: [],
          ordersCount: 0,
      };

      // Favorites handling
      this.updateFavoriteStickers = this.updateFavoriteStickers.bind(this);
      this.onAddStickerToFavorites = this.onAddStickerToFavorites.bind(this);
      this.onRemoveStickerFromFavorites = this.onRemoveStickerFromFavorites.bind(this);

      // Cart handling
      this.updateCartStickers = this.updateCartStickers.bind(this);
      this.onAddStickerToCart = this.onAddStickerToCart.bind(this);
      this.onRemoveStickerFromCart = this.onRemoveStickerFromCart.bind(this);
      this.onRemoveCanvasFromCart = this.onRemoveCanvasFromCart.bind(this);

      // Orders
      this.updateOrders = this.updateOrders.bind(this);
  }

  componentDidMount(){
    this.updateFavoriteStickers();
    this.updateCartStickers();
    this.updateOrders();
  }

  // Favorites handling functions
  updateFavoriteStickers(){
    // Use api function core and add own functionality
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    getFavoriteStickers().then(function(ret){
        // Set favorite stickers
        if (ret.status == 200){ // 200 OK status code
            scope.setState({ favoriteStickerItems: ret.data.favorite_items});
            // Parse favoriteStickers's styleOptionIds to list
            let favoriteStickersStyleOptionIds = [];
            for(let i = 0; i < ret.data.favorite_items.length; i++){
                favoriteStickersStyleOptionIds.push(ret.data.favorite_items[i].sticker_option_id);
            }
            scope.setState({favoriteStickersStyleOptionIds : favoriteStickersStyleOptionIds});
        }
    });
  }
  onAddStickerToFavorites(stickerOptionId){
      // This function is triggered after user presses button on sticker
      // in listing to add it to favorites.
      // Use api function core and add own functionality
      // Create scope variable to be used inside .then function
      const scope = this;
      // Custom response function
      addFavoriteSticker(stickerOptionId).then(function(ret){
          // Set favorite stickers
          if (ret.status == 200){ // 200 OK status code
              scope.updateFavoriteStickers();
          }
      });
  }
  onRemoveStickerFromFavorites(favoriteItemId){
    // Use imported function core and add own functionality for this component
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    removeFavoriteSticker(favoriteItemId).then(function(ret){
        // Update favorite sticker list
        if (ret.status == 200){ // 200 OK status code
            scope.updateFavoriteStickers();
        }
    });
  }

  // Order handling function
  updateOrders(){
    // Use api function core and add own functionality
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    getOrders().then(function(ret){
        // Set favorite stickers
        if (ret.status == 200){ // 200 OK status code
            scope.setState({ 
              ordersData: ret.data.orders,
              ordersCount: ret.data.orders.length
            });
        }
    });
  }
  // Cart handling functions
  updateCartStickers(){
    // Use api function core and add own functionality
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    getCartStickers().then(function(ret){
        // Set favorite stickers
        if (ret.status == 200){ // 200 OK status code
            scope.setState({ 
              cartStickerItems: ret.data.cart_sticker_items,
              cartCanvasItems: ret.data.cart_canvas_items,
              totalCartItems: ret.data.cart_sticker_items.length + ret.data.cart_canvas_items.length
            });
            // Parse favoriteStickers's styleOptionIds to list
            let cartStickerIds = [];
            for(let i = 0; i < ret.data.cart_sticker_items.length; i++){
                cartStickerIds.push(ret.data.cart_sticker_items[i].cart_sticker_id);
            }
            scope.setState({cartStickerIds : cartStickerIds});
        }
    });
  }
  
  onAddStickerToCart(stickerStyleOptionId, amount, longestSidePick){
      // This function is triggered after user presses button on sticker
      // in listing/sticker page to add it to cart.
      // Use api function core and add own functionality
      // Create scope variable to be used inside .then function
      const scope = this;
      // Custom response function
      addCartSticker(stickerStyleOptionId, amount, longestSidePick).then(function(ret){
          // Set favorite stickers
          if (ret.status == 200){ // 200 OK status code
              scope.updateCartStickers();
          }
      });
  }
  onRemoveStickerFromCart(stickerCartItemId){
    // Use imported function core and add own functionality for this component
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    removeCartSticker(stickerCartItemId).then(function(ret){
        // Update cart sticker list
        if (ret.status == 200){ // 200 OK status code
            scope.updateCartStickers();
        }
    });
  }
  onRemoveCanvasFromCart(canvasCartItemId){
    // Use imported function core and add own functionality for this component
    // Create scope variable to be used inside .then function
    const scope = this;
    // Custom response function
    removeCartCanvas(canvasCartItemId).then(function(ret){
        // Update cart sticker list
        if (ret.status == 200){ // 200 OK status code
            scope.updateCartStickers();
        }
    });
  }

  renderIndex(){
    return(
      <ThemeProvider theme={muiTheme}>
        <BrowserRouter>

          {/* Page visit logic for setting JWT tokens */}
          <SetTokensOnVisit/>

          {/* Routing */}
          <Routes>

              {/* Home page */}
              <Route path="/" element={<>
              
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5'
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />
                {/* Promo */}
                <Promo/>
                {/* Sticker filter & listings components */}
                <StickerListingFilter
                  // Favorites handling
                  favoriteStickerItems = {this.state.favoriteStickerItems}
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  onAddStickerToFavorites = {this.onAddStickerToFavorites}
                  onRemoveStickerFromFavorites = {this.onRemoveStickerFromFavorites}
                  // Cart handling
                  cartStickerItems = {this.state.cartStickerItems}
                  cartStickerIds = {this.state.cartStickerIds}
                  onAddStickerToCart = {this.onAddStickerToCart}
                  onRemoveStickerFromCart = {this.onRemoveStickerFromCart}
                />
                {/* Footer component */}
                <Footer/>
                
              </>}/>

              {/* Sticker page */}
              <Route path="/sticker/:sticker_id" element={<>
                
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />
                {/* Sticker page */}
                <StickerPage
                  // Favorite handling
                  favoriteStickerItems = {this.state.favoriteStickerItems}
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  onAddStickerToFavorites = {this.onAddStickerToFavorites}
                  onRemoveStickerFromFavorites = {this.onRemoveStickerFromFavorites}
                  // Cart handling
                  cartStickerItems = {this.state.cartStickerItems}
                  cartStickerIds = {this.state.cartStickerIds}
                  onAddStickerToCart = {this.onAddStickerToCart}
                  onRemoveStickerFromCart = {this.onRemoveStickerFromCart}
                />
                {/* Footer component */}
                <Footer/>
                
              </>}/>


              {/* Favorites page */}
              <Route path="/favorites" element={<>
                  
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />

                {/* Favorites page */}
                <Favorites
                  favoriteStickerItems = {this.state.favoriteStickerItems}
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  onRemoveStickerFromFavorites = {this.onRemoveStickerFromFavorites}
                />

                {/* Footer component */}
                <Footer/>
                
              </>}/>


              {/* Cart page */}
              <Route path="/cart" element={<>
                  
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />

                {/* Cart page core */}
                <Cart
                  cartCanvasItems = {this.state.cartCanvasItems}
                  cartStickerItems = {this.state.cartStickerItems}
                  totalCartItems = {this.state.totalCartItems}
                  cartStickerIds = {this.state.cartStickerIds}
                  onRemoveStickerFromCart = {this.onRemoveStickerFromCart}
                  onRemoveCanvasFromCart = {this.onRemoveCanvasFromCart}
                />

                {/* Footer component */}
                <Footer/>
                
              </>}/>


              {/* Order creation page */}
              <Route path="/cart/continue" element={<>
                  
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />

                {/* Order creation page */}
                <Order
                  updateOrders = {this.updateOrders}
                />

                {/* Footer component */}
                <Footer/>
                
              </>}/>

              {/* Order listing page */}
              <Route path="/orders" element={<>
                  
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />

                {/* Order listing page core */}
                <Orders
                  ordersData = {this.state.ordersData}
                />

                {/* Footer component */}
                <Footer/>
                
              </>}/>


              {/* Editor page */}
              <Route path="/editor" element={<>
                  
                {/* Navigation component */}
                <Navigation 
                  navigationHeightPercentage='5' 
                  favoriteStickersStyleOptionIds = {this.state.favoriteStickersStyleOptionIds}
                  cartStickerIds = {this.state.cartStickerIds}
                  totalCartItems = {this.state.totalCartItems}
                  ordersCount = {this.state.ordersCount}
                />

                {/* Editor */}
                <Editor
                  cartStickerItems = {this.state.cartStickerItems}
                  cartStickerIds = {this.state.cartStickerIds}
                  onRemoveStickerFromCart = {this.onRemoveStickerFromCart}
                  updateCartStickers = {this.updateCartStickers}
                />
                
              </>}/>

          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    );
  }

  render() {
    return (
        this.renderIndex()
    );
  }
}

// Rendering
ReactDOM.render(
  <React.StrictMode>
    <Index/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
 