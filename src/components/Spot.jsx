import React from "react";

function Spot(props) {
    let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
    let currentH = document.querySelector('.image-container').offsetHeight;   //canvas外的container的height
    console.log(props.axisX);
    console.log(props.axisY);
    return <div className="spot" style={{ top: props.axisY*currentH - 5, left: props.axisX*currentW - 5, display: props.show ? "inline" : "none" }} />
}

export default Spot;