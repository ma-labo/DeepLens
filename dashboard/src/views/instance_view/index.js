import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { alpha, styled } from '@mui/material/styles';
import {
    DataGrid,
    gridClasses,
    GridToolbarContainer,
    GridToolbarFilterButton,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import clsx from 'clsx';

import { createTheme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';


function isOverflown(element) {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
}

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.pin`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
    [`& .${gridClasses.row}.top`]: {
        backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }

}));

const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    React.useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                alignItems: 'center',
                lineHeight: '24px',
                width: 1,
                height: 1,
                position: 'relative',
                display: 'flex',
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <Box
                ref={cellValue}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {value}
            </Box>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current.offsetHeight - 3 }}
                    >
                        <Typography variant="body2" style={{ padding: 8 }}>
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});

GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
};

function renderCellExpand(params) {
    return (
        <GridCellExpand value={params.value || ''} width={window.innerWidth * 0.3} />
    );
}


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            {/* <GridToolbarColumnsButton /> */}
            <GridToolbarFilterButton />
            {/* <GridToolbarDensitySelector /> */}
            {/* <GridToolbarExport /> */}
        </GridToolbarContainer>
    );
}

renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The cell value, but if the column has valueGetter, use getValue.
     */
    value: PropTypes.string.isRequired,
};


const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) =>
        createStyles({
            root: {
                border: `1px solid ${theme.palette.divider}`,
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: 26,
                borderRadius: 2
            },
            value: {
                position: "absolute",
                lineHeight: "24px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
            },
            bar: {
                height: "100%",
                "&.low": {
                    backgroundColor: "#f44336"
                },
                "&.medium": {
                    backgroundColor: "hsla(10, 52%, 52%, 0.5)",
                },
                "&.high": {
                    backgroundColor: "hsla(199, 78%, 43%, 0.5)",
                }
            },

        }),
    { defaultTheme }
);

const ProgressBar = React.memo(function ProgressBar(props) {
    const { value, ood_score_threshold } = props;
    const valueInPercent = value;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div
                className={classes.value}
            >{`${valueInPercent}`}</div>
            <div
                className={clsx(classes.bar, {
                    low: valueInPercent < -100,
                    high: valueInPercent >= -100 && valueInPercent < ood_score_threshold,
                    medium: valueInPercent >= ood_score_threshold
                })}
                style={{ maxWidth: `${valueInPercent}` }}
            />
        </div>
    );
});

const idPinnedComparator = function (v1, v2) {
    const v1_arr = v1.split('_');
    const v2_arr = v2.split('_');
    if (v1_arr[0] !== '-1') {
        return Number(v1_arr[0]) - Number(v2_arr[0]);
    } else {
        if (v2_arr[0] !== '-1') {
            return Number(v1_arr[0]) - Number(v2_arr[0]);
        }
        return Number(v1_arr[1]) - Number(v2_arr[1]);
    }
}

const oodPinnedComparator = function (v1, v2) {
    const v1_arr = v1.split('_');
    const v2_arr = v2.split('_');
    if (v1_arr[0] !== '-1') {
        return Number(v1_arr[0]) - Number(v2_arr[0]);
    } else {
        if (v2_arr[0] !== '-1') {
            return Number(v1_arr[0]) - Number(v2_arr[0]);
        }
        return Number(v2_arr[1]) - Number(v1_arr[1]);
    }
}

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

export default class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.import_data,
            columnKeys: this.props.column_keys,
            cluster_selected_nodes: this.props.cluster_selected_nodes,
            filterModel: { items: [] },
            sortingModel: this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'TRAINTEST_TEST' ?
                [{ field: 'ood_score', sort: 'desc' }] : [{ field: 'ood_score', sort: 'asc' }]

        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'IDOOD_ID') {
            var tempData = this.state.tableData;
            tempData.forEach(function (d) {
                // d['ood_score'] = Number(d['ood_score']).toFixed(4);
                const index = nextProps.cluster_selected_nodes.indexOf(d)
                if (index !== -1) {
                    d['pinned'] = String(index) + '_' + String(d['salient_score']);
                }
            });
            this.setTableData(tempData);
            this.setSortingModel([{ field: 'pinned', sort: 'desc' }]);
            if (this.props.divide_type === 'IDOOD_OOD') {
                this.setFilterModel(nextProps.current_filtered_cluster !== -1 ?
                    {
                        "items": [
                            {
                                "columnField": "cluster",
                                "operatorValue": "equals",
                                "value": String(nextProps.current_filtered_cluster)
                            }
                        ]
                    } :
                    {
                        "items": []
                    }
                )
            }
        }
    }

    setColumnKeys = (value) => {
        this.setState({
            columnKeys: value
        });
    }
    setTableData = (value) => {
        this.setState({
            tableData: value
        })
    };

    setSortingModel = (value) => {
        this.setState({
            sortingModel: value
        })
    }

    setFilterModel = (value) => {
        this.setState({
            filterModel: value
        })
    }


    render() {
        const renderProgress = (params) => {
            return <ProgressBar value={Number(params.value)} ood_score_threshold={this.props.ood_score_threshold} />;
        }

        const handleSentenceActivity = (value) => {
            if (!value) {
                this.props.setSentenceActivity(null);
            } else if (value.factors[0].length == 0) {
                alert("Cannot generate sentence activity!");
            } else {
                this.props.setSentenceActivity(value);
            }
        };

        const table_width = this.props.width;

        const table_height = this.props.height;
        const { columnKeys } = this.state;

        const handleCancelSelection = id => () => {
            const selectedRowData = this.state.tableData.filter((row) =>
                id === row.id
            );

            if (this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'IDOOD_ID') {
                if (this.props.cluster_selected_nodes.includes(selectedRowData[0])) {
                    selectedRowData[0]['from_table'] = true;
                    this.props.handleUpdateClusterSelectedNodes(selectedRowData[0], false, true);
                }
            }
        }

        const defaultColumns = [
            {
                field: 'id',
                headerName: 'ID',
                maxWidth: table_width * 0.05,
                hide: false,
            },
            {
                field: 'pinned',
                headerName: 'PINNED',
                hide: true,
                sortComparator: this.props.divide_type === 'IDOOD_OOD' ? idPinnedComparator : oodPinnedComparator,
            },
            {
                field: 'pred',
                headerName: 'Prediction',
                flex: 1,
                maxWidth: table_width * 0.14,
                renderCell: (this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'IDOOD_ID') ? params => (
                    params.getValue(params.id, 'pinned').split('_')[0] !== '-1' ?
                        (<div><IconButton onClick={handleCancelSelection(params.id)}><CancelIcon /></IconButton> {params.value} </div>) : renderCellExpand(params)
                ) : renderCellExpand,
                headerAlign: "center",
            },
            {
                field: 'groudtruth_label',
                headerName: 'Groud Truth',
                flex: 1,
                maxWidth: table_width * 0.1,
                renderCell: renderCellExpand,
                headerAlign: "center",
            },
            {
                field: 'cluster',
                headerName: 'Cluster',
                flex: 1,
                maxWidth: table_width * 0.1,
                headerAlign: "center",
                align: "center"
            },
            {
                field: 'text',
                headerName: 'Text',
                flex: 1,
                minWidth: table_width * 0.37,
                renderCell: renderCellExpand,
                headerAlign: "center",
            },
            {
                field: 'ood_score',
                headerName: 'OOD Score',
                flex: 1,
                maxWidth: this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'IDOOD_ID' ? table_width * 0.15 : table_width * 0.12,
                renderCell: renderProgress,
                headerAlign: "center",
            },

        ];

        const columns = defaultColumns.filter(column => columnKeys.some(field => field === column.field));
        const axios = require('axios');

        return (
            <div style={{ height: table_height, width: table_width }}>
                <StripedDataGrid
                    autoHeight
                    density="compact"
                    rows={this.state.tableData}
                    columns={columns}
                    pageSize={this.props.page_size}
                    sortModel={this.state.sortingModel}
                    onSortModelChange={(newSortModel) => this.setSortingModel(newSortModel)}
                    filterModel={this.state.filterModel}
                    onFilterModelChange={(newFilterModel) => this.setFilterModel(newFilterModel)}
                    components={{
                        Toolbar: CustomToolbar,
                        Pagination: CustomPagination,
                    }}
                    getRowClassName={(params) => {
                        if (this.props.divide_type === 'IDOOD_OOD' || this.props.divide_type === 'IDOOD_ID') {
                            if (params.row.pinned.split('_')[0] === '-1') {
                                return 'reg'
                            } else {
                                if (params.indexRelativeToCurrentPage === 0) {
                                    return 'top'
                                } else {
                                    return 'pin'
                                }
                            }
                        }
                        return 'reg'
                    }}
                    isRowSelectable={(params) => {
                        if (this.props.divide_type !== 'IDOOD_OOD' && this.props.divide_type !== 'IDOOD_ID') {
                            return false
                        }
                        return params.row.pinned.split('_')[0] === '-1';
                    }}
                    onSelectionModelChange={(ids) => {
                        setTimeout(() => {
                            this.props.setLoading(true)
                        }, 0);

                        const selectedIDs = new Set(ids);
                        const selectedRowData = this.state.tableData.filter((row) =>
                            selectedIDs.has(row.id)
                        );

                        if (!selectedRowData[0]) {
                            handleSentenceActivity(null);
                            setTimeout(() => {
                                this.props.setLoading(false);
                            }, 0);
                        } else {
                            const divide_type = this.props.divide_type;
                            const handleUpdateClusterSelectedNodes = this.props.handleUpdateClusterSelectedNodes;
                            if (divide_type === 'IDOOD_OOD' || divide_type === 'IDOOD_ID') {
                                if (!this.props.cluster_selected_nodes.includes(selectedRowData[0])) {
                                    selectedRowData[0]['from_table'] = true;
                                }
                            } else {
                                this.props.setTableSelectedNode(selectedRowData[0]);
                            }

                            const type = this.props.divide_type === 'TRAINTEST_TRAIN' ? 'train' : 'test';

                            if (divide_type === 'IDOOD_OOD' || divide_type === 'IDOOD_ID') {
                                // selectedRowData[0]['sentence_activity'] = response.data
                                handleUpdateClusterSelectedNodes(selectedRowData[0], true, true);
                            }

                            // axios.get('http://127.0.0.1:5000/' + 'sentence_neuron_activity?id=' + selectedRowData[0].id + '&type=' + type)
                            //     .then(function (response) {

                            //     })
                            //     .catch(function (error) {
                            //         // handle error
                            //         console.error(error);
                            //     })
                            //     .then(() => {
                            //         // always executed
                            //         setTimeout(() => {
                            //             this.props.setLoading(false);
                            //         }, 0);
                            //     });
                        }

                    }}
                />
            </div>
        )
    }
}