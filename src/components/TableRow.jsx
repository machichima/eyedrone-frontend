import React, { useState } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

function TableRow(props) {
    const [isFirstRender, chIsFirstRender] = useState(true);
    const [infos, chInfos] = useState([0, 0, 0, 0]);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    function handleInfoOfPoints(e) {
        let infosDic = ['do', 'bod', 'ss', 'nh3n'];
        let infosTemp = infos;
        console.log("infos index: ", infosDic.indexOf(e.target.name));
        infosTemp[infosDic.indexOf(e.target.name)] = e.target.value;
        chInfos(infosTemp);
        console.log(infos);
        props.onChange({ id: props.id, value: e.target.value, name: e.target.name, x: props.spot.x, y: props.spot.y, group: props.spot.group });
    }

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
        <td><input id="do" name='do' type='number' className='input-data' onChange={handleInfoOfPoints} defaultValue={props.value.do} /></td>
        <td><input name='bod' type='number' className='input-data' onChange={handleInfoOfPoints} defaultValue={props.value.bod} /></td>
        <td><input name='ss' type='number' className='input-data' onChange={handleInfoOfPoints} defaultValue={props.value.ss} /></td>
        <td><input name='nh3n' type='number' className='input-data' onChange={handleInfoOfPoints} defaultValue={props.value.nh3n} /></td>
    </tr>
}

export default TableRow;