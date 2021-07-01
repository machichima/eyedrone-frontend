import React from "react";
import { Link } from "react-router-dom";

function NavigatorBar(props) {
    return <div>
        <header>
            <h1>Eyedrone</h1>
            {props.linkTo !== "null" ?
                <Link to={props.linkTo}>
                    <button className="show-data">
                        主畫面
                    </button>
                </Link> :
                null}
        </header>
    </div>
}

export default NavigatorBar;