import React from "react";

function Spot(props) {
    let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
    let currentH = document.querySelector('#imgShow').height;   //canvas外的container的height
    return <div className="spot" 
                style={{ top: props.axisY - 5, left: props.axisX - 5, 
                        display: props.show ? "inline" : "none" }} 
                onMouseUp={(e)=>props.onRightClick(e, props)}
            />
}

export default Spot;