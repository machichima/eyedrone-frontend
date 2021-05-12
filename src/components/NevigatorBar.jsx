import React from "react";
import { Link } from "react-router-dom";

function NevigatorBar(props) {
    return <div>
        <header>
            <h1>Eyedrone</h1>
            <button className="show-data">
                <Link to = {props.linkTo}>
                    {props.linkTo === "/newModule" ? "填寫數據" : "呈現數據"}
                </Link>
            </button>
        </header>

    </div>
}

export default NevigatorBar;