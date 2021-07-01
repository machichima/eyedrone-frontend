import React, { useRef, useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import PrevPic from "../components/prev-pic";
import { Link } from 'react-router-dom';
import Tiff from 'tiff.js';



function NewPredict() {
    const [modelId, changeModelId] = useState(0);
    const [predictDate, setPredictDate] = useState('');
    const [predictTime, setPredictTime] = useState('');
    var canvasRef = useRef(null);
    var [canvasDim, changeCanvasDim] = useState({ height: 0, width: 0 });
    var [fileName, changeFileName] = useState([]);
    const [showCanvas, changeShowCanvas] = useState(true);    //是否顯示圖片讓使用者標點
    const [group, changeGroup] = useState(0);    //顯示的圖片組數
    const [totalGroup, changeTotalGroup] = useState(0);    //總共的圖片組數
    const [showUploadBtn, setShowUploadBtn] = useState(false);
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
        changeModelId(1);
    }

    function uploadFile(event) {
        setShowUploadBtn(false);
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
        setShowUploadBtn(true);
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
            //postImg(0);
            changeShowCanvas(false);
            changeGroup(1);
            changeTotalGroup(1);
            console.log(showUploadBtn);
            return;
        }
        if (fileName.length === totalGroup) {   //代表新增一組圖片，而不是去編輯原本建立的圖片組
            //postImg(axis[axis.length - 1].group);
        }
        changeShowCanvas(false);
        changeGroup(fileName.length);
        changeTotalGroup(fileName.length);
        console.log(group);
        console.log(fileName);
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

    return <div>
        <NavigatorBar id={0} linkTo="/" />
        <h1 className="big-title">填寫預測數據</h1>
        <form className="model-name-form" >
            <label>日期: </label>
            <input type="date" name="name" id="model-name" value={predictDate} onChange={handlePredictDate} required></input>
            <label style={{ marginLeft: '10px' }}>時間: </label>
            <input type="time" name="name" id="model-name" value={predictTime} onChange={handlePredictTime} required></input>
            <button type="button" className='button' style={{ float: "none", margin: "0px 20px" }} onClick={modelId === 0 ? postPredict : () => alert('請勿重複送出名稱')}>送出</button>
        </form>
        {Array.from({ length: totalGroup }, (_, i) => i + 1).map((index, val) => totalGroup > 0 ?
            <PrevPic key={index} group={index} onClick={showPrevPic} /> :
            null)}
        <form id="upload-img-container" style={{ display: modelId !== 0 ? "block" : "none" }}>   {/* */}
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
            <button className='upload-button' style={{ display: (fileName.length !== 0 && showUploadBtn === true) ? 'inline-block' : 'none' }}>
                上傳
            </button>
        </div>
    </div>

}

export default NewPredict;