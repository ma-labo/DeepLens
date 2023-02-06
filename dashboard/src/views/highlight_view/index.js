import React, { Component } from 'react';
import HighlightChart from '../../charts/HighlightChart';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default class HighlightChartView extends Component {
    render() {
        const height = this.props.height;
        const width = this.props.width;
        const json_data = this.props.json_data;
        //const isLoading=this.props.isLoading;
        
        return (
            
            <div id='highlightChartView'>
                <div style={{ border: '0px', backgroundColor: 'white' }}>
                    
                    {this.props.isLoading?(
                        <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: "center", border: '0px' }}>
                            <CircularProgress />
                        </Box>
                        ):<HighlightChart json_data={json_data} width={width} height={height} />
                    }
                </div>
            </div>
        )
    }
}