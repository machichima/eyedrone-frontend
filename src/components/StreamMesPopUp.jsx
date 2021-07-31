import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import '../popUp.css';


function StreamMesPopUp(props) {
    const completedPerDict = {
        "移除舊模型": 20,
        "影像校正": 40,
        "preparing": 60,
        "校正": 80
    };
    
    // function (){
    //     changeMessageShow(props.message)
    //     if(messageShow.includes('<')){
    //         changeMessageShow(messageShow.split('<')[0]);
    //     }
    // }

    return <div className="popUp-background" style={{display: props.show? "block" : "none"}}>
        <div className="popUp">
            <ProgressBar completed={completedPerDict[props.message.split(' ')]}/>
            <p style={{}}>{props.message}</p>
        </div>
    </div>
}

export default StreamMesPopUp;