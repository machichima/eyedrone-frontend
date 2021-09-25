import React, { useEffect, useRef, useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import PrevPic from "../components/prev-pic";
import { Link } from 'react-router-dom';
import Tiff from 'tiff.js';
import axios from "../components/axios";



function NewPredict() {
    const [modelId, chModelId] = useState(1);
    const [allModel, chAllModel] = useState();
    const [imageId, changeImageId] = useState([]);
    const [predictDate, setPredictDate] = useState('');
    const [predictTime, setPredictTime] = useState('');
    var canvasRef = useRef(null);
    var [canvasDim, changeCanvasDim] = useState({ height: 0, width: 0 });
    const [previewImgUrl, chPreviewImgUrl] = useState([]);
    var [fileName, changeFileName] = useState([]);
    const [showCanvas, changeShowCanvas] = useState(false);    //是否顯示圖片讓使用者標點
    const [group, changeGroup] = useState(0);    //顯示的圖片組數
    const [totalGroup, changeTotalGroup] = useState(0);    //總共的圖片組數
    const [showUploadBtn, setShowUploadBtn] = useState(false);
    const [panelName, chPanelName] = useState('');
    const [allPanel, chAllPanel] = useState([]);
    const [panelId, chPanelId] = useState(1);

    const [isUploadingImg, chIsUploadingImg] = useState(false);
    const [isUploadingPre, chIsUploadingPre] = useState(false);

    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");

    React.useEffect(() => {
        window.addEventListener('load', async () => {
            const res = await axios.get('/api/models/');
            const resImg = await axios.get('/api/images/');
            const resPanel = await axios.get('/api/panels/');
            let data = [];
            chAllModel(res.data);
            chAllPanel(resPanel.data);
            console.log(res.data);
            console.log("images: ", resImg.data);
            console.log("panels: ", resPanel.data);
            if (id != null) {
                const res_predictData = await axios.get('/api/predicts/' + id);
                chModelId(res_predictData.data.model);
                let allImgId = [];
                res_predictData.data.images.map((val, index) => {
                    if (!allImgId.includes(val)) {
                        allImgId.push(val);
                    }
                });
                let panelImg = 0;
                resImg.data.map((val, index) => {
                    if (allImgId.includes(val.id)) {
                        panelImg = val.panel;
                        return;
                    }
                });
                if (panelImg !== 0) {
                    allImgId = [panelImg, ...allImgId];
                    chPanelId(panelImg);
                }

                console.log("all image id: ", allImgId);
                changeImageId(allImgId);
                changeTotalGroup(allImgId.length);

                let previewImgUrlTemp = []
                allImgId.map((val, index) => {
                    if (index === 0) {
                        previewImgUrlTemp = [...previewImgUrlTemp, resPanel.data[val - 1].preview];
                        console.log(resPanel.data[val - 1].preview);
                    } else {
                        previewImgUrlTemp = [...previewImgUrlTemp, resImg.data[val - 1].rgb];

                    }
                });

                chPreviewImgUrl(previewImgUrlTemp);

                let dateTime = res_predictData.data.created_at;
                setPredictDate(dateTime.split('T')[0]);
                setPredictTime(dateTime.split('T')[1].slice(0, -1));
                setShowUploadBtn(true);
            }
        });
    });

    function handlePredictDate(e) {
        setPredictDate(e.target.value);
    }

    function handlePredictTime(e) {
        setPredictTime(e.target.value);
    }

    function handlePanelName(e) {
        chPanelName(e.target.value);
    }

    function selectPanel() {
        if(window.confirm("按下確認後則無法再變更所選擇的panel, 是否選擇該panel?")) {
            changeImageId([panelId]);
            chPreviewImgUrl(['']);
        }
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
        }
        //changeTotalGroup(totalGroup + 1);
        //console.log("total group", totalGroup);
        postImg(fileNameTemp, imageId.length);
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
        console.log("totalGroup: ", totalGroup);
        if (totalGroup === 0) {   //新增第一組圖片，直接將group和totalGroup令為1
            //若為編輯第一組圖片，則totalGroup不為0，所以不會進入
            //postImg(0);
            changeShowCanvas(false);
            changeGroup(1);
            changeTotalGroup(1);
            return;
        }
        setShowUploadBtn(true);
        console.log("fileName length", fileName.length);
        console.log("total group", totalGroup);
        if (fileName.length > totalGroup) {   //代表新增一組圖片，而不是去編輯原本建立的圖片組
            //postImg(axis[axis.length - 1].group);
            //postImg(group);
        }
        changeShowCanvas(false);
        changeGroup(imageId.length);
        changeTotalGroup(imageId.length);
        console.log(group);
        console.log(fileName);
    }

    const postImg = async (fileNameTemp, imageIdLen) => {    //post multiple image to backend
        setShowUploadBtn(false);
        //Step 1:取得state數據
        //Step 2:新增到JSON-Server數據庫中 
        console.log('----------------------------------');
        console.log(fileNameTemp);
        let param = new FormData();  // 创建form对象
        //param.append('model', modelId);  // 通过append向form对象添加数据
        //param.append('is_panel', (groupNum === 0) ? true : false);
        if (imageIdLen >= 1) {
            param.append('panel', imageId[0]);
        }
        param.append('blue', fileNameTemp[0]);
        param.append('green', fileNameTemp[1]);
        param.append('red', fileNameTemp[2]);
        param.append('nir', fileNameTemp[3]);
        param.append('red_edge', fileNameTemp[4]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
            timeout: 60000
        }
        try {
            if (imageIdLen < 1) {
                const res = await axios.post("/api/panels/", param, config);
                console.log(res.data);
                changeImageId([...imageId, res.data.id]);
                console.log(res.data.preview);
                chPreviewImgUrl([...previewImgUrl, res.data.preview]);
            } else {
                chIsUploadingImg(true);
                setShowUploadBtn(false);
                const res = await axios.post("/api/images/", param, config);
                if (res.data) {
                    chIsUploadingImg(false);
                    changeShowCanvas(true);
                }
                console.log(res.data);
                changeTotalGroup(imageId.length);
                changeGroup(imageId.length);
                changeImageId([...imageId, res.data.id]);
                console.log(res.data.rgb);
                chPreviewImgUrl([...previewImgUrl, res.data.rgb]);
            }
            console.log("sent image");

        } catch (e) {
            console.log(e)
        }

    }

    function showPrevPic(groupNum) {     //按下先前編輯的圖片組
        setShowUploadBtn(false);
        changeGroup(groupNum - 1);
        console.log(groupNum);
        changeShowCanvas(true);
    }

    function delImg(groupNum) {
        if (groupNum - 1 === 0) {
            alert("第一組圖片為panel，無法刪除!");
            return;
        }
        // 要刪除的東西有: imageId, 
        changeImageId(imageId.filter((val, index) => {
            return index !== groupNum - 1;
        }));

        chPreviewImgUrl(previewImgUrl.filter((val, index) => {
            return index !== groupNum - 1;
        }))

        changeGroup(group - 1);
        changeTotalGroup(totalGroup - 1);
        console.log(imageId[groupNum - 1]);
    }

    async function postPredict() {
        if (predictDate.length < 1 || predictTime < 1) {
            alert("請確認 日期 或 時間 是否為空?");
            return;
        }
        chIsUploadingPre(true);
        let imageIdList = [];
        for (let i = 1; i < imageId.length; i++) {
            imageIdList.push(imageId[i]);
        }
        console.log(imageIdList);
        console.log({
            model: modelId, created_at: predictDate + "T" + predictTime + ":00Z",
            images: [imageIdList]
        });
        const res = await axios.post("/api/predicts/",
            {
                model: modelId, created_at: predictDate + "T" + predictTime + ":00Z",
                images: imageIdList
            }, { timeout: 20000 });
        if (res) {
            chIsUploadingPre(false);
            window.location.href = "/";
        }
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
            <select value={modelId} onChange={(e) => { chModelId(e.target.value); console.log(e.target.value) }}>
                {allModel != null ? allModel.map((val, index) => {
                    if (val.id === modelId) {
                        return <option key={val.id} value={val.id}>{val.name}</option>
                    }
                    return <option key={val.id} value={val.id}>{val.name}</option>
                })
                    : null}
            </select>
        </form>

        <div className='upload-img-form-container'>
            <h5 className='upload-img-form-label'>上傳panel: (panel只可上傳一次)</h5>
            <form>
                <label style={{marginRight: "10px", marginTop: "20px"}}>選擇已上傳的panel:</label>
                <select value={panelId} disabled={imageId.length > 0 ? true : false}
                    onChange={(e) => { chPanelId(e.target.value); console.log(e.target.value) }}>
                    {allPanel != null ? allPanel.map((val, index) => {
                        if (val.id === panelId) {
                            return <option key={val.id} value={val.id}>{val.id}</option>
                        }
                        return <option key={val.id} value={val.id}>{val.id}</option>
                    })
                        : null}
                </select>
                <button type='button' className='normal-button' onClick={selectPanel}
                        disabled={imageId.length > 0 ? true : false}>
                            確認
                </button>
                <br />
                <p>or</p>

                <label>panel名稱: </label>
                <br />
                <input type="text" name="name" id="panel-name" value={panelName} onChange={handlePanelName}
                        disabled={imageId.length > 0 ? true : false} />
            </form>
            <br />
            <form id="upload-img-container">   {/* */}
                {/* <button id="upload-img" onClick={handleClick}>上傳圖片</button> */}
                {/* <p>{fileName.toString()}</p> */}
                <input id="upload-img" type="file" onChange={uploadFile} multiple
                    disabled={imageId.length > 0 ? true : false} />
                {/* ref用來讓button操作input時有依據 */}
            </form>
        </div>
        <hr />

        <div className='upload-img-form-container'>
            <h5 className='upload-img-form-label'>上傳images: </h5>

            {imageId.map((val, index) => index > 0 ?
                <PrevPic key={index} group={index + 1} onClick={showPrevPic} delImg={delImg} /> :
                null)}
            <p className='hint' style={{ display: isUploadingImg ? 'block' : "none" }}>圖片上傳中</p>

            <form id="upload-img-container">   {/* */}
                {/* <button id="upload-img" onClick={handleClick}>上傳圖片</button> */}
                {/* <p>{fileName.toString()}</p> */}
                <input id="upload-img" type="file" onChange={uploadFile} multiple
                    disabled={isUploadingImg || imageId.length < 1 ? true : false} />
                {/* ref用來讓button操作input時有依據 */}
            </form>
        </div>

        <div className="image-container" >
            <img id="imgShow" src={previewImgUrl[group]}
                style={{
                    objectFit: "contain", width: "100%", height: "100%",
                    display: showCanvas ? 'block' : "none"
                }}
            />
            <button className='button' style={{ display: showCanvas ? "block" : "none" }} onClick={switchGroup}>確認</button>
        </div>
        <br />
        <div className='center-button'>
            <button className='upload-button' style={{ display: (showUploadBtn === true) ? 'inline-block' : 'none' }}
                onClick={postPredict}>
                {/* postPredict */}
                上傳
            </button>
        </div>
        <div className="popUp-background" style={{ display: isUploadingPre ? "block" : "none" }}>
            <div className="popUp" id="popUp" style={{ textAlign: "center", padding: "20px" }}>上傳預測資料中...</div>
        </div>
    </div>

}

export default NewPredict;