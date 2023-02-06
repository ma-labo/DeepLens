import * as d3 from 'd3';
import * as d3_3d from 'd3-3d';
import "./scatterplot.css"
import * as d3Legend from 'd3-svg-legend'
const axios = require('axios');
var isClusterColor = true;

const draw = (args) => {
    d3.select('#scatterChart > *').remove();
    d3.select('#clusterTooltip > *').remove();
    var origin = args.state.origin;
    var j = 10;
    const scale = args.state.scale;
    var scatter = [];
    var yLine = [];
    var testyLine = [];
    var xGrid = [];
    var beta = 0;
    var alpha = 0;
    var key = function (d) { return d.id; };
    var startAngle = Math.PI / 4;
    
    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);


    var svg = d3.select('#scatterChart')
        .append("svg")
        .attr('width', args.props.width)
        .attr('height', args.props.height)
        .style("transform-origin", "50% 50% 0")
        .style("background", "white")
        .call(d3.drag()
            .on('drag', dragged)
            .on('start', dragStart)
            .on('end', dragEnd))
        .call(zoom)
        .append('g');

    // create a tooltip
    var tooltip = d3.select("#clusterTooltip")
        .append("div")
        .style("opacity", 0)
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    var clusterColorLabels = [
        "Cluster 0",
        "Cluster 1",
        "Cluster 2",
        "Cluster 3",
        "Cluster 4",
        "Cluster 5",
        "Cluster 6",
        "Cluster 7",
        "Cluster 8",
        "Cluster 9",
        "Cluster 10",
        "Cluster 11",
        "Cluster 12",
        "Cluster 13",
    ];
    var clusterColorRGB = [
        "rgb(204,204,0)",
        "rgb(240,230,140)",
        "rgb(255, 127, 14)",
        "rgb(255, 187, 120)",
        "rgb(44, 160, 44)",
        "rgb(152, 223, 138)",
        "rgb(214, 39, 40)",
        "rgb(255, 152, 150)",
        "rgb(148, 103, 189)",
        "rgb(197, 176, 213)",
        "rgb(140, 86, 75)",
        "rgb(196, 156, 148)",
        "rgb(227, 119, 194)",
        "rgb(247, 182, 210)",
    ];
    //var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11"];

    var clusterColor = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
        .range(clusterColorRGB)

    var predColorLabels = ["Company", "Educational Institution", "Artist", "Athlete"]
    var predColor = d3.scaleOrdinal()
        .domain(["0", "1", "2", "3"])
        .range(d3.schemeCategory10);

    var mx, my, mouseX, mouseY;

    var grid3d = d3_3d._3d()
        .shape('GRID', 20)
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);

    var point3d = d3_3d._3d()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .z(function (d) { return d.z; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);

    const handleCurrentShowCluster = (value) => {
        args.setCurrentShowCluster(value);
        args.props.setCurrentFilteredCluster(value);
        var tempOrigin;
        var tempScale;
        var tempNodeRadius;
        if (value == -1) {
            tempOrigin = [180, 160];
            tempScale = 15;
            tempNodeRadius = 3
        } else if (value == 0) {
            tempOrigin = [500, 200];
            tempScale = 50;
            tempNodeRadius = 6
        } else if (value == 1) {
            tempOrigin = [400, -550];
            tempScale = 50;
            tempNodeRadius = 6
        } else if (value == 2) {
            tempOrigin = [50, 500];
            tempScale = 50;
            tempNodeRadius = 6
        } else if (value == 3) {
            tempOrigin = [50, 340];
            tempScale = 20;
            tempNodeRadius = 6
        } else if (value == 4) {
            tempOrigin = [250, 340];
            tempScale = 20;
            tempNodeRadius = 6
        } else if (value == 5) {
            tempOrigin = [400, 300];
            tempScale = 40;
            tempNodeRadius = 6
        } else if (value == 6) {
            tempOrigin = [350, 300];
            tempScale = 30;
            tempNodeRadius = 6
        } else if (value == 7) {
            tempOrigin = [400, 200];
            tempScale = 20;
            tempNodeRadius = 6
        } else if (value == 8) {
            tempOrigin = [450, -150];
            tempScale = 40;
            tempNodeRadius = 6
        } else if (value == 9) {
            tempOrigin = [500, -350];
            tempScale = 40;
            tempNodeRadius = 6
        } else if (value == 10) {
            tempOrigin = [300, 350];
            tempScale = 30;
            tempNodeRadius = 6
        } else if (value == 11) {
            tempOrigin = [0, 300];
            tempScale = 30;
            tempNodeRadius = 6
        } else if (value == 12) {
            tempOrigin = [300, -300];
            tempScale = 30;
            tempNodeRadius = 6
        } else if (value == 13) {
            tempOrigin = [200, 200];
            tempScale = 10;
            tempNodeRadius = 6
        }
    
    
        args.setOrigin(tempOrigin);
        args.setScale(tempScale);
        args.setNodeRadius(tempNodeRadius);
    };
    
    var processData = (data, tt) => {
        var cluster_ood_node_num_map = {}
        var cluster_all_node_num_map = {}
        data[1].forEach(function(d) {
            if (d.cluster in cluster_all_node_num_map) {
                cluster_all_node_num_map[d.cluster] += 1
            } else {
                cluster_all_node_num_map[d.cluster] = 1
            }

            if (d.cluster in cluster_ood_node_num_map && d.ood_score >= args.props.ood_score_threshold) {
                cluster_ood_node_num_map[d.cluster] += 1
            } else if (d.ood_score >= args.props.ood_score_threshold) {
                cluster_ood_node_num_map[d.cluster] = 1
            }
        })
        var array_nodes = data[1]
        if (args.state.current_show_cluster !== -1) {
            array_nodes = data[1].filter(d => d.cluster == args.state.current_show_cluster);
        }

        
        /* ----------- GRID ----------- */
        var xGrid = svg.selectAll('path.grid').data(data[0], key);
        xGrid
            .enter()
            .append('path')
            .attr('class', '_3d grid')
            .merge(xGrid)
            .attr('stroke', 'black')
            .attr('stroke-width', 0)
            .attr('fill', function (d) { return d.ccw ? 'lightgrey' : '#717171'; })
            .attr('fill-opacity', 0)
            .attr('d', grid3d.draw);

        xGrid.exit().remove();

        /* ----------- POINTS ----------- */

        var points = svg.selectAll('circle').data(array_nodes, key);
        points
            .enter()
            .append('circle')
            .attr('class', '_3d')
            .attr('opacity', 0)
            .attr('cx', posPointX)
            .attr('cy', posPointY)
            .style("visibility", function (d) {
                return d.ood_score < args.props.ood_score_threshold && args.state.cluster_node_vis_value === "ood_only" ? "hidden" : "visible";
            })
            .on('mouseover', function (d, i) {
                d3.select('#tooltip')
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Prediction: " + d.pred + ", Cluster: " + d.cluster + ", OOD Score: " + d.ood_score)
                    .style("left", 5 + "px")
                    .style("top", 5 + "px")
                    .style("background-color", d.ood_score >= args.props.ood_score_threshold ? "hsla(10, 52%, 52%, 0.5)" : "hsla(199, 78%, 43%, 0.5)")
                
            })
            .on('mouseout', function (d, i) {
                tooltip.transition()
                .duration(500)
                .style("opacity", 0);
                const selected_nodes = args.props.cluster_selected_nodes;

                svg.selectAll('circle').each(function (dd, ii) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', '1.');
                })
            })
            .on("click", function (d, i) {
                const selected_nodes = args.props.cluster_selected_nodes;
                if (selected_nodes.includes(d)) {
                    // Node existed, should remove it.
                    args.props.handleUpdateClusterSelectedNodes(d, false, false);
                    d3.select(this)
                        .transition()
                        .duration(10)
                        .attr('r', args.state.node_radius)
                        .attr("stroke-width", 1)
                        .attr("fill", function(d) {
                            return clusterColor(d.cluster);
                        })
                } else {
                    d['from_table'] = false;
                    args.props.handleUpdateClusterSelectedNodes(d, true, false);
                    d3.select(this)
                        // .transition()
                        // .duration(1)
                        .attr('r', args.state.node_radius + 4)
                        .attr("stroke-width", 3)
                        .attr("fill", 'black')

                }

                var selected_cluster = {};
                selected_nodes.forEach(function(n) {
                    if (!selected_cluster[n.cluster]) {
                        selected_cluster[n.cluster] = 1;
                    } else {
                        selected_cluster[n.cluster] += 1;
                    }
                });

                svg.selectAll('circle').each(function (dd, ii) {
                    var opacity;
                    if (selected_cluster[dd.cluster]) {
                        opacity = '1.';
                    } else {
                        opacity = '.10'
                    }
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', opacity);
                })
            })
            
            .merge(points)
            .transition().duration(tt)
            .attr('r', function(d) {
                const selected_nodes = args.props.cluster_selected_nodes;
                if (selected_nodes.includes(d)) {
                    return args.state.node_radius + 4
                }
                return args.state.node_radius
            })
            .attr('stroke', function (d) {
                if (isClusterColor)
                    return d3.color(clusterColor(d.cluster)).darker(2);
                else
                    return d3.color(predColor(parsePredLabel[d.pred])).darker(2);
            })
            .attr('stroke-width', function(d) {
                const selected_nodes = args.props.cluster_selected_nodes;
                if (selected_nodes.includes(d)) {
                    return 3
                }
                return 1
            })
            .attr('fill', function (d) {
                const selected_nodes = args.props.cluster_selected_nodes;
                if (selected_nodes.includes(d)) {
                    return 'black'
                }
                return clusterColor(d.cluster);
                
            })
            .attr('opacity', "1.")
            .attr('cx', posPointX)
            .attr('cy', posPointY);
        points.exit().remove();

        /* ----------- LEGEND ----------- */
        svg.selectAll("g").remove();
        const colorLegendG = svg.append('g')
            .attr("transform", "translate(0,500)");
            

        const colorLegend = d3Legend.legendColor()
            .labelFormat(d3.format(".2f"))
            .scale(isClusterColor ? clusterColor : predColor)
            .labels(isClusterColor ? clusterColorLabels : predColorLabels)
            

        colorLegendG.call(colorLegend)

        svg.selectAll('.cell')
            .attr('transform', function (d, i) {
                const padding = 5;
                if (i < 4) {
                    return "translate(" + 40 + "," + ((i % 4 - 3) * 17 + padding * i) + ")"
                } else if (i < 8) {
                    return "translate(" + 150 + "," + ((i % 4 - 3) * 17 + padding * (i - 4)) + ")"
                } else if (i < 12) {
                    return "translate(" + 260 + "," + ((i % 4 - 3) * 17 + padding * (i - 8)) + ")"
                } else if (i < 16) {
                    return "translate(" + 370 + "," + ((i % 4 - 3) * 17 + padding * (i - 12)) + ")"
                }
            });
            
        
        svg.selectAll('.cell').each(function (dd, ii) {
            var opacity;
            if (args.state.current_show_cluster === -1) {
                return '1.';
            } else if (dd === args.state.current_show_cluster) {
                opacity = '1.';
            } else {
                opacity = '.30'
            }
            d3.select(this)
                .transition()
                .duration(50)
                .attr('opacity', opacity);
        })

        svg.selectAll('.cell')
            .on('mouseover', function (d, i) {
                d3.select('#tooltip')
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Cluster " + d + " All Nodes number: " + cluster_all_node_num_map[d] + ", OoD Nodes number: " + cluster_ood_node_num_map[d])
                    .style("left", 5 + "px")
                    .style("top", 5 + "px")
                    .style("background-color", "hsla(199, 78%, 43%, 0.5)")
                svg.selectAll('circle').each(function (dd, ii) {
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', dd.cluster === d ? '1.' : '.10');
                })

                d3.select(this)
                    .transition()
                    .duration(50)
                    
            })
            .on('mouseout', function (d, i) {
                tooltip.transition()
                .duration(500)
                .style("opacity", 0);
                const selected_nodes = args.props.cluster_selected_nodes;
                var selected_cluster = {};
                selected_nodes.forEach(function(n) {
                    if (!selected_cluster[n.cluster]) {
                        selected_cluster[n.cluster] = 1;
                    } else {
                        selected_cluster[n.cluster] += 1;
                    }
                });

                svg.selectAll('circle').each(function (dd, ii) {
                    var opacity;
                    if (selected_cluster[dd.cluster]) {
                        opacity = '1.';
                    } else if (selected_nodes.length === 0) {
                        opacity = '1.';
                    } else {
                        opacity = '.10'
                    }
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .attr('opacity', opacity);
                })
            })
            .on('click', function (d, i) {
                if (d === args.state.current_show_cluster) {
                    handleCurrentShowCluster(-1);
                } else {
                    handleCurrentShowCluster(d);
                }
            })
    }
    
    var parsePredLabel = {
        'Company': '0',
        'Educational Institution': '1',
        'Artist': '2',
        'Athlete': '3',
        'OfficeHolder': '4',
        'MeanOfTransportation': '5',
        'Building': '6',
        'NaturalPlace': '7',
        'Village': '8',
        'Animal': '9',
        'Plant': '10',
        'Album': '11',
        'Film': '12',
        'WrittenWork': '13',
    }
    var posPointX = (d) => {
        return d.projected.x;
    }

    var posPointY = (d) => {
        return d.projected.y;
    }

    var init = () => {
        const kmeans_data = require('../../data/dbpedia/test.json');
        var x_max = null;
        var x_min = null;
        var y_max = null;
        var y_min = null;
        var z_max = null;
        var z_min = null;
        xGrid = [];
        scatter = [];
        yLine = [];

        kmeans_data.forEach(i => {
            var temp = i;
            temp.x = temp.x;
            temp.y = temp.y;
            temp.z = temp.z;
            scatter.push(temp);
            if (x_max == null) {
                x_max = temp.x;
                x_min = temp.x;
                y_max = temp.y;
                y_min = temp.y;
                z_max = temp.z;
                z_min = temp.z;
            }
            if (temp.x > x_max) {
                x_max = temp.x;
            }
            if (temp.x < x_min) {
                x_min = temp.x;
            }
            if (temp.y > y_max) {
                y_max = temp.y;
            }
            if (temp.y < y_min) {
                y_min = temp.y;
            }
            if (temp.z > z_max) {
                z_max = temp.z;
            }
            if (temp.z < z_min) {
                z_min = temp.z;
            }
        });

        for (var z = y_min; z < y_min + 20; z++) {
            for (var x = x_min; x < x_min + 20; x++) {
                xGrid.push([x, y_max, z]);
            }
        }


        d3.range(y_max, y_min, -2).forEach(function (d) { yLine.push([x_min, d, z_min]); });
        d3.range(-1, 11, 1).forEach(function (d) { testyLine.push([-j, -d, -j]); });

        // d3.range(y_min, y_max, 5).forEach(function (d) { yLine.push([x_min, -d, z_min]); });

        var data = [
            grid3d(xGrid),
            point3d(scatter)
        ];
        processData(data, 10);
    }

    function dragStart() {
        mx = d3.event.x;
        my = d3.event.y;
    }

    function dragged() {
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta = (d3.event.x - mx + mouseX) * Math.PI / 230;
        alpha = (d3.event.y - my + mouseY) * Math.PI / 230 * (-1);
        var data = [
            grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
            point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter)
        ];
        processData(data, 0);
    }

    function dragEnd() {
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }

    /* ----------- ZOOM ----------- */
    function zoomed() {
        const currentTransform = d3.event.transform;
        svg.attr("transform", currentTransform);
    }

    init();
}


export default draw;