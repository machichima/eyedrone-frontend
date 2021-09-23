import React, { useState } from "react";


function ProgressBar(props) {
    const progressBer_container = {
        width: '100%',
        height: '10px',
        padding: '0px'
    }

    const progressBer_filler = {
        width: `${props.completed}%`,
        height: '100%',
        backgroundColor: '#52616B',
        transition: 'width 1s ease-in-out',
    }

    return (
        <div style={progressBer_container}>
            <div style={progressBer_filler}>
            </div>
        </div>
    );
}

export default ProgressBar;