import React from "react";
import { Link } from "react-router-dom";

function NavigatorBar(props) {
    return <div>
        <header>
            <h1>Eyedrone</h1>
            {props.linkTo !== "null" ?
                    <button className="show-data" onClick={()=>{window.location.href = "/";}}>
                        主畫面
                    </button>:
                null}
        </header>
    </div>
}

export default NavigatorBar;