import React, { useState } from "react";
import NavigatorBar from "../components/NavigatorBar";
import { Link, useHistory } from "react-router-dom";
import Cards from '../components/Cards';

function AllModuleAndPredict() {
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
            <Cards key={Math.pow(2, modelNum)} name={name} substances={substances} />
            <hr />
            <h1 className='big-title'>所有預測</h1>
            <div className='center-button'>
                <Link to={"/newPredict"} style={{ textDecoration: 'none' }}>
                    <button className="new-model-button">
                        新增預測
                    </button>
                </Link>
            </div>
            <Cards key={Math.pow(2, predictNum) + 1} name={name} substances={substances} />
        </div>
    </div>

}

export default AllModuleAndPredict;