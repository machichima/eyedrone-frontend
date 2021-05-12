import React, { useRef, useState } from "react";
import NevigatorBar from "../components/NevigatorBar";
import Spot from "../components/Spot";
import PrevPic from "../components/prev-pic";
import TableRow from '../components/TableRow';
import axios from "../components/axios";
// import axios from "axios"
import FormData from 'form-data';
import ConvertTiff from 'tiff-to-png';
import Tiff from 'tiff.js'
import Table from 'react-bootstrap/Table'
var fs = require('fs');

function NewModule() {
    //var fileName = [];
    const [modelName, changeModelName] = useState('');
    const [modelId, changeModelId] = useState(0);
    const [imageId, changeImageId] = useState([]);
    var [fileName, changeFileName] = useState([]);
    var [axis, changeAxis] = useState([{ x: null, y: null, xShow: null, yShow: null, group: null }]);
    //每組圖片的座標點
    const [group, changeGroup] = useState(0);    //顯示的圖片組數
    const [totalGroup, changeTotalGroup] = useState(0);    //總共的圖片組數
    const [showCanvas, changeShowCanvas] = useState(true);    //是否顯示圖片讓使用者標點
    var canvasRef = useRef(null);
    var [canvasDim, changeCanvasDim] = useState({ height: 0, width: 0 });
    const [infoOfPoints, changeInfoOfPoints] = useState([]);
    //from here   指到隱藏的input element，並在button按下時驅動input file
    // const hiddenFileInput = React.useRef(null);
    // const handleClick = event => {
    //     hiddenFileInput.current.click();
    // };
    //to here

    function handleModelName(e) {
        changeModelName(e.target.value);
    }

    const postModel = async () => {    //post model name
        //Step 1:取得state數據
        const product = modelName;
        //Step 2:新增到JSON-Server數據庫中 
        try {
            const res = await axios.post("/api/models/", { name: modelName });
            console.log(res.data);
            changeModelId(res.data.id);
        } catch (e) {
            console.log(e)
        }
    }

    const postImg = async (groupNum) => {    //post multiple image to backend
        //Step 1:取得state數據
        console.log('+++++++++++++++++++++');
        console.log(modelId);
        //Step 2:新增到JSON-Server數據庫中 
        let param = new FormData();  // 创建form对象
        param.append('model', modelId);  // 通过append向form对象添加数据
        param.append('is_panel', (groupNum == 0) ? true : false);
        param.append('blue', fileName[groupNum][0]);
        param.append('green', fileName[groupNum][1]);
        param.append('red', fileName[groupNum][2]);
        param.append('red_edge', fileName[groupNum][3]);
        param.append('red_nir', fileName[groupNum][4]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        try {
            const res = await axios.post("/api/images/", param, config);
            console.log(res.data);
            changeImageId([...imageId, res.data.id]);
        } catch (e) {
            console.log(e)
        }

    }

    function pointSpot(e) {     //當點擊圖片時取得滑鼠的點(滑鼠在圖片上的座標點，在圖片坐標系)
        let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
        let currentH = document.querySelector('.image-container').offsetHeight;   //canvas外的container的height
        let [x, y] = [Math.round(e.nativeEvent.offsetX / currentW * canvasDim.width), Math.round(e.nativeEvent.offsetY / currentH * canvasDim.height)];
        let [xShow, yShow] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        changeAxis([...axis, { x, y, xShow, yShow, group }].sort((a, b) => a.group - b.group));
        console.log(x, y);
        console.log(xShow, yShow);
    }

    function switchGroup() {     //選取完點按下確認後觸發
        if (axis[axis.length - 1].group + 1 === group) {
            //當使用者未新增座標點就按下確認，此時axis[axis.length - 1].group的數值會和group一樣
            //若為第一組圖片，則未選擇座標點時axis[axis.length - 1].group初始值為null
            alert("請點選座標點");
            return;
        }
        if (axis[axis.length - 1].group === null && totalGroup === 0) {   //新增第一組圖片，直接將group和totalGroup令為1
            //若為編輯第一組圖片，則totalGroup不為0，所以不會進入
            postImg(0);
            changeShowCanvas(false);
            changeGroup(1);
            changeTotalGroup(1);
            return;
        }
        if (axis[axis.length - 1].group >= totalGroup) {   //代表新增一組圖片，而不是去編輯原本建立的圖片組
            postImg(axis[axis.length - 1].group);
        }
        changeShowCanvas(false);
        changeGroup(axis[axis.length - 1].group + 1);
        changeTotalGroup(axis[axis.length - 1].group + 1);
        console.log(group);
        console.log(axis);
        console.log(fileName);
    }

    function showPrevPic(groupNum) {     //按下先前編輯的圖片組
        changeGroup(groupNum - 1);
        console.log(groupNum);
        let file = fileName[groupNum - 1][0];
        console.log(URL.createObjectURL(file));
        console.log(file);
        var reader = new FileReader();

        reader.onload = function (e) {
            var buffer = e.target.result;
            console.log('--------------------------------------');
            console.log(buffer);
            var tiff = new Tiff({ buffer: buffer });
            var canvas = tiff.toCanvas();
            if (canvas) {
                //document.querySelector('#output').append(canvas);
                const [width, height] = [canvas.width, canvas.height]
                changeCanvasDim({ width, height });
                var canvasTemp = canvasRef.current;
                const context = canvasTemp.getContext('2d');
                context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            }
            // The file's text will be printed here
        };
        reader.readAsArrayBuffer(file);
        changeShowCanvas(true);
    }

    function handlePointsInfo(info) {
        console.log(info);
        if (infoOfPoints.length + 1 === info.group || info.id > infoOfPoints[infoOfPoints.length - 1].id) {
            console.log('true');
            changeInfoOfPoints([...infoOfPoints, { id: info.id, group: info.group, x: info.x, y: info.y, [info.name]: parseInt(info.value) }]);
            return;
        }
        let infoPrompt = infoOfPoints;
        for (let i = 0; i < infoPrompt.length; i++) {
            if (infoPrompt[i].id === info.id) {
                infoPrompt[i] = { ...infoOfPoints[i], [info.name]: parseInt(info.value) };
            }
        }
        changeInfoOfPoints(infoPrompt);
        //[...infoPrompt, {...infoOfPoints[infoOfPoints.length - 1], [info.name]: info.value}]
        console.log({ ...infoOfPoints[infoOfPoints.length - 1], [info.name]: info.value });
        console.log(infoOfPoints);
    }

    function putInfo() {
        //imageId.length
        console.log(totalGroup);
        let infoList = [];
        for (let i = 0; i < axis.length - 1; i++) {    //因為axis中有一項是null，所以 axis.length-1 才是真正點的數量
            let infoPrompt = new Map();
            infoPrompt = infoOfPoints[i];
            infoPrompt['image'] = imageId[infoPrompt.group];   //因為第一組圖片為不須標點，所以直接從inageId開始
            delete infoPrompt.id;
            delete infoPrompt.group;
            console.log(infoPrompt);
            infoList.push(infoPrompt);
            //axios.put(`/api/images/${imageId}/`, {points: infoPrompt});
        }
        console.log(infoList);
        console.log({ name: modelName, points: infoList });
        axios.put(`/api/models/${modelId}/`, { name: modelName, points: infoList }).catch((e) => console.log(e));
    }

    return <div>
        <NevigatorBar id={1} linkTo="/" />
        <h1 className="fill-in-data-title">填寫數據</h1>
        {/* 輸入model名稱 */}
        <form className="model-name-form" >
            <label>名稱: </label>
            <input type="text" name="name" id="model-name" value={modelName} onChange={handleModelName}></input>
            <button type="button" className='button' style={{ float: "none", margin: "0px 20px" }} onClick={postModel}>送出</button>
        </form>

        {Array.from({ length: totalGroup }, (_, i) => i + 1).map((index, val) => totalGroup > 0 ?
            <PrevPic key={index} group={index} onClick={showPrevPic} /> :
            null)}
        {/* ^顯示先前所選擇的圖片組，使用totalGroup，不論顯示的為哪一組，皆會顯示出所有先前選的圖片組 */}
        <form id="upload-img-container">   {/* */}
            {/* <button id="upload-img" onClick={handleClick}>上傳圖片</button> */}
            {/* <p>{fileName.toString()}</p> */}
            <input id="upload-img" type="file" onChange={(event) => {
                if (event.target.files.length != 5) {
                    alert('請上傳五張圖片');
                    return;
                }
                let fileNameTemp = [];   //先將fileName內的都清空
                for (let i = 0; i < event.target.files.length; i++) {     //將所接收到的所有名稱
                    let file = event.target.files[i];
                    console.log(window.URL.createObjectURL(file));
                    console.log(file.name);
                    // fileNameTemp.push(URL.createObjectURL(event.target.files[i]))
                    fileNameTemp.push(event.target.files[i]);
                    if (i === 0) {
                        var input = file[0];
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            var buffer = e.target.result;
                            console.log('--------------------------------------');
                            console.log(buffer);
                            var tiff = new Tiff({ buffer: buffer });
                            var canvas = tiff.toCanvas();
                            if (canvas) {
                                //document.querySelector('#output').append(canvas);
                                const [width, height] = [canvas.width, canvas.height]
                                changeCanvasDim({ width, height });
                                var canvasTemp = canvasRef.current;
                                const context = canvasTemp.getContext('2d');
                                context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
                            }
                            // The file's text will be printed here
                        };
                        reader.readAsArrayBuffer(file);
                        changeShowCanvas(true);
                    }
                }
                changeFileName([...fileName, fileNameTemp].sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                }));    //改變fileName的數值
                console.log(fileName[0]);

            }} multiple />
            {/* ref用來讓button操作input時有依據 */}
        </form>

        <div className="image-container" >
            <canvas className='tif-canvas' ref={canvasRef} width={canvasDim.width} height={canvasDim.height}
                onClick={group != 0 ? pointSpot : null} style={{ display: showCanvas ? "block" : "none" }} />
            {axis.map((val, index) => index > 0 && val.group === group ? (<Spot key={index} axisX={val.xShow} axisY={val.yShow} show={showCanvas} />) : null)}
            {/* 因為圓點的半徑為5px，所以x, y需要補正5px */}
            <button className='button' style={{ display: showCanvas && canvasDim.height != 0 ? "block" : "none" }} onClick={switchGroup}>確認</button>
        </div>
        <div className="handle-table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>group</th>
                        <th>do</th>
                        <th>bod</th>
                        <th>ss</th>
                        <th>nh3n</th>
                    </tr>
                </thead>
                <tbody>
                    {axis.map((val, index) => val.group != null ?
                        <TableRow key={index} id={index} spot={{ x: val.x, y: val.y, group: val.group }} onChange={handlePointsInfo} /> :
                        null)}
                </tbody>
            </Table>
            <button className='button' onClick={putInfo}>上傳</button>
        </div>

    </div>
}

export default NewModule;