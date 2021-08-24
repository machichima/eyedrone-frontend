import React, {useState} from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

function TableRow(props) {

    function handleInfoOfPoints(e) {
        console.log(e.target.value);
        console.log(e.target.name);
        console.log(props.value);
        props.onChange({id: props.id,value: e.target.value, name: e.target.name, x: props.spot.x, y: props.spot.y, group: props.spot.group});
    }

    try {
        var info_do = props.value.do;
        var info_bod = props.value.bod;
        var info_ss = props.value.ss;
        var info_nh3n = props.value.nh3n;
    } catch {
        var info_do = 0;
        var info_bod = 0;
        var info_ss = 0;
        var info_nh3n = 0;
    }
    
    // let info_bod = props.value.bod;
    // let info_ss = props.value.ss;
    // let info_nh3n = props.value.nh3n;

    console.log(props.spot.group);
    return <tr>
        <OverlayTrigger
            key={props.id}
            placement={'left'}
            overlay={
                <Tooltip>
                    ({props.spot.x}, {props.spot.y})
                </Tooltip>
            }
        >
            <td>{props.spot.group + 1}</td>
        </OverlayTrigger>
        <td><input name='do' type='number' className='input-data' value={info_do} onChange={handleInfoOfPoints}  /></td>
        <td><input name='bod' type='number' className='input-data' value={info_bod} onChange={handleInfoOfPoints}  /></td>
        <td><input name='ss' type='number' className='input-data' value={info_ss} onChange={handleInfoOfPoints}  /></td>
        <td><input name='nh3n' type='number' className='input-data' value={info_nh3n} onChange={handleInfoOfPoints}  /></td>
    </tr>
}

export default TableRow;