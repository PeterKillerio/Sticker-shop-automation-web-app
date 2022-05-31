import React from 'react';
import './App_Filter.css';

// Import constants
import * as GLOBAL_CONSTANTS from '../../GlobalConstants';
import * as LOCAL_CONSTANTS from './LocalConstants'

// MUI 
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Custom filter theme
const filterTheme = createTheme({
    palette: {
      primary: {
        main: GLOBAL_CONSTANTS.COLORS.colorA,
      },
      secondary: {
        main: GLOBAL_CONSTANTS.COLORS.colorB,
      },
      error: {
        main: GLOBAL_CONSTANTS.COLORS.colorC,
      },
    },
  });

function Filter(props){
    /* Subpage with tag/name picker dropdown filter and sticker size slider */

    function sliderValueText(value) {
        // Slider value floating text 
        return `${value} mm`;
    }

    return(
        <ThemeProvider theme={filterTheme}>
            <Grid container justifyContent="center" className="filterContainer">  
                <Grid xs = {12}>
                    <h2>Filter</h2>
                </Grid>

                <Grid xs = {12}>
                    <Autocomplete
                        className="tagFilter"
                        multiple
                        highlight
                        id="tags-standard"
                        options={props.filterOptions}
                        getOptionLabel={(option) => option.name}
                        defaultValue={ props.filterOptions }
                        renderOption={(props, option) => {
                            return <li {...props}>{option.name} ({option.type} : {option.count})</li>;
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Filter stickers by a name or a tag"
                                placeholder="Search"
                            />
                        )}
                        onChange={(event,options) => props.onQueryChange(options)}
                        onInputChange={(event,value) => props.onFilterInputChange(value)}
                    />
                </Grid>

                <Grid xs = {12}>
                    <h2>Set the longest side of a sticker</h2>
                    <p>{props.longestSidePick} mm</p>
                </Grid>

                <Grid xs = {12} >
                    <Slider
                        className="sideSlider"
                        aria-label="Longest side picker"
                        defaultValue={props.longestSidePick}
                        onChangeCommitted={(event, value) => props.onSliderChange(value)}
                        valueLabelFormat={sliderValueText}
                        step={1}
                        marks
                        min={15}
                        max={100}
                        valueLabelDisplay="auto"
                    />
                </Grid>

            </Grid>
        </ThemeProvider>
    );
}

export default Filter