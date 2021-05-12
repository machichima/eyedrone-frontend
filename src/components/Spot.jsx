import React from "react";

function Spot(props) {
    console.log(props.axisX);
    console.log(props.axisY);
    return <div className="spot" style={{ top: props.axisY - 5, left: props.axisX - 5, display: props.show ? "inline" : "none" }}  />
}

export default Spot;