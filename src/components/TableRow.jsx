import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

function TableRow(props) {

    function handleInfoOfPoints(e) {
        console.log(e.target.value);
        console.log(e.target.name);
        props.onChange({id: props.id,value: e.target.value, name: e.target.name, x: props.spot.x, y: props.spot.y, group: props.spot.group});
    }

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
        <td><input name='do' type='number' className='input-data' onChange={handleInfoOfPoints}  /></td>
        <td><input name='bod' type='number' className='input-data' onChange={handleInfoOfPoints}  /></td>
        <td><input name='ss' type='number' className='input-data' onChange={handleInfoOfPoints}  /></td>
        <td><input name='nh3n' type='number' className='input-data' onChange={handleInfoOfPoints}  /></td>
    </tr>
}

export default TableRow;