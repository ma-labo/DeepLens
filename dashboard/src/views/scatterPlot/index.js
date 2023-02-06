import React, { Component, useState } from 'react';
import draw from '../../charts/ScatterPlot';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';


export default class ScatterPlotView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster_selected_nodes: this.props.cluster_selected_nodes,
            cluster_node_vis_value: "ood_only",
            current_show_cluster: -1,
            origin: [180, 160],
            scale: 15,
            node_radius: 3,
        }
    }

    setClusterNodeVisValue = (value) => {
        this.setState({
            cluster_node_vis_value: value
        });
    }

    setCurrentShowCluster = (value) => {
        this.setState({
            current_show_cluster: value
        });
    }

    setOrigin = (value) => {
        this.setState({
            origin: value
        });
    }

    setScale = (value) => {
        this.setState({
            scale: value
        });
    }

    setNodeRadius = (value) => {
        this.setState({
            node_radius: value
        });
    }

    componentDidMount() {
        draw(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (
            nextState.cluster_node_vis_value !== this.state.cluster_node_vis_value ||
            nextState.current_show_cluster !== this.state.current_show_cluster ||
            nextState.origin !== this.state.origin ||
            nextState.scale !== this.state.scale ||
            nextState.node_radius !== this.state.node_radius ||
            nextProps.does_cluster_refresh
        )
    }

    componentDidUpdate(preProps) {
        draw(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            cluster_selected_nodes: nextProps.cluster_selected_nodes
        });
    }
    
    render() {
        const handleClusterNodeVisChange = (event) => {
            this.setClusterNodeVisValue(event.target.value);
        };

        return (
            <div className='pane'>
                <div width={this.props.width} height={this.props.height}>
                    <div id='scatterChartView'>
                        <div style={{marginTop: -10 }}>
                            <FormControl size="small">
                                <RadioGroup
                                    row
                                    aria-labelledby="cluster-node-vis-label"
                                    name="row-radio-buttons-group"
                                    value={this.state.cluster_node_vis_value}
                                    onChange={handleClusterNodeVisChange}
                                >
                                    <FormControlLabel value="ood_only" control={<Radio size="small" />} label="Show OoD Data" />
                                    <FormControlLabel value="all" control={<Radio size="small" />} label="Show All Data" />
                                </RadioGroup>
                            </FormControl>
                            <Button 
                                id="clearButton" 
                                startIcon={<RestartAltIcon />}
                                style={{marginTop: -5 }}
                                size="large" 
                                sx={{ m: 1 }}
                                onClick={() => {
                                    this.props.clearClusterSelectedNodes()
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                        
                        <div id='clusterTooltip' style={{ fontSize: 14, marginTop: -10 }}>

                        </div>
                    </div>
                    <div id='scatterChart' style={{  }}>
                    </div>
                </div>
            </div>
        )
    }
}