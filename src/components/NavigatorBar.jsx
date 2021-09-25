import React from "react";
import { Link } from "react-router-dom";

function NavigatorBar(props) {
    return <div style={{width: "100%"}}>
        <header style={{width: "100%"}}>
            <h1 style={{cursor: "pointer"}} onClick={()=>{window.location.href = "/";}}>Eyedrone</h1>
            {props.linkTo !== "null" ?
                    <button className="show-data" onClick={()=>{window.location.href = "/";}}>
                        主畫面
                    </button>:
                null}
        </header>
    </div>
}

export default NavigatorBar;