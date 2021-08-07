import React, { useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import { Link, useHistory } from "react-router-dom";
import Cards from '../components/Cards';
import axios from "../components/axios";
import ModuleInfoPopUp from "../components/moduleInfoPopUp";

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

    const substances = [{
        "name": "do",
        "features": "red, green, blue",
        "r2": 89.87
    },
    {
        "name": "bod",
        "features": "red, green, blue",
        "r2": 89.87
    },
    {
        "name": "ss",
        "features": "red, green, blue",
        "r2": 89.87
    },
    {
        "name": "nh3n",
        "features": "red, green, blue",
        "r2": 89.87
    }];
    const name = '123';
    const modelNum = 0;
    const predictNum = 0;
    console.log(Math.pow(2, modelNum));
    console.log(Math.pow(2, predictNum) + 1);
    let history = useHistory();
    console.log(history.location.state);

    const [modelData, changeModelData] = useState();
    const [clickedCardId, chclickedCardId] = useState(0);


    React.useEffect(() => {
        if (props.location.pathname === '/') {
            window.addEventListener('load', async () => {
                const res = await axios.get('/api/models/');
                let data = [];
                console.log(res);
                for (let i = 1; i <= res.data.length; i++) {
                    const res_id = await axios.get('/api/models/' + i);
                    data.push(res_id.data);
                }
                console.log(data);
                changeModelData(data);
            });
        }
    });

    function getClickedCard(id) {
        console.log(id);
        chclickedCardId(id);
    }

    return <div>
        <NavigatorBar id={0} linkTo="null" />
        <div>
            <h1 className='big-title'>所有模型</h1>
            <div className='center-button'>
                <Link to={"/newModule"} style={{ textDecoration: 'none' }}>
                    <button className="new-model-button">
                        新增模型
                    </button>
                </Link>
            </div>
            <div style={card_container}>
                {modelData != null ? modelData.map((val, index) => val.group !== null ?
                    <Cards key={Math.pow(2, index)} id={val.id} name={val.name} onClick={getClickedCard} /> :
                    null) : null}

            </div>
            <hr />
            <h1 className='big-title'>所有預測</h1>
            <div className='center-button'>
                <Link to={"/newPredict"} style={{ textDecoration: 'none' }}>
                    <button className="new-model-button">
                        新增預測
                    </button>
                </Link>
            </div>
            <div style={{ textAlign: "center" }}>
                {/* <Cards key={Math.pow(2, predictNum) + 1} name={name} substances={substances} /> */}
            </div>
        </div>
        {
            clickedCardId != 0 ? <ModuleInfoPopUp substances={modelData[clickedCardId-1].substances} /> : null
        }
        
    </div>

}

export default AllModuleAndPredict;