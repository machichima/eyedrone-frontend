import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "./ProgressBar";
import Table from 'react-bootstrap/Table'
import '../popUp.css';


function useOutsideAlerter(ref, props) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.onClick(0);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

function PredictInfoPopUp(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props);

    return <div className="popUp-background">
        <div className="popUp" style={{ textAlign: "start", overflowY: "scroll"}} ref={wrapperRef}>
            <div style={{ margin: "20px" }}>
                <h2 style={{ fontWeight: "700" }}>{props.created_at.split('T')[0]} {props.created_at.split('T')[1].slice(0, -1)}</h2>

                    <div>
                        {/* <h4 style={{ marginLeft: "0px" }}>{props.created_at}</h4> */}
                    </div>


            </div>
        </div>
    </div>
}

export default PredictInfoPopUp;