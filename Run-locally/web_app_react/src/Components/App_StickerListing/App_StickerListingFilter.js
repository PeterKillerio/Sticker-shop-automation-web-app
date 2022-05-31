import React from 'react';
import axios from 'axios';
import './App_StickerListingFilter.css';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// Components
import StickerList from './App_StickerList'
import Filter from './App_Filter'

function HandleFilter(props){
    // This function has to be here because on load, filterOptions are not registered fast enough
    // and as a result there are no default values set in the filter
    if(props.filterOptionsParsed == true){
        return(
            <Filter
                filterOptions = {props.filterOptions}
                onQueryChange={props.onQueryChange}
                longestSidePick={props.longestSidePick}

                onSliderChange={props.onSliderChange}
                onFilterInputChange={props.onFilterInputChange}
            />
        );
    }else{return(null);}
}

class StickerListingFilter extends React.Component {
    /* Main structure descriptor for filters and gallery of items (stickers) */

    constructor(props){
        super(props);
        this.state = {
            longestSidePick: 30, // mm
            URLParams: "",
            filterOptionsParsed: false,
            activeFilterOptions: [],
            filterOptions: [],
            stickerItems: [],
        };
        
        this.initialQueryUpdate = this.initialQueryUpdate.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.updateStickersFromQueryString = this.updateStickersFromQueryString.bind(this);
        this.updateQueryString = this.updateQueryString.bind(this);   
        this.getAndSetURLParams = this.getAndSetURLParams.bind(this);   
        this.onSliderChange = this.onSliderChange.bind(this);   
        this.recalculateStickerPrices = this.recalculateStickerPrices.bind(this);   
        this.initialSearchBoxFetch = this.initialSearchBoxFetch.bind(this);   
        this.onFilterInputChange = this.onFilterInputChange.bind(this);        
    }

    // Initial setup and an API call for sticker listings data
    componentDidMount(){
        // Read url query parameters and save them
        this.initialQueryUpdate();
        // Fetch initial batch of filter parameters
        this.initialSearchBoxFetch("");
    }

    getAndSetURLParams(){
        // Loads URL and extracts query parameters, saves them to state and returns it
        const URLParams = new URLSearchParams(window.location.search);
        this.setState({URLParams: URLParams});
        return(URLParams);
    }

    updateQueryString(options){
        this.setState({activeFilterOptions: options});
        console.log("updateQueryString options: " + options)

        // Parse options to one query string
        var names = ""
        var tags = ""

        for(var i = 0; i < options.length; i++){
            console.log(options[i].name + "is iterating" )

            if(options[i].type == "tag"){

                if(tags != ""){
                    tags = tags + "+" + options[i].name
                }else{
                    tags = options[i].name
                }

            }else if(options[i].type == "name"){
                if(names != ""){
                    names = names + "+" + options[i].name
                }else{
                    names = options[i].name
                }
            }
        }

        //// Combine query parameters into one
        // Add tags
        var queryString = "/"
        if (tags != ""){
            queryString = "?tags=" + tags 
        }
        // Add names
        if (names != ""){
            if (queryString != "/"){
                queryString = queryString + "&names=" + names
            }else{
                queryString = "?names=" + names 
            }
        }
        // Add longest side
        if (queryString != "/"){
            queryString = queryString + "&longestside=" + this.state.longestSidePick
        }else{
            queryString = "?longestside=" + this.state.longestSidePick 
        }
        
        // Change url query string (not reloading the page) 
        window.history.pushState({}, null, queryString);
        // Get URLParams object from url and save it to memory
        var URLParams = this.getAndSetURLParams();
        return(URLParams);
    }

    recalculateStickerPrices(longestSidePick){
        let stickerItemsCopy = this.state.stickerItems;
        for(let i = 0; i < this.state.stickerItems.length; i++){
            let priceRaw = longestSidePick*stickerItemsCopy[i]["priceParameter"];
            stickerItemsCopy[i]["price"] = Math.round((priceRaw + Number.EPSILON) * 100) / 100;
        }
        this.setState({
            stickerItems: stickerItemsCopy
        });
    }

    updateStickersFromQueryString(URLParams){
        // API call: get sticker items based on the current URL query parameters
        axios({
            method: 'get',
            url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                    LOCAL_CONSTANTS.API_CALL_URLS.get_stickers + 
                    "?"+URLParams,
            validateStatus: () => true
        }).then(res => {
            console.log("App_StickerListingFilter res: " + JSON.stringify(res))
            if (res.status != 200){
                // Invalid request
                console.log("<WARNING:App_StickerListingFilter.js>: Invalid request.")
            }else{
                // Valid request
                console.log("<INFO:App_StickerListingFilter.js> Access token is valid.")
                this.setState({ stickerItems: res.data});
                //Calculate sticker prices
                this.recalculateStickerPrices(this.state.longestSidePick)
            }
        });
    }

