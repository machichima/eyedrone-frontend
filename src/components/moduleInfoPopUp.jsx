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

function ModuleInfoPopUp(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props);

    return <div className="popUp-background">
        <div className="popUp" style={{ textAlign: "start", overflowY: "scroll"}} ref={wrapperRef}>
            <div style={{ margin: "20px" }}>
                <h2 style={{ fontWeight: "700" }}>{props.modelName}</h2>
                {props.substances.map((val, index) => {
                    return <div>
                        <h4 style={{ marginLeft: "0px" }}>{props.substances[index].name}</h4>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td>formula</td>
                                    <td>{props.substances[index].formula}</td>
                                </tr>
                                <tr>
                                    <td rowSpan={props.substances[index].features.length}>features</td>
                                    <td key={0}>{props.substances[index].features[index]}</td>
                                </tr>
                                {props.substances[index].features.map((val, index) => index > 0 ? <tr><td key={index}>{val}</td></tr> : null)}

                                <tr>
                                    <td rowSpan={props.substances[index].coefficients.length}>coefficients</td>
                                    <td key={0}>{props.substances[index].coefficients[0]}</td>
                                </tr>
                                {props.substances[index].coefficients.map((val, index) => index > 0 ? <tr><td key={index}>{val}</td></tr> : null)}

                                <tr>
                                    <td>intercept</td>
                                    <td>{props.substances[index].intercept}</td>
                                </tr>
                                <tr>
                                    <td>r2</td>
                                    <td>{props.substances[index].r2}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                })}

            </div>
        </div>
    </div>
}

export default ModuleInfoPopUp;