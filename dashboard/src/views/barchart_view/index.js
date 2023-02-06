import React, { Component } from 'react';
import BarChart from '../../charts/BarChart';

export default class BarChartView extends Component {
    render() {
        const data = this.props.data;
        const ood_score_threshold = this.props.ood_score_threshold;
        const width = this.props.width;
        return (
            <div id='barChartView' style={{ backgroundColor: 'white', paddingTop: 10 }}>
                <div>
                    <BarChart width={width} height={260} data={data} ood_score_threshold={ood_score_threshold} />
                </div>
            </div>
        )
    }
}