    // Update query search parameters in the filter from url
    initialQueryUpdate(){
        // Read and save parameters
        const URLParams = new URLSearchParams(window.location.search);
        console.log("PARAMSS: " + URLParams)
        var urlNames = URLParams.get('names');
        var urlTags = URLParams.get('tags');
        var longestSidePick = URLParams.get('longestside');

        console.log("urlNames: " + urlNames)
        console.log("urlTags: " + urlTags)
        
        // Check if parameters are null before continuing, set to empty object if so
        var stickerFilterOptions = [];
        if(urlTags != null){
            urlTags = urlTags.split(' ');
            for(var i = 0; i < Object.keys(urlTags).length; i++){
                stickerFilterOptions.push({name: urlTags[i], type: "tag", count: 1});
            }
        }
        //
        if(urlNames != null){
            urlNames = urlNames.split(' ');
            for(var i = 0; i < Object.keys(urlNames).length; i++){
                stickerFilterOptions.push({name: urlNames[i], type: "name", count: 1});
            }
        }
        // On load set slider side picker to url value
        if(longestSidePick != null){
            this.setState({longestSidePick: longestSidePick});
        }

        this.setState({
            activeFilterOptions: stickerFilterOptions,
            filterOptions: stickerFilterOptions,
            filterOptionsParsed: true,
            URLParams: URLParams,
        });

        // API call: get sticker items based on the current URL query parameters
        this.updateStickersFromQueryString(URLParams);

        return(null);
    }

    onQueryChange(options){
        // This function is passed into the autocomplete component of mui and after user
        // removes/adds new tag/name, this function will be called with options as a parameter
        var newURLParams = this.updateQueryString(options);

        // API call: get sticker items based on the current URL query parameters
        this.updateStickersFromQueryString(newURLParams);
    }

    onSliderChange(value){
        // This function is trigered each time a user changes (drags and drop) slider for picking
        // longest side
        this.setState({ longestSidePick: value });
        // Update query url
        var newURLParams = this.updateQueryString(this.state.activeFilterOptions);
        // Update prices
        this.recalculateStickerPrices(value);
    }

    onFilterInputChange(value){
        if (value.length >= LOCAL_CONSTANTS.ON_INPUT_FETCH_FILTER_OPTIONS_CHARACTER_LIMIT){
            this.initialSearchBoxFetch(value);
        }else{
            this.initialSearchBoxFetch("");
        }
    }

    initialSearchBoxFetch(value){
        // Fetch tags from server
        axios({
            method: 'get',
            url:    GLOBAL_CONSTANTS.API_CALL_BASE_URL + 
                    LOCAL_CONSTANTS.API_CALL_URLS.get_tags,
            headers: {}, 
            params: {
                text: value,
            },
            validateStatus: () => true
        }).then(res => {
            console.log("App_StickerListingFilter resQQQQQQ: " + JSON.stringify(res))
            if (res.status != 200){
                // Invalid request
                console.log("<WARNING:App_StickerListingFilter.js>: Invalid request.")
            }else{
                // Valid request
                console.log("<INFO:App_StickerListingFilter.js> Tag request is valid.")
                
                // Set these tags as available filter options
                this.setState({filterOptions: res.data});
            }
        });

    }

    render() {
        return (
            <div>
                <HandleFilter
                    filterOptionsParsed={this.state.filterOptionsParsed}
                    filterOptions={this.state.filterOptions}
                    longestSidePick={this.state.longestSidePick}

                    onQueryChange={this.onQueryChange}
                    onSliderChange={this.onSliderChange}
                    onFilterInputChange={this.onFilterInputChange}
                />
                
                <StickerList
                    stickerItems={this.state.stickerItems}
                    favoriteStickersStyleOptionIds={this.props.favoriteStickersStyleOptionIds}
                    longestSidePick={this.state.longestSidePick}
                    // Favorites
                    onAddStickerToFavorites={this.props.onAddStickerToFavorites}
                    onRemoveStickerFromFavorites={this.props.onRemoveStickerFromFavorites}
                    // Cart
                    onAddStickerToCart={this.props.onAddStickerToCart}
                />
            </div>
        );
    }    
}

export default StickerListingFilter