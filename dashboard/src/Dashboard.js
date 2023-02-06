import React, { Component } from 'react';
import { Layout } from 'antd';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import './dashboard.css';
import DataTable from './views/instance_view';
import IconArray from './views/iconarray_view';
import BarChartView from "./views/barchart_view";
import ScatterPlotView from './views/scatterPlot';
import HighlightChartView from './views/highlight_view';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slider from '@material-ui/core/Slider';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CircleIcon from '@mui/icons-material/Circle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Masonry from '@mui/lab/Masonry';

import keywords_image_0 from "./data/dbpedia/keywords_images/word_cloud_cluster_0.png"
import keywords_image_1 from "./data/dbpedia/keywords_images/word_cloud_cluster_1.png"
import keywords_image_2 from "./data/dbpedia/keywords_images/word_cloud_cluster_2.png"
import keywords_image_3 from "./data/dbpedia/keywords_images/word_cloud_cluster_3.png"
import keywords_image_4 from "./data/dbpedia/keywords_images/word_cloud_cluster_4.png"
import keywords_image_5 from "./data/dbpedia/keywords_images/word_cloud_cluster_5.png"
import keywords_image_6 from "./data/dbpedia/keywords_images/word_cloud_cluster_6.png"
import keywords_image_7 from "./data/dbpedia/keywords_images/word_cloud_cluster_7.png"
import keywords_image_8 from "./data/dbpedia/keywords_images/word_cloud_cluster_8.png"
import keywords_image_9 from "./data/dbpedia/keywords_images/word_cloud_cluster_9.png"
import keywords_image_10 from "./data/dbpedia/keywords_images/word_cloud_cluster_10.png"
import keywords_image_11 from "./data/dbpedia/keywords_images/word_cloud_cluster_11.png"
import keywords_image_12 from "./data/dbpedia/keywords_images/word_cloud_cluster_12.png"
import keywords_image_13 from "./data/dbpedia/keywords_images/word_cloud_cluster_13.png"

