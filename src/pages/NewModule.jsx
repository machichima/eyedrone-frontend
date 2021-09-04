import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import NavigatorBar from "../components/NavigatorBar";
import Spot from "../components/Spot";
import PrevPic from "../components/prev-pic";
import TableRow from '../components/TableRow';
import axios from "../components/axios";
// import axios from "axios"
import FormData from 'form-data';
import Tiff from 'tiff.js';
import Table from 'react-bootstrap/Table'
import StreamMesPopUp from '../components/StreamMesPopUp';

function NewModule(props) {
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
    const [streamTxt, changeStreamTxt] = useState([]);
    const [isShowStream, changeIsShowStream] = useState(false);
    const [showUploadBtn, setShowUploadBtn] = useState(false);

    const [modelDataForEdit, chModelDataForEdit] = useState(null);

    const history = useHistory();
    const pathname = window.location.pathname;
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    //from here   指到隱藏的input element，並在button按下時驅動input file
    // const hiddenFileInput = React.useRef(null);
    // const handleClick = event => {
    //     hiddenFileInput.current.click();
    // };
    //to here


    React.useEffect(() => {

        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);

        console.log(id);
        if (id != null) {
            window.addEventListener('load', async () => {
                const res = await axios.get('/api/models/' + id);
                const resImg = await axios.get('/api/images/');
                console.log(res.data);
                console.log(resImg.data);
                chModelDataForEdit(res.data);
                changeModelName(res.data.name);

                // 可能之後會改
                let allImgId = [];
                allImgId.push(res.data.panel.id);
                res.data.points.map((val, index) => {
                    if (!allImgId.includes(val.image)) {
                        allImgId.push(val.image);
                    }
                });
                changeImageId(allImgId);
                changeTotalGroup(allImgId.length);
                allImgId.map((val, index) => {
                    let fileNameTemp = [];
                    Object.entries(resImg.data[val - 1]).map(([key, value]) => {
                        if (key !== "id" && value !== null) {
                            fileNameTemp.push(value)
                        }
                    })
                    changeFileName(...fileName, fileNameTemp);
                })
                /////

                let axisTemp = [];
                let infoOfPointsTemp = [];

                res.data.points.map((val, index) => {
                    let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
                    let currentH = document.querySelector('.image-container').offsetHeight;   //canvas外的container的height
                    let [x, y] = [val.x, val.y];
                    let [xShow, yShow] = [Math.round(val.x / canvasDim.width * currentW), Math.round(val.y / canvasDim.height * currentH)];
                    let group = allImgId.indexOf(val.image);
                    axisTemp = [...axisTemp, { x, y, xShow, yShow, group }].sort((a, b) => a.group - b.group);
                    // changeAxis([...axis, { x, y, xShow, yShow, group }].sort((a, b) => a.group - b.group));

                    let infoPrompt = { id: index, group: group, x: x, y: y };
                    Object.entries(val).map(([key, value]) => {
                        if (key !== "image" && key !== "x" && key !== "y" && value !== null) {
                            infoPrompt = { ...infoPrompt, [key]: parseInt(value) }
                        }
                    })
                    infoOfPointsTemp = [...infoOfPointsTemp, infoPrompt];
                    // changeInfoOfPoints([...infoOfPoints, infoPrompt]);
                });
                changeAxis(axisTemp);
                changeInfoOfPoints(infoOfPointsTemp);
            });
        }

        function handleResize() {
            console.log(props.location.pathname);
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            let axisPrompt = axis;
            let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
            let currentH = document.querySelector('.image-container').offsetHeight;   //canvas外的container的height
            for (let i = 0; i < axis.lengthl; i++) {
                let [xShow, yShow] = [Math.round(axis[i].x / canvasDim.width * currentW), Math.round(axis[i].y / canvasDim.height * currentH)]
                axisPrompt[i].xShow = xShow;
                axisPrompt[i].yShow = yShow;
            }
            changeAxis(axisPrompt);

        }

        if (props.location.pathname === '/newModule') {
            window.addEventListener('resize', handleResize);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    })



    function handleModelName(e) {
        changeModelName(e.target.value);
    }

    const postImg = async (groupNum) => {    //post multiple image to backend
        //Step 1:取得state數據
        //Step 2:新增到JSON-Server數據庫中 
        console.log('----------------------------------');
        console.log(fileName[fileName.length - 1]);
        let param = new FormData();  // 创建form对象
        //param.append('model', modelId);  // 通过append向form对象添加数据
        //param.append('is_panel', (groupNum === 0) ? true : false);
        param.append('blue', fileName[fileName.length - 1][0]);
        param.append('green', fileName[fileName.length - 1][1]);
        param.append('red', fileName[fileName.length - 1][2]);
        param.append('nir', fileName[fileName.length - 1][3]);
        param.append('red_edge', fileName[fileName.length - 1][4]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        try {
            const res = await axios.post("/api/images/", param, config);
            console.log("sent image");
            console.log(res.data);
            changeImageId([...imageId, res.data.id]);
        } catch (e) {
            console.log(e)
        }

    }

    function pointSpot(e) {     //當點擊圖片時取得滑鼠的點(滑鼠在圖片上的座標點，在圖片坐標系)
        if (e.button === 2) {
            return;
        }

        let currentW = document.querySelector('.image-container').offsetWidth;    //canvas外的container的width
        let currentH = document.querySelector('.image-container').offsetHeight;   //canvas外的container的height
        let [x, y] = [Math.round(e.nativeEvent.offsetX / currentW * canvasDim.width), Math.round(e.nativeEvent.offsetY / currentH * canvasDim.height)];
        let [xShow, yShow] = [e.nativeEvent.offsetX / currentW, e.nativeEvent.offsetY / currentH];
        changeAxis([...axis, { x, y, xShow, yShow, group }].sort((a, b) => a.group - b.group));
        console.log(x, y);
        console.log(xShow, yShow);
    }

    function delSpot(e, spotInfo) {
        if (e.button === 2) {
            console.log(spotInfo.index);
            let axisTemp = axis.filter((val, index, array) => {
                return index !== spotInfo.index
            })
            changeAxis(axisTemp);

            infoOfPoints.map((val, index) => {
                console.log("all: ", index);
                console.log(val.x, ", ", spotInfo.x);
                if (val.group === spotInfo.group && val.x == spotInfo.x && val.y == spotInfo.y) {
                    console.log(index);
                    console.log(infoOfPoints.filter((val, i, array) => {
                        return i !== index;
                    }));
                    changeInfoOfPoints(infoOfPoints.filter((val, i, array) => {
                        return i !== index;
                    }));
                    return;
                }
            });

            return;
        }
    }

    function switchGroup() {     //選取完點按下確認後觸發
        if (axis[axis.length - 1].group === null && totalGroup === 0) {   //新增第一組圖片，直接將group和totalGroup令為1
            //若為編輯第一組圖片，則totalGroup不為0，所以不會進入
            postImg(0);
            changeShowCanvas(false);
            changeGroup(1);
            changeTotalGroup(1);
            return;
        }


        let isPointSpot = false;
        axis.map((val, index) => {
            console.log(group === 0);
            if (val.group === group || group === 0) {
                isPointSpot = true;
                return;
            }
        });

        if (!isPointSpot) {
            //當使用者未新增座標點就按下確認，此時axis[axis.length - 1].group的數值會和group一樣
            //若為第一組圖片，則未選擇座標點時axis[axis.length - 1].group初始值為null
            alert("請點選座標點");
            return;
        }

        // if (axis[axis.length - 1].group + 1 === group) {
        //     //當使用者未新增座標點就按下確認，此時axis[axis.length - 1].group的數值會和group一樣
        //     //若為第一組圖片，則未選擇座標點時axis[axis.length - 1].group初始值為null
        //     alert("請點選座標點");
        //     return;
        // }
        if (totalGroup + 1 < fileName.length) { //代表使用者在未點擊確認的情況下就再按一次選擇檔案
            //totalGroup從零開始，由於State異步更新，所以totalGroup需要加一才會為實際組數
            let fileNamePrompt = [];
            for (let i = 0; i < totalGroup; i++) {
                fileNamePrompt.push(fileName[i]);
            }
            fileNamePrompt.push(fileName[fileName.length - 1]);
            changeFileName(fileNamePrompt);
            console.log('+++++++++++++++++++++++++++++++++++++');
            console.log(fileNamePrompt);
        }

        setShowUploadBtn(true);
        if (axis[axis.length - 1].group >= totalGroup) {   //代表新增一組圖片，而不是去編輯原本建立的圖片組
            console.log("new image");
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

        //console.log(URL.createObjectURL(file));
        console.log(file);
        drawTiffCanvas(file);
    }

    function delImg(groupNum) {
        if (groupNum - 1 === 0) {
            alert("第一組圖片為panel，無法刪除!");
            return;
        }
        // 要刪除的東西有: imageId, axis, pointInfo
        changeImageId(imageId.filter((val, index) => {
            return index !== groupNum - 1;
        }));


        let axisTemp = axis.filter((val, index) => {
            return val.group !== groupNum - 1;
        });
        for (let i = 0; i < axisTemp.length; i++) {
            if (axisTemp[i].group > groupNum - 1) {
                axisTemp[i].group = axisTemp[i].group - 1;
            }
        }
        changeAxis(axisTemp);

        let infoOfPointsTemp = infoOfPoints.filter((val, index) => {
            return val.group !== groupNum - 1;
        });
        for (let i = 0; i < infoOfPointsTemp.length; i++) {
            if (infoOfPointsTemp[i].group > groupNum - 1) {
                infoOfPointsTemp[i].group = infoOfPointsTemp[i].group - 1;
            }
        }
        changeInfoOfPoints(infoOfPointsTemp);


        changeFileName(fileName.filter((val, index) => {
            return index !== groupNum - 1;
        }))

        changeGroup(group - 1);
        changeTotalGroup(totalGroup - 1);
        console.log(imageId[groupNum - 1]);
    }

    function uploadFile(event) {
        if (event.target.files.length !== 5) {
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
                drawTiffCanvas(file);
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

    }

    function drawTiffCanvas(file) {
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
        //val.group === spotInfo.group && val.x == spotInfo.x && val.y == spotInfo.y
        let isAlreadyFilledInfo = false;
        infoOfPoints.map((val, index) => {
            if (val.group === info.group && val.x == info.x && val.y == info.y) {
                isAlreadyFilledInfo = true;
                return;
            }
        });

        if (!isAlreadyFilledInfo) {
            //該點的資訊未被輸入過
            console.log('true');
            changeInfoOfPoints([...infoOfPoints, { id: info.id, group: info.group, x: info.x, y: info.y, [info.name]: parseInt(info.value) }]);
            return;
        }
        // if (infoOfPoints.length + 1 === info.group || info.id > infoOfPoints[infoOfPoints.length - 1].id) {
        //     //該點的資訊未被輸入過
        //     console.log('true');
        //     changeInfoOfPoints([...infoOfPoints, { id: info.id, group: info.group, x: info.x, y: info.y, [info.name]: parseInt(info.value) }]);
        //     return;
        // }
        let infoPrompt = infoOfPoints;
        for (let i = 0; i < infoPrompt.length; i++) {
            //該點的資訊曾被輸入過，更新該點的其他檢測物資訊
            if (infoPrompt[i].group === info.group && infoPrompt[i].x === info.x && infoPrompt[i].y === info.y) {
                infoPrompt[i] = { ...infoOfPoints[i], [info.name]: parseInt(info.value) };
            }
        }
        changeInfoOfPoints(infoPrompt);
        //[...infoPrompt, {...infoOfPoints[infoOfPoints.length - 1], [info.name]: info.value}]
        console.log({ ...infoOfPoints[infoOfPoints.length - 1], [info.name]: info.value });
        console.log(infoOfPoints);
    }

    const postModelAndPutInfo = async () => {
        //imageId.length
        console.log(totalGroup);
        let infoList = [];
        let notFillAllInfo = false;
        for (let i = 0; i < axis.length - 1; i++) {    //因為axis中有一項是null，所以 axis.length-1 才是真正點的數量
            let infoPrompt = new Map();
            infoPrompt = infoOfPoints[i];
            let sizeOfMap = 0;
            for (let k in infoPrompt) {
                sizeOfMap++;
            }
            console.log(sizeOfMap);
            if (sizeOfMap !== 8) {
                notFillAllInfo = true;
                console.log(infoPrompt);
                console.log('not fill all info');
                break;
            }
            infoPrompt['image'] = imageId[infoPrompt.group];   //因為第一組圖片為不須標點，infoPrompt從1開始
            delete infoPrompt.id;
            delete infoPrompt.group;
            console.log(infoPrompt);
            infoList.push(infoPrompt);
            //axios.put(`/api/images/${imageId}/`, {points: infoPrompt});
        }
        if (notFillAllInfo) {
            alert("請確認 名稱 和 各點的資訊 是否為空?")
            return;
        }
        console.log(infoList);
        console.log({ name: modelName, points: infoList });
        try {
            //const res = await axios.put(`/api/models/${modelId}/`, { name: modelName, points: infoList });
            let id_for_build = 0;
            if (id != null) {
                const res_point = await axios.put(`/api/models/${id}/`, { name: modelName, panel: imageId[0], points: infoList });
                id_for_build = id;
                console.log(res_point.data);
            } else {
                const res = await axios.post("/api/models/", { name: modelName, panel: imageId[0] })
                console.log(res.data.id);
                id_for_build = res.data.id;
                const res_point = await axios.put(`/api/models/${res.data.id}/`, { name: modelName, panel: imageId[0], points: infoList });
                console.log(res_point.data);
            }

            //下面為build的部分，晚點用
            //const res_substance = await axios.post(`/api/models/${res.data.id}/build/`);
            fetch(`http://127.0.0.1:8000/api/models/${id_for_build}/build/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            ).then((response => response.body))
                .then(rs => {
                    const reader = rs.getReader();
                    return new ReadableStream({
                        async start(controller) {
                            changeIsShowStream(true);
                            let streamTotalStr = [];
                            while (true) {
                                const { done, value } = await reader.read();

                                // When no more data needs to be consumed, break the reading
                                if (done) {
                                    changeIsShowStream(false);
                                    window.location.href = "/"
                                    break;
                                }
                                var enc = new TextDecoder("utf-8");
                                const stringTxt = enc.decode(value).replace("<br>", "");
                                console.log(stringTxt);
                                document.getElementById("popUp").innerHTML += "<p>"+stringTxt+"</p>";
                                //streamTotalStr.push(stringTxt);
                                // console.log(streamTotalStr);
                                // changeStreamTxt(streamTotalStr);

                                // Enqueue the next data chunk into our target stream
                                controller.enqueue(value);
                            }

                            // Close the stream
                            //history.push({ pathname: '/', state: res.data.id });
                            controller.close();
                            reader.releaseLock();
                        }
                    })
                })
            //console.log(res_substance);
        } catch (e) {
            console.log(e)
        }
    }

    return <div>
        <NavigatorBar id={1} linkTo="/" />
        <h1 className="big-title">填寫水質檢測數據</h1>
        {/* 輸入model名稱 */}
        <form className="model-name-form" >
            <label>名稱: </label>
            <input type="text" name="name" id="model-name" value={modelName} onChange={handleModelName} />
            {/* <button type="button" className='button' style={{ float: "none", margin: "0px 20px" }} onClick={modelId === 0 ? postModel : () => alert('請勿重複送出名稱')}>送出</button> */}
        </form>

        {imageId.map((val, index) => index >= 0 ?
            <PrevPic key={index} group={index + 1} onClick={showPrevPic} delImg={delImg} /> :
            null)}
        {/* Array.from({ length: totalGroup }, (_, i) => i + 1).map((index, val) => totalGroup > 0 */}
        {/* ^顯示先前所選擇的圖片組，使用totalGroup，不論顯示的為哪一組，皆會顯示出所有先前選的圖片組 */}
        <form id="upload-img-container" >   {/*style={{ display: modelId !== 0 ? "block" : "none" }} */}
            {/* <button id="upload-img" onClick={handleClick}>上傳圖片</button> */}
            {/* <p>{fileName.toString()}</p> */}
            <input id="upload-img" type="file" onChange={uploadFile} multiple />
            {/* ref用來讓button操作input時有依據 */}
        </form>
        <p className='hint' style={{ display: showCanvas ? 'block' : "none" }}>在點上點擊右鍵即可將點刪除</p>
        <div className="image-container" >
            <canvas className='tif-canvas' ref={canvasRef} width={canvasDim.width} height={canvasDim.height}
                style={{ display: showCanvas ? 'block' : "none" }}
                onMouseUp={group !== 0 ? pointSpot : null} />
            {axis.map((val, index) => index > 0 && val.group === group ?
                (<Spot key={index} index={index} group={val.group} axisX={val.xShow} axisY={val.yShow}
                    x={val.x} y={val.y} show={showCanvas} onRightClick={delSpot}
                />)
                : null)}
            {/* 因為圓點的半徑為5px，所以x, y需要補正5px */}
            <button className='button' style={{ display: showCanvas && canvasDim.height !== 0 ? "block" : "none" }} onClick={switchGroup}>確認</button>
        </div>
        <div className="handle-table" style={{ width: "70vw" }}>
            {/* style={{ display: modelId !== 0 ? "block" : "none" }} */}
            <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
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
                    {axis.map((val, index) => val.group !== null ?
                        <TableRow key={index} id={index} spot={{ x: val.x, y: val.y, group: val.group }}
                            value={infoOfPoints[index]} onChange={handlePointsInfo} /> :
                        null)
                    }
                </tbody>
            </Table>
            <div className='center-button'>
                <button className='upload-button' style={{
                    display:
                        (fileName.length !== 0 && showUploadBtn === true) || id != null ?
                            'inline-block' : 'none'
                }}
                    onClick={postModelAndPutInfo}>
                    {/* postModelAndPutInfo */}
                    上傳
                </button>
            </div>
        </div>
        {/* <StreamMesPopUp show={isShowStream} message={streamTxt}  singleMsg={streamTxt[streamTxt.length-1]} /> */}
        <div className="popUp-background" style={{display: isShowStream ? "block" : "none"}}>
            <div className="popUp" id="popUp" style={{ textAlign: "start", overflowY: "scroll"}}></div>
        </div>
    </div>
}

export default NewModule;