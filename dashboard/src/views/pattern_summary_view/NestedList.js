import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import BugReportIcon from '@material-ui/icons/BugReport';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// console.log(buggy_pattern)

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 500,
        height: '100%',
        maxHeight: 800,
        backgroundColor: '#f0f2f5',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function removePound(str) {
    let new_str = ''
    let word_array = str.split(' ')
    if ((word_array[0][0] === '#') && word_array[0][1] === '#') {
        new_str = word_array[0].slice(2, word_array[0].length)
    }
    else {
        new_str = word_array[0]
    }
    for (let i = 1; i < word_array.length; i++) {
        new_str += ' '
        if ((word_array[i][0] === '#') && word_array[i][1] === '#') {
            new_str = new_str.slice(0, new_str.length - 1)
            new_str += (word_array[i].slice(2, word_array[i].length))
        }
        else {
            new_str += (word_array[i])
        }
    }
    return new_str
}

export default function NestedList(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(0);
    // const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const buggy_pattern = props.buggy_pattern
    const detected_sentimental_pattern = props.detectedSentimentalPattern

    const handleListItemClick = (event, pattern, index) => {
        if (pattern === props.selectedIndex) {
            props.setSelectedIndex(-1);
            props.changeSelectPattern('all');
            return;
        }
        props.setSelectedIndex(pattern);
        props.changeSelectPattern(pattern + '_' + index);
    };

    const handleSentimentalItemClick = (event, pattern) => {
        if (pattern.split('_')[0] === props.selectedIndex) {
            props.setSelectedIndex(-1);
            props.changeSelectPattern('all');
            props.changeSearchText('');
            return;
        }
        props.setSelectedIndex(pattern.split('_')[0]);
        props.changeSearchText(pattern.split('_')[2])
        props.changeSelectPattern(pattern);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div>
            <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                <Tab icon={<TrendingDownIcon />} label="Influential Pattern" {...a11yProps(0)} />
                <Tab icon={<BugReportIcon />} label="Possible Buggy Pattern" {...a11yProps(1)} />
            </Tabs>
            <div
                role="tabpanel"
                hidden={value !== 0}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Paper style={{maxHeight: 600, overflow: 'auto'}}>
                    <List component="div" disablePadding>
                        {props.hasTraceToPlot ? detected_sentimental_pattern.map((pattern => {
                            return (
                                <ListItem button selected={props.selectedIndex === pattern.split('_')[0]} onClick={(event) => handleSentimentalItemClick(event, pattern)}>
                                    {/*<ListItemText primary={'Pattern ' + index.toString() + ': (' + buggy_pattern.key.join(', ') + ')'} />*/}
                                    <Chip
                                        variant="outlined"
                                        avatar={<Avatar>{pattern.split('_')[1]}</Avatar>}
                                        label={pattern.split('_')[0]}
                                        color="primary"
                                    />
                                    <ListItem>
                                        <Typography color="primary"> {removePound(pattern.split('_')[2])} </Typography>
                                    </ListItem>
                                </ListItem>
                            )
                        })): detected_sentimental_pattern.map((pattern, index) => {
                            return (
                                <ListItem button selected={props.selectedIndex === pattern.key.join(' ')} onClick={(event) => handleListItemClick(event, pattern.key.join(' '), index.toString())}>
                                    {/*<ListItemText primary={'Pattern ' + index.toString() + ': (' + buggy_pattern.key.join(', ') + ')'} />*/}
                                    <Chip
                                        variant="outlined"
                                        avatar={<Avatar>{index.toString()}</Avatar>}
                                        label={pattern.key.join(' ')}
                                        clickable
                                        color="primary"
                                    />
                                    {props.selectedIndex === pattern.key.join(' ') ? null : <List component="div" disablePadding>
                                        {<ListItem>
                                            <ListItemText primary={removePound(pattern.mined_results[0].text)} />
                                        </ListItem>}
                                    </List>}
                                    {props.selectedIndex === pattern.key.join(' ') ? <ExpandLess /> : <ExpandMore />}
                                    <Collapse in={props.selectedIndex === pattern.key.join(' ')} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {pattern.mined_results.slice(0, 10).map(texts => {
                                                return (
                                                    <ListItem>
                                                        <ListItemText primary={removePound(texts.text) + ' [' + texts.freq.toString() + ']'} />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Collapse>
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </div>
            <div
                role="tabpanel"
                hidden={value !== 1}
                id={`simple-tabpanel-1`}
                aria-labelledby={`simple-tab-1`}
            >
                <Paper style={{maxHeight: 600, overflow: 'auto'}}>
                    <List component="div" disablePadding>
                        {buggy_pattern.map((buggy_pattern, index) => {
                            return (
                                <ListItem button selected={props.selectedIndex === buggy_pattern.key.join(' ')} onClick={(event) => handleListItemClick(event, buggy_pattern.key.join(' '), index.toString())}>
                                    {/*<ListItemText primary={'Pattern ' + index.toString() + ': (' + buggy_pattern.key.join(', ') + ')'} />*/}
                                    <Chip
                                        variant="outlined"
                                        avatar={<Avatar>{index.toString()}</Avatar>}
                                        label={buggy_pattern.key.join(' ')}
                                        clickable
                                        color="secondary"
                                    />
                                    {props.selectedIndex === buggy_pattern.key.join(' ') ? null : <List component="div" disablePadding>
                                        {<ListItem>
                                            <ListItemText primary={removePound(buggy_pattern.mined_results[0].text)} />
                                        </ListItem>}
                                    </List>}
                                    {props.selectedIndex === buggy_pattern.key.join(' ') ? <ExpandLess /> : <ExpandMore />}
                                    <Collapse in={props.selectedIndex === buggy_pattern.key.join(' ')} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {buggy_pattern.mined_results.map(texts => {
                                                return (
                                                    <ListItem>
                                                        <ListItemText primary={removePound(texts.text) + ' [' + texts.freq.toString() + ']'} />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Collapse>
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </div>
        </div>

        // <List
        //     component="nav"
        //     aria-labelledby="nested-list-subheader"
        //     className={classes.root}
        // >
        //     <ListItem button onClick={handleClick}>
        //         <ListItemIcon>
        //             <BugReportIcon />
        //         </ListItemIcon>
        //         <ListItemText primary={<Typography>Possible Buggy Patterns</Typography>}/>
        //         {open ? <ExpandLess /> : <ExpandMore />}
        //     </ListItem>
        //     <Collapse in={open} timeout="auto" unmountOnExit>
        //         <Paper style={{maxHeight: 500, overflow: 'auto'}}>
        //             <List component="div" disablePadding>
        //                 {buggy_pattern.map((buggy_pattern, index) => {
        //                     return (
        //                         <ListItem button selected={props.selectedIndex === buggy_pattern.key.join(' ')} onClick={(event) => handleListItemClick(event, buggy_pattern.key.join(' '), index.toString())}>
        //                             {/*<ListItemText primary={'Pattern ' + index.toString() + ': (' + buggy_pattern.key.join(', ') + ')'} />*/}
        //                             <Chip
        //                                 variant="outlined"
        //                                 avatar={<Avatar>{index.toString()}</Avatar>}
        //                                 label={buggy_pattern.key.join(' ')}
        //                                 clickable
        //                                 color="secondary"
        //                             />
        //                             {props.selectedIndex === buggy_pattern.key.join(' ') ? null : <List component="div" disablePadding>
        //                                 {<ListItem>
        //                                     <ListItemText primary={buggy_pattern.mined_results[0].text} />
        //                                 </ListItem>}
        //                             </List>}
        //                             {props.selectedIndex === buggy_pattern.key.join(' ') ? <ExpandLess /> : <ExpandMore />}
        //                             <Collapse in={props.selectedIndex === buggy_pattern.key.join(' ')} timeout="auto" unmountOnExit>
        //                                 <List component="div" disablePadding>
        //                                     {buggy_pattern.mined_results.map(texts => {
        //                                         return (
        //                                             <ListItem>
        //                                                 <ListItemText primary={texts.text + ' [' + texts.freq.toString() + ']'} />
        //                                             </ListItem>
        //                                         )
        //                                     })}
        //                                 </List>
        //                             </Collapse>
        //                         </ListItem>
        //                     );
        //                 })}
        //             </List>
        //         </Paper>
        //     </Collapse>
        //     <ListItem button>
        //         <ListItemIcon>
        //             <SendIcon />
        //         </ListItemIcon>
        //         <ListItemText primary="abc Pattern" />
        //     </ListItem>
        //     <ListItem button>
        //         <ListItemIcon>
        //             <DraftsIcon />
        //         </ListItemIcon>
        //         <ListItemText primary="123 Pattern" />
        //     </ListItem>
        // </List>
    );
}