const { Sider, Content, Footer, Header } = Layout;

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test_data: require('./data/dbpedia/test.json'),
            main_view_tab_value: 0,
            model_test_oracle: 0.9866,  // imdb is 0.89248
            ood_score_threshold_orgin: 0.0018,
            ood_score_threshold: 0.0018,
            cluster_selected_nodes: [],
            test_table_selected_node: { cluster: 0 },
            current_cluster_keywords: ["river","family","species","county","genus","crater","north","journal","state","plants"],
            ood_highlight_loading: false,
            id_highlight_loading: false,
            ood_sentence_activity: null,
            id_sentence_activity: null,
            does_cluster_refresh: false,
            current_filtered_cluster: -1,
        }
    }

    setTrainingData = (value) => {
        this.setState({
            training_data: value
        })
    }

    setTestData = (value) => {
        this.setState({
            test_data: value
        })
    }

    setMainViewTabVable = (value) => {
        this.setState({
            main_view_tab_value: Number(value)
        })
    }

    setOodScoreThreshold = (value) => {
        this.setState({
            ood_score_threshold: Number(value)
        })
    };

    setModelTestOracle = (value) => {
        this.setState({
            model_test_oracle: value
        })
    };

    setClusterSelectedNodes = (value) => {
        this.setState({
            cluster_selected_nodes: value
        });
    }

    setCurrentClusterKeywords = (value) => {
        this.setState({
            current_cluster_keywords: value
        })
    }
    setOodHighlightLoading = (value) => {
        this.setState({
            ood_highlight_loading: value
        })
    };

    setIdHighlightLoading = (value) => {
        this.setState({
            id_highlight_loading: value
        })
    };

    setIdSentenceActivity = (value) => {
        this.setState({
            id_sentence_activity: value
        })
    };

    setOodSentenceActivity = (value) => {
        this.setState({
            ood_sentence_activity: value
        })
    };

    setTestTableSelectedNode = (value) => {
        this.setState({
            test_table_selected_node: value
        });
    };

    setDoesClusterRefresh = (value) => {
        this.setState({
            does_cluster_refresh: value
        })
    };

    setCurrentFilteredCluster = (value) => {
        this.setState({
            current_filtered_cluster: value
        });
    };


    render() {
        var training_data = require('./data/dbpedia/train.json');
        var ecco_train = require('./data/dbpedia/ecco/train.json');
        var ecco_test = require('./data/dbpedia/ecco/test.json');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const { ood_score_threshold } = this.state;

        const calculateIdOodPercentage = (data, ood_score) => {
            let id = 0;
            let ood = 0;
            for (let i = 0; i < data.length; i++) {
                if (data[i].ood_score >= ood_score) {
                    ood += 1;
                } else {
                    id += 1;
                }
            }
            return Math.round(id / (id + ood) * 100);
        };

        const handleTrainingData = () => {
            training_data.forEach(function (d) {
                d['ood_score'] = Number(d['ood_score']).toFixed(4);
                if (d['ood_score'] == 0) {
                    d['ood_score'] = -0.0001;
                }
                d['sentence_activity'] = ecco_train[Number(d['id'])]
            })
            return training_data;
        }

        const splitDataIdOod = () => {
            let id_data = [];
            let ood_data = [];
            for (let i = 0; i < this.state.test_data.length; i++) {
                var temp = this.state.test_data[i];
                temp['sentence_activity'] = ecco_test[Number(temp['id'])]
                temp['pinned'] = '-1' + '_' + temp['salient_score']
                temp['ood_score'] = Number(temp['ood_score']).toFixed(4);
                if (temp['ood_score'] == 0) {
                    temp['ood_score'] = -0.0001;
                }
                if (temp.ood_score >= ood_score_threshold) {
                    ood_data.push(temp);
                } else {
                    id_data.push(temp);
                }
            }
            return [id_data, ood_data];
        };

        const handleOodScoreSliderChangeComplete = (event, value) => {
            this.setOodScoreThreshold(value);
        };
        const handleTabChange = (event, newValue) => {
            this.setMainViewTabVable(newValue);
        };

        const IOSSlider = styled(Slider)(({ theme }) => ({
            '& .MuiSlider-valueLabel': {
                fontSize: 14,
                fontWeight: 'normal',
                top: -20,
                backgroundColor: 'unset',
                color: theme.palette.text.primary,
                '&:before': {
                    display: 'none',
                },
                '& *': {
                    background: 'transparent',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                },
            },
            '& .MuiSlider-track': {
                border: 'none',
            },
            '& .MuiSlider-rail': {
                opacity: 0.5,
                backgroundColor: '#bfbfbf',
            },
            '& .MuiSlider-mark': {
                backgroundColor: '#bfbfbf',
                height: 8,
                width: 1,
                '&.MuiSlider-markActive': {
                    opacity: 1,
                    backgroundColor: 'currentColor',
                },
            },
        }));

        const handleUpdateClusterSelectedNodes = (newSelectedNode, doesAdd, doesRefresh) => {
            var cluster_selected_nodes = this.state.cluster_selected_nodes;
            console.log("check handleUpdateClusterSelectedNodes ", newSelectedNode, doesAdd, doesRefresh);
            if (doesAdd) {
                cluster_selected_nodes.push(newSelectedNode);
            } else {
                cluster_selected_nodes = cluster_selected_nodes.filter(function (value, index, arr) {
                    return value.id !== newSelectedNode.id;
                });
            }
            this.setClusterSelectedNodes(cluster_selected_nodes);
            this.setDoesClusterRefresh(doesRefresh);
        };

        const clearClusterSelectedNodes = () => {
            this.setClusterSelectedNodes([]);
            this.setDoesClusterRefresh(true);
        };

        const StyledAccordion = styled(Accordion)(({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            color: theme.palette.text.secondary,
        }));

        const getKeywordsCloudImage = function(cluster_label) {
            switch (cluster_label) {
                case -1:
                    return keywords_image_0
                case 0:
                    return keywords_image_0
                case 1:
                    return keywords_image_1
                case 2:
                    return keywords_image_2
                case 3:
                    return keywords_image_3
                case 4:
                    return keywords_image_4
                case 5:
                    return keywords_image_5
                case 6:
                    return keywords_image_6
                case 7:
                    return keywords_image_7
                case 8:
                    return keywords_image_8
                case 9:
                    return keywords_image_9
                case 10:
                    return keywords_image_10
                case 11:
                    return keywords_image_11
                case 12:
                    return keywords_image_12
                case 13:
                    return keywords_image_13
              }
        }

        return (
            <div style={{ backgroundColor: '#f9f9f9', height: windowHeight * 1.4 }}>
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h4" color="inherit">
                                    DeepLens
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Header>

                    <Layout style={{ height: windowHeight * 0.85 }}>
                        <Sider theme="light" width={windowWidth * 0.16} >
                            <Content>
                                <div style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, }}>
                                    <Typography variant="body2" color="primary">
                                        Out of Distribution score threshold
                                    </Typography>
                                    <IOSSlider
                                        aria-label="OOD threshold slider"
                                        valueLabelDisplay="on"
                                        value={this.state.ood_score_threshold}
                                        step={0.0001}
                                        max={0.01}
                                        min={-0.0001}
                                        onChangeCommitted={handleOodScoreSliderChangeComplete}
                                        style={{ paddingTop: 30 }}
                                    />
                                    <Button
                                        style={{ marginTop: -20 }}
                                        startIcon={<RestartAltIcon />}
                                        size="small"
                                        sx={{ m: 1 }}
                                        onClick={() => {
                                            this.setOodScoreThreshold(this.state.ood_score_threshold_orgin);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <div style={{ textAlign: "left", paddingLeft: 20, marginBottom: -10 }}>
                                    <Button 
                                        disabled 
                                        style={{ color: "#90caf9" }} 
                                        startIcon={<CircleIcon />}
                                        size="small"
                                    >
                                        In Distribution (ID)
                                    </Button>
                                    <Button 
                                        disabled 
                                        style={{ color: "#ef9a9a" }} 
                                        startIcon={<CircleIcon />}
                                        size="small"
                                    >
                                        Out of Distribution (OOD)
                                    </Button>
                                </div>
                                <Box sx={{
                                    display: 'grid',
                                    gridAutoFlow: 'row',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 1,
                                }} style={{ backgroundColor: 'white', padding: 20, marginLeft: 5, borderRadius: 5, }}>
                                    <div>
                                        <Typography variant="body2" color="primary" style={{ textAlign: "center" }}>
                                            Training Data
                                        </Typography>
                                        <Box alignItems="center" justifyContent="center" m="auto" display="flex" >
                                            <IconArray percent={calculateIdOodPercentage(training_data, ood_score_threshold)} />
                                        </Box>
                                        <Typography variant="body2" color="primary" style={{ textAlign: "center" }}>
                                            {calculateIdOodPercentage(training_data, ood_score_threshold)}%
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" color="primary" style={{ textAlign: "center" }}>
                                            Test Data
                                        </Typography>
                                        <Box alignItems="center" justifyContent="center" m="auto" display="flex">
                                            <IconArray percent={calculateIdOodPercentage(this.state.test_data, ood_score_threshold)} />
                                        </Box>
                                        <Typography variant="body2" color="primary" style={{ textAlign: "center" }}>
                                            {calculateIdOodPercentage(this.state.test_data, ood_score_threshold)}%
                                        </Typography>
                                    </div>
                                </Box>
                                <Content>
                                    <div style={{ marginBottom: 5, paddingLeft: 20, paddingTop: 5 }}>
                                        <Typography variant="body2" color="primary" >
                                            Test Data ID/OOD score distribution
                                        </Typography>
                                    </div>
                                    <Box style={{ padding: 5, backgroundColor: 'white', borderRadius: 5, }}>
                                        <BarChartView data={this.state.test_data} ood_score_threshold={ood_score_threshold} width={windowWidth * 0.16} />
                                    </Box>
                                </Content>
                            </Content>

                        </Sider>
                        <Layout style={{ backgroundColor: '#f9f9f9' }}>
                            <Content style={{ width: windowWidth * 0.82}}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={this.state.main_view_tab_value} onChange={handleTabChange} aria-label="basic tabs example">
                                            <Tab label="ID / OOD" {...a11yProps(0)} />
                                            <Tab label="Train / Test" {...a11yProps(1)} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={this.state.main_view_tab_value} index={0}>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                        }}>
                                            <Content style={{ marginRight: 10}}>
                                                <Box sx={{
                                                    display: 'grid', gridTemplateColumns: 'repeat(1, 2fr)'
                                                }}>
                                                    <div>
                                                        <Typography variant="body1" color="primary">
                                                            OOD Data
                                                        </Typography>
                                                        <div style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, display: 'flex', alignItem: 'center', justifyContent: 'center' }}>
                                                            <DataTable
                                                                cluster_selected_nodes={this.state.cluster_selected_nodes}
                                                                current_filtered_cluster={this.state.current_filtered_cluster}
                                                                divide_type={'IDOOD_OOD'}
                                                                page_size={5}
                                                                ood_score_threshold={ood_score_threshold}
                                                                import_data={splitDataIdOod()[1]}
                                                                width={windowWidth * 0.5}
                                                                height={windowHeight * 0.35}
                                                                keywords={[]}
                                                                column_keys={['id', 'pred', 'cluster', 'text', 'ood_score', 'pinned']}
                                                                setLoading={this.setOodHighlightLoading}
                                                                setSentenceActivity={this.setOodSentenceActivity}
                                                                handleUpdateClusterSelectedNodes={handleUpdateClusterSelectedNodes}
                                                            />
                                                        </div>

                                                    </div>
                                                    <div style={{ paddingTop: 5 }}>
                                                        <Typography variant="body1" color="primary">
                                                            ID Data
                                                        </Typography>
                                                        <div style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, }}>
                                                            <DataTable
                                                                cluster_selected_nodes={this.state.cluster_selected_nodes}
                                                                divide_type={'IDOOD_ID'}
                                                                page_size={5}
                                                                ood_score_threshold={ood_score_threshold}
                                                                import_data={splitDataIdOod()[0]}
                                                                width={windowWidth * 0.5}
                                                                height={windowHeight * 0.35}
                                                                keywords={this.state.current_cluster_keywords}
                                                                column_keys={['id', 'pred', 'cluster', 'text', 'ood_score', 'pinned']}
                                                                setLoading={this.setIdHighlightLoading}
                                                                setSentenceActivity={this.setIdSentenceActivity}
                                                                handleUpdateClusterSelectedNodes={handleUpdateClusterSelectedNodes}
                                                            />
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Content>
                                            <Box sx={{
                                                    display: 'grid', gridTemplateColumns: 'repeat(1, 2fr)'
                                                }} style={{ backgroundColor: 'white' }}>
                                                <div style={{ marginTop: -60 }}>
                                                    <div style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, }}>
                                                        <ScatterPlotView
                                                            handleUpdateClusterSelectedNodes={handleUpdateClusterSelectedNodes}
                                                            clearClusterSelectedNodes={clearClusterSelectedNodes}
                                                            ood_score_threshold={ood_score_threshold}
                                                            does_cluster_refresh={this.state.does_cluster_refresh}
                                                            cluster_selected_nodes={this.state.cluster_selected_nodes}
                                                            setCurrentFilteredCluster={this.setCurrentFilteredCluster}

                                                            width={windowWidth * 0.29}
                                                            height={windowHeight * 0.58}
                                                        />
                                                    </div>
                                                    <div style={{ width: windowWidth * 0.3, paddingLeft: 10, paddingRight: 10 }}>
                                                        <Typography variant="h6" color="black" >
                                                            The keywords of cluster {
                                                                // this.state.main_view_tab_value === 0 ?
                                                                //     this.state.cluster_selected_nodes.length === 0 ?
                                                                //         0 :
                                                                //         this.state.cluster_selected_nodes[this.state.cluster_selected_nodes.length - 1].cluster :
                                                                //     this.state.test_table_selected_node.cluster
                                                                this.state.current_filtered_cluster === -1 ? 0 : this.state.current_filtered_cluster
                                                            } are:
                                                        </Typography>
                                                        <Box
                                                            component="img"
                                                            sx={{
                                                                maxHeight: windowHeight * 0.23,
                                                                maxWidth: windowWidth * 0.3
                                                            }}
                                                            alt="The keywords"
                                                            src={getKeywordsCloudImage(this.state.current_filtered_cluster)}
                                                        />
                                                    </div>
                                                </div>
                                            </Box>
                                        </Box>
                                    </TabPanel>
                                    <TabPanel value={this.state.main_view_tab_value} index={1}>
                                        <Box sx={{
                                            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'
                                        }}>
                                            <div style={{ paddingRight: 10 }}>
                                                <Typography variant="body1" color="primary">
                                                    Training Data
                                                </Typography>
                                                <div style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, }}>
                                                    <DataTable
                                                        divide_type={'TRAINTEST_TRAIN'}
                                                        page_size={19}
                                                        ood_score_threshold={ood_score_threshold}
                                                        import_data={handleTrainingData()}
                                                        width={windowWidth * 0.4}
                                                        height={windowHeight * 0.62}
                                                        keywords={[]}
                                                        column_keys={['id', 'pred', 'groudtruth_label', 'text', 'ood_score']}
                                                        setLoading={this.setIdHighlightLoading}
                                                        setSentenceActivity={this.setIdSentenceActivity}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ paddingLeft: 10 }}>
                                                <Typography variant="body1" color="primary">
                                                    Test Data
                                                </Typography>
                                                <div style={{ backgroundColor: 'white', padding: 5, borderRadius: 5, }}>
                                                    <DataTable
                                                        divide_type={'TRAINTEST_TEST'}
                                                        page_size={19}
                                                        ood_score_threshold={ood_score_threshold}
                                                        import_data={this.state.test_data}
                                                        width={windowWidth * 0.4}
                                                        height={windowHeight * 0.62}
                                                        keywords={[]}
                                                        column_keys={['id', 'pred', 'cluster', 'text', 'ood_score']}
                                                        setLoading={this.setOodHighlightLoading}
                                                        setSentenceActivity={this.setOodSentenceActivity}
                                                    />
                                                </div>
                                            </div>
                                        </Box>
                                    </TabPanel>
                                </Box>
                            </Content>
                        </Layout>
                    </Layout>
                    {this.state.main_view_tab_value === 0 &&
                        <Layout style={{ height: windowHeight * 0.25, backgroundColor: '#f9f9f9' }}>
                            <Content style={{ width: windowWidth * 0.99, paddingLeft: 20, paddingTop: 40, height: windowHeight * 0.45 }}>
                                <Box sx={{
                                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'
                                }}>
                                    <div style={{ width: windowWidth * 0.47, marginRight: 10, borderRadius: 5, }}>
                                        <Typography variant="body1" color="primary" style={{ textAlign: "left" }}>
                                            ID Sample
                                        </Typography>
                                        <Box sx={{ width: windowWidth * 0.47, minHeight: 377 }}>
                                            <Masonry columns={1} spacing={0.5}>
                                                {this.state.cluster_selected_nodes.filter(function (n) {
                                                    return n.ood_score < ood_score_threshold;
                                                }).map((node, index, arrayRef) => (
                                                    <Paper key={index}>
                                                        <StyledAccordion sx={{ minHeight: 30 }} defaultExpanded={index === (arrayRef.length - 1)}>
                                                            <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
                                                                <Typography>{node.text.length >= 95 ? (node.text).substring(0, 95) + '...' : node.text}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <HighlightChartView
                                                                    json_data={node.sentence_activity}
                                                                    width={windowWidth * 0.47}
                                                                    height={windowHeight * 0.4}
                                                                    isLoading={false}
                                                                />
                                                            </AccordionDetails>
                                                        </StyledAccordion>
                                                    </Paper>
                                                ))}
                                            </Masonry>
                                        </Box>
                                    </div>
                                    <div style={{ width: windowWidth * 0.47, marginRight: 10 }}>
                                        <Typography variant="body1" color="primary" style={{ textAlign: "left" }}>
                                            OOD Sample
                                        </Typography>
                                        <Box sx={{ width: windowWidth * 0.47, minHeight: 377 }}>
                                            <Masonry columns={1} spacing={0.5}>
                                                {this.state.cluster_selected_nodes.filter(function (n) {
                                                    return n.ood_score >= ood_score_threshold;
                                                }).map((node, index, arrayRef) => (
                                                    <Paper key={index}>
                                                        <StyledAccordion sx={{ minHeight: 30 }} defaultExpanded={index === (arrayRef.length - 1)}>
                                                            <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
                                                                <Typography>{node.text.length >= 97 ? (node.text).substring(0, 97) + '...' : node.text}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <HighlightChartView
                                                                    json_data={node.sentence_activity}
                                                                    width={windowWidth * 0.47}
                                                                    height={windowHeight * 0.4}
                                                                    isLoading={false}
                                                                />
                                                            </AccordionDetails>
                                                        </StyledAccordion>
                                                    </Paper>
                                                ))}
                                            </Masonry>
                                        </Box>
                                    </div>
                                </Box>
                            </Content>
                        </Layout>}
                </Layout>
            </div>
        )
    }
}