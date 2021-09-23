import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import '../popUp.css';


function StreamMesPopUp(props) {
    let streamStyle = {
        fontSize: "10px",
        margin: "10px",
        textAlign: "start",
    }
    // function (){
    //     changeMessageShow(props.message)
    //     if(messageShow.includes('<')){
    //         changeMessageShow(messageShow.split('<')[0]);
    //     }
    // }

    return <div className="popUp-background" style={{display: props.show? "block" : "none"}}>
        <div className="popUp">
            <p>{props.singleMsg}</p>
            {/* {props.message.map((val, index) => {
                return <p key={index} style={streamStyle}>{val}</p>;
            })} */}
        </div>
    </div>
}

export default StreamMesPopUp;