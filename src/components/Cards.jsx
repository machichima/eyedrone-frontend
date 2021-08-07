import React, { useState } from "react";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

function Cards(props) {
    const [show, setShow] = useState(false);

    function handleShow() {
        setShow(!show);
    }

    return <div className="card-for-all-module-and-predict" onClick={()=>props.onClick(props.id)}>
        <h2 className='model-name' style={{}}>{props.name}</h2>
    </div>
}

export default Cards;