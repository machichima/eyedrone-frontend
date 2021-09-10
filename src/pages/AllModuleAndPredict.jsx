import React, { useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import { Link, useHistory } from "react-router-dom";
import Cards from '../components/Cards';
import axios from "../components/axios";
import ModuleInfoPopUp from "../components/moduleInfoPopUp";
import PredictInfoPopUp from "../components/predictInfoPopUp";

function AllModuleAndPredict(props) {

    const card_container = {
        width: "70vw",
        margin: "0 auto",
        display: "grid",
        gridGap: "20px",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        justifyContent: "space-between",
        alignItems: "center",

    }

    const name = '123';
    const modelNum = 0;
    const predictNum = 0;
    console.log(Math.pow(2, modelNum));
    console.log(Math.pow(2, predictNum) + 1);
    let history = useHistory();
    console.log(history.location.state);

    const [modelData, changeModelData] = useState();
    const [predictData, chPredictData] = useState();
    const [cliModelCardIndex, chcliModelCardIndex] = useState(null);
    const [cliPreCardIndex, chcliPreCardIndex] = useState(null);


    React.useEffect(() => {
        if (props.location.pathname === '/') {
            window.addEventListener('load', async () => {
                const resPredict = await axios.get('/api/predicts/');
                chPredictData(resPredict.data);
                console.log(resPredict.data);

                const res = await axios.get('/api/models/');
                let data = [];
                let predictDataTemp = []
                console.log(res);
                if(res.data.length < 1) return;
                for (let i = res.data[0].id; i <= res.data.length; i++) {
                    let res_id;
                    try{
                        res_id = await axios.get('/api/models/' + i);
                    } catch {
                        continue;
                    }
                    data.push(res_id.data);
                }
                console.log(data);
                changeModelData(data);
            });
        }
    });

    function getClickedCard(index) {
        chcliModelCardIndex(index);
    }

    function getPredictClickedCard(index) {
        console.log("predict clicked id: ");
        console.log(index);
        console.log("predict clicked /// ");
        chcliPreCardIndex(index);
    }

    return <div>
        <NavigatorBar id={0} linkTo="null" />
        <div>
            <h1 className='big-title'>所有模型</h1>
            <div className='center-button'>
                {/* <Link to={"/newModule"} style={{ textDecoration: 'none' }}> */}
                    <button className="new-model-button" onClick={()=>{window.location.href = "/newModule";}}>
                        新增模型
                    </button>
                {/* </Link> */}
            </div>
            <div style={card_container}>
                {modelData != null ? modelData.map((val, index) => 
                    <Cards key={2*index} index={index} id={val.id} name={val.name} onClick={getClickedCard} />) : null}

            </div>
            <hr />
            <h1 className='big-title'>所有預測</h1>
            <div className='center-button'>
                {/* <Link to={"/newPredict"} style={{ textDecoration: 'none' }}> */}
                    <button className="new-model-button" onClick={()=>{window.location.href = "/newPredict";}}>
                        新增預測
                    </button>
                {/* </Link> */}
            </div>
            <div style={card_container}>
                {predictData != null ? predictData.map((val, index) => 
                    <Cards key={2*index + 1} index={index} id={val.id} dateTime={val.created_at} onClick={getPredictClickedCard}/>
                ) : null}
            </div>
        </div> 
        {
            cliModelCardIndex != null ? <ModuleInfoPopUp id={modelData[cliModelCardIndex].id}
                                    modelName={modelData[cliModelCardIndex].name} 
                                    substances={modelData[cliModelCardIndex].substances} 
                                    onClick={getClickedCard}
                                    /> : null
        }
        {
            cliPreCardIndex != null ? <PredictInfoPopUp id={predictData[cliPreCardIndex].id}
                                    created_at={predictData[cliPreCardIndex].created_at} 
                                    results={predictData[cliPreCardIndex].results}
                                    onClick={getPredictClickedCard}
                                    /> : null
        }
        <br></br>
        
    </div>

}

export default AllModuleAndPredict;