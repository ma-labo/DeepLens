import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

const margin = {top: 20, right: 30, bottom: 40, left: 40};

function BarChart({ width, height, data, ood_score_threshold }) {
    const ref = useRef();
    
    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    }, []);

    useEffect(() => {
        draw();
    }, [data, ood_score_threshold]);

    const draw = () => {
        d3.select('#barChartView > *').remove();
        const dia_width = width - margin.left - margin.right;
        const dia_height = height - margin.top - margin.bottom - 30;
        var id_ood_score = [];
        var ood_ood_score = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].ood_score > 0 && data[i].ood_score < 0.2) {
                if (data[i].ood_score > ood_score_threshold) {
                    id_ood_score.push(Number(data[i].ood_score));
                } else {
                    ood_ood_score.push(Number(data[i].ood_score));
                }
            }
        }

        var svg = d3.select('#barChartView')
            .append('svg')
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        var x = d3.scaleLinear()
            .domain([-0.01, d3.max(id_ood_score)])     
            .range([0, dia_width]);
        svg.append("g")
            .attr("transform", "translate(" + 0 + "," + dia_height + ")")
            .call(d3.axisBottom(x));
                      
        var histogram = d3.histogram()
            .value(function(d) { return d; })
            .domain(x.domain())
            .thresholds(x.ticks(20));
        
        
        var id_bins = histogram(id_ood_score);

        var ood_bins = histogram(ood_ood_score);

        var y = d3.scaleLinear()
            .range([dia_height, 0])
            .domain([0, d3.max(id_bins, function(d) { return d.length - 5; })]); 
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg.selectAll("rect")
            .data(id_bins)
            .enter()
            .append("rect")
            .attr("x", 1)
                .style("fill", "orange")
                .attr("transform", function(d) { return "translate(" + x(d.x0)+ "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
                .attr("height", function(d) {return dia_height - y(d.length); })
                .style("opacity", 0.6)
        
        svg.selectAll("rect2")
            .data(ood_bins)
            .enter()
            .append("rect")
            .attr("x", 1)
                .style("fill", "#69b3a2")
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
                .attr("height", function(d) {return dia_height - y(d.length); })
                .style("opacity", 0.6)

        svg.append("g")
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", -margin.top + 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Count"));

        svg.append("g")
            .call(g => g.append("text")
                .attr("x", width / 2)
                .attr("y", dia_height + 40)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("Threshold"));

        svg.append("circle")
            .attr("cx", width * 0.01)
            .attr("cy",dia_height + 55)
            .attr("r", 6)
            .style("fill", "#69b3a2")
        svg.append("circle")
            .attr("cx", width * 0.45)
            .attr("cy",dia_height + 55)
            .attr("r", 6)
            .style("fill", "orange")
        svg.append("text")
            .attr("x", width * 0.01 + 10)
            .attr("y", dia_height + 55)
            .text("Training data")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle")
        svg.append("text")
            .attr("x", width * 0.45 + 10)
            .attr("y", dia_height + 55)
            .text("Test data")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle")

        svg.exit()
            .remove()
    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default BarChart;