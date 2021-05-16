import React from "react";
import { Link } from "react-router-dom";

function NavigatorBar(props) {
    return <div>
        <header>
            <h1>Eyedrone</h1>
            {props.linkTo !== "null" ?
                <button className="show-data">
                    <Link to={props.linkTo}>
                        主畫面
                </Link>
                </button> :
                null}
        </header>
    </div>
}

export default NavigatorBar;