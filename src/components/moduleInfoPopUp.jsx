import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import '../popUp.css';


function ModuleInfoPopUp(props) {

    return <div className="popUp-background">
        <div className="popUp">
            <p style={{}}>{props.substances[0].features}</p>
        </div>
    </div>
}

export default ModuleInfoPopUp;