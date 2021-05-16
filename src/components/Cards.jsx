import React, { useState } from "react";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

function Cards(props) {
    const [show, setShow] = useState(false);

    function handleShow() {
        setShow(!show);
    }

    return <div className="card-for-all-module-and-predict">
        <h1 className='model-name' style={{}}>{props.name}
            <KeyboardArrowDownIcon style={{ position: 'absolute', width:'30px', height: '30px',display: 'inline', right: '5%', transform: show ? 'rotate(180deg)' : 'none' }}
                onClick={handleShow}/>
        </h1>

        <table style={{ textAlign: 'center', margin: '0px auto', display: show ? 'block' : 'none' }}>
            <tbody style={{}}>
                {props.substances.map((val, index) =>
                    <tr>
                        <th style={{ verticalAlign: "top", fontSize: '20px' }}>{val.name}:</th>
                        <td><div style={{ textAlign: 'start' }}>
                            <p>features: {props.substances[index].features}</p>
                            <p>r2: {props.substances[index].r2}</p>
                        </div></td>
                        {/* <td>features: {val.features}</td>
                        <td>r2: {val.r2}</td> */}
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}

export default Cards;