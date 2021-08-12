import React, { useEffect, useRef, useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import PrevPic from "../components/prev-pic";
import { Link } from 'react-router-dom';
import Tiff from 'tiff.js';
import axios from "../components/axios";



function NewPredict() {
    const [modelId, chModelId] = useState(0);
    const [allModel, chAllModel] = useState();
    const [imageId, changeImageId] = useState([]);
    const [predictDate, setPredictDate] = useState('');
    const [predictTime, setPredictTime] = useState('');
    var canvasRef = useRef(null);
    var [canvasDim, changeCanvasDim] = useState({ height: 0, width: 0 });
    var [fileName, changeFileName] = useState([]);
    const [showCanvas, changeShowCanvas] = useState(true);    //是否顯示圖片讓使用者標點
    const [group, changeGroup] = useState(0);    //顯示的圖片組數
    const [totalGroup, changeTotalGroup] = useState(0);    //總共的圖片組數
    const [showUploadBtn, setShowUploadBtn] = useState(false);

    React.useEffect(() => {
        window.addEventListener('load', async () => {
            const res = await axios.get('/api/models/');
            let data = [];
            chAllModel(res.data);
            console.log(res.data);
        });
    });

    function handlePredictDate(e) {
        setPredictDate(e.target.value);
    }

    function handlePredictTime(e) {
        setPredictTime(e.target.value);
    }

    function postPredict() {
        if (predictDate === '' || predictTime === '') {
            alert('請輸入所有欄位以繼續');
            return;
        }
        console.log(predictDate);
        console.log(predictTime);
        //changeModelId(1);
    }

    function uploadFile(event) {
        //setShowUploadBtn(false);
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
        //changeTotalGroup(totalGroup + 1);
        //console.log("total group", totalGroup);
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

    function switchGroup() {     //選取完點按下確認後觸發
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
        if (totalGroup === 0) {   //新增第一組圖片，直接將group和totalGroup令為1
            //若為編輯第一組圖片，則totalGroup不為0，所以不會進入
            postImg(0);
            changeShowCanvas(false);
            changeGroup(1);
            changeTotalGroup(1);
            console.log(showUploadBtn);
            return;
        }
        setShowUploadBtn(true);
        console.log("fileName length", fileName.length);
        console.log("total group", totalGroup);
        if (fileName.length > totalGroup) {   //代表新增一組圖片，而不是去編輯原本建立的圖片組
            //postImg(axis[axis.length - 1].group);
            postImg(group);
        }
        changeShowCanvas(false);
        changeGroup(fileName.length);
        changeTotalGroup(fileName.length);
        console.log(group);
        console.log(fileName);
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
            console.log(res.data);
            changeImageId([...imageId, res.data.id]);
        } catch (e) {
            console.log(e)
        }

    }

    function showPrevPic(groupNum) {     //按下先前編輯的圖片組
        setShowUploadBtn(false);
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

    async function postPredict() {
        let imageIdList = [];
        for(let i = 1; i < modelId.length; i++) {
            imageIdList.push(imageId[i]);
        }
        console.log(imageIdList);
        // console.log({ model: modelId, created_at: predictDate+"T"+predictTime+":00Z", panel: imageId[0],
        // images: [imageIdList]});
        const res = await axios.post("/api/predicts/", 
            { model: modelId, created_at: predictDate+"T"+predictTime+":00Z", panel: imageId[0],
                images: imageIdList});
        console.log(res);
    }

    return <div>
        <NavigatorBar id={0} linkTo="/" />
        <h1 className="big-title">填寫預測數據</h1>
        <form className="model-name-form" >
            <label>日期: </label>
            <input type="date" name="name" id="model-name" value={predictDate} onChange={handlePredictDate} required></input>
            <label style={{ marginLeft: '10px' }}>時間: </label>
            <input type="time" name="name" id="model-name" value={predictTime} onChange={handlePredictTime} required></input>
            <label style={{ marginLeft: '10px' }}>選擇模型: </label>
            <select onChange={(e)=>{chModelId(e.target.value)}}>
                {allModel != null ? allModel.map((val, index)=> <option value={val.id}>{val.name}</option>) : null}
            </select>
        </form>
        {Array.from({ length: totalGroup }, (_, i) => i + 1).map((index, val) => totalGroup > 0 ?
            <PrevPic key={index} group={index} onClick={showPrevPic} /> :
            null)}
        <form id="upload-img-container">   {/* */}
            {/* <button id="upload-img" onClick={handleClick}>上傳圖片</button> */}
            {/* <p>{fileName.toString()}</p> */}
            <input id="upload-img" type="file" onChange={uploadFile} multiple />
            {/* ref用來讓button操作input時有依據 */}
        </form>

        <div className="image-container" >
            <canvas className='tif-canvas' ref={canvasRef} width={canvasDim.width} height={canvasDim.height}
                style={{ display: showCanvas ? 'block' : "none" }} />
            <button className='button' style={{ display: showCanvas && canvasDim.height !== 0 ? "block" : "none" }} onClick={switchGroup}>確認</button>
        </div>
        <div className='center-button'>
            <button className='upload-button' style={{ display: (fileName.length !== 0 && showUploadBtn === true) ? 'inline-block' : 'none' }}
                    onClick={postPredict}>
                上傳
            </button>
        </div>
    </div>

}

export default NewPredict;