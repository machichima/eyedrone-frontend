import React, { useEffect, useState, useRef } from "react";
import '../popUp.css';
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { RestaurantRounded } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';


function useOutsideAlerter(ref, props) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.onClick(null);
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

    var toolTipStyle = {
        'display': 'none',
        'background': '#C8C8C8',
        'marginTop': '20px',
        'padding': '10px',
        'position': 'absolute',
        'zIndex': '2000',
    }

    const [productJSON, chProductJSON] = useState(null);

    function showValueOfPredictResImg(e) {
        if (productJSON !== null && productJSON !== undefined) {
            let currentW = document.querySelector('.predict-val-img').offsetWidth;    //canvas外的container的width
            let currentH = document.querySelector('.predict-val-img').offsetHeight;   //canvas外的container的height
            let img = document.querySelector('#imgShow');

            console.log("key: ", e.target.id);

            try {
                Object.entries(productJSON).map(([key, value]) => {
                    let tooltip = document.querySelector('#valtooltip' + e.target.id);
                    if (key === e.target.id) {
                        let JSONw = value.length;
                        let JSONh = value[0].length
                        let JSONIndexW = Math.round(e.nativeEvent.offsetX / currentW * JSONw)
                        if (JSONIndexW < 0) JSONIndexW = 0
                        else if (JSONIndexW > JSONw) JSONIndexW = JSONw

                        let JSONIndexH = Math.round(e.nativeEvent.offsetY / currentH * JSONh)
                        if (JSONIndexH < 0) JSONIndexH = 0
                        else if (JSONIndexH > JSONh) JSONIndexH = JSONh

                        console.log("value: ", value[JSONIndexW][JSONIndexH])
                        //console.log(checkOutBound(img, tooltip))
                        tooltip.innerHTML = value[JSONIndexW][JSONIndexH].toFixed(2)
                        tooltip.style.display = 'block'
                        console.log("X offset: ", e.nativeEvent.offsetX);
                        tooltip.style.left = e.nativeEvent.offsetX-(tooltip.clientWidth/2) + 'px';
                        tooltip.style.top = e.nativeEvent.offsetY + 'px';
                    }
                })
            } catch {
                return;
            }

            //console.log("JSON: ", obj.bod[0][0])
        }
    }

    function checkOutBound(parentDiv, childDiv) {
        var parentRect = parentDiv.getBoundingClientRect();
        var childRect = childDiv.getBoundingClientRect();

        return parentRect.left >= childRect.right || parentRect.right <= childRect.left;
    }

    function hideToolTip(e) {
        let tooltip = document.querySelector('#valtooltip' + e.target.id);
        tooltip.style.display = 'none'
    }

    function downloadAllImage() {
        var zip = JSZip();
        let folder = zip.folder("predict");
        let picCount = 0;
        props.results.map((val, index) => {
            {
                Object.entries(val).map(([key, value]) => {
                    if (key !== "image" && value !== null) {
                        picCount++;
                        const imageBlob = fetch(value).then(response => response.blob());
                        let fileName = value.split('/')[value.split('/').length - 1];
                        folder.file(fileName, imageBlob);
                    }
                })
            }
        });
        if (picCount == 0) {
            return;
        }
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "predict.zip");
        });
    }

    return <div className="popUp-background">
        <div className="popUp" style={{ textAlign: "start", overflowY: "scroll" }} ref={wrapperRef}>
            <EditIcon style={{ float: "right", margin: "20px" }} onClick={() => { window.location.href = "/newPredict?id=" + props.id }} />
            <div style={{ margin: "20px" }}>
                <h2 style={{ fontWeight: "700" }}>{props.created_at.split('T')[0]} {props.created_at.split('T')[1].slice(0, -1)}</h2>
                {props.results.map((val, index) => {
                    return <div key={index}>
                        <h4 style={{ marginLeft: "0px" }}>{val.image}</h4>
                        {Object.entries(val).map(([key, value]) => {
                            if (key === "product" && productJSON === null) {
                                var Httpreq = new XMLHttpRequest(); // a new request
                                Httpreq.open("GET", value, false);
                                Httpreq.send(null);
                                console.log("response: ", Httpreq.response)
                                chProductJSON(JSON.parse(Httpreq.response));
                            }
                            return key !== "image" && key !== "product" && value !== null ?
                            <div>
                                <h4 style={{ marginLeft: "0px" }}>{key}</h4>
                                <div key={value} style={{ "marginBottom": "10px", position: "relative" }}>
                                    <img
                                        id={key}
                                        className="predict-val-img"
                                        style={{
                                            objectFit: "contain", width: "100%", height: "100%",
                                        }}
                                        src={value} onMouseMove={showValueOfPredictResImg}
                                        onMouseLeave={hideToolTip}>
                                    </img>
                                    <span className="valtooltip" id={"valtooltip" + key} style={toolTipStyle}></span>
                                </div>
                            </div> : null
                        })}
                    </div>
                })}
                <div className='center-button'>
                    <button className='upload-button' onClick={downloadAllImage}>
                        下載所有圖片
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default PredictInfoPopUp;