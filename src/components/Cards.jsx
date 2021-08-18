import React, { useState } from "react";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import useFitText from "use-fit-text";

function Cards(props) {
    const [show, setShow] = useState(false);
    const { fontSize, ref } = useFitText();

    return <div className="card-for-all-module-and-predict" onClick={()=>props.onClick(props.id)}>
        {props.dateTime === undefined ? <h2 ref={ref} className='model-name' style={{ fontSize, height: 20, width: 100 }}>{props.name}</h2>
            : <h2 ref={ref} className='model-name' style={{ fontSize, height: 40, width: 100 }}>
                    {props.dateTime.split('T')[0]}<br/>{props.dateTime.split('T')[1].slice(0, -1)}
                </h2>}
    </div>
}

export default Cards;