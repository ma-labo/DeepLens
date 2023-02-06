import React from 'react';
import './index.css';
import { red, blue } from '@mui/material/colors';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
export default class IconArray extends React.Component {

    render() {
        var rownum = parseInt(this.props.percent / 10);
        var colnum = this.props.percent % 10;

        var bluerow = [];
        var redrow = [];
        var dopedrow = [];

        for (var i = 0; i < 10; i++) {
            redrow.push(<FiberManualRecordIcon sx={{ fontSize: '0.5rem', color: red[200] }} />);
        }

        for (var i = 0; i < 10; i++) {
            bluerow.push(<FiberManualRecordIcon sx={{ fontSize: '0.5rem', color: blue[200] }} />);
        }

        for (var i = 0; i < colnum; i++) {
            dopedrow.push(<FiberManualRecordIcon sx={{ fontSize: '0.5rem', color: blue[200] }} />);
        }
        for (var i = colnum; i < 10; i++) {
            dopedrow.push(<FiberManualRecordIcon sx={{ fontSize: '0.5rem', color: red[200] }} />);
        }


        var mat = [];
        for (var i = 0; i < rownum; i++) {
            mat.push(
                <div>{bluerow}</div>
            );
        }

        if (rownum < 10) {
            mat.push(
                <div>{dopedrow}</div>
            );
        }

        for (var i = rownum + 1; i < 10; i++) {
            mat.push(
                <div>{redrow}</div>
            )
        }

        return (
            <div>{mat}</div>
        );
    }
}
