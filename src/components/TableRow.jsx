import React, { useState } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'

function TableRow(props) {
    const [isFirstRender, chIsFirstRender] = useState(true);

    try {
        if(isFirstRender)   //避免多次 re-render
        {
            document.getElementsByName('do')[props.id].value = props.value.do;
            document.getElementsByName('bod')[props.id].value = props.value.bod;
            document.getElementsByName('ss')[props.id].value = props.value.ss;
            document.getElementsByName('nh3n')[props.id].value = props.value.nh3n;
            chIsFirstRender(false);
        }
    } catch {
        
    }

    const [infos, chInfos] = useState([null, null, null, null]);


    function handleInfoOfPoints(e) {
        let infosDic = ['do', 'bod', 'ss', 'nh3n'];
        let infosTemp = infos;
        console.log("infos index: ", infosDic.indexOf(e.target.name));
        infosTemp[infosDic.indexOf(e.target.name)] = e.target.value;
        chInfos(infosTemp);
        console.log(infos);
        props.onChange({id: props.id,value: e.target.value, name: e.target.name, x: props.spot.x, y: props.spot.y, group: props.spot.group});
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
        <td><input id="do" name='do' type='number' className='input-data' onChange={handleInfoOfPoints} /></td>
        <td><input name='bod' type='number' className='input-data' onChange={handleInfoOfPoints} /></td>
        <td><input name='ss' type='number' className='input-data' onChange={handleInfoOfPoints} /></td>
        <td><input name='nh3n' type='number' className='input-data' onChange={handleInfoOfPoints} /></td>
    </tr>
}

export default TableRow;