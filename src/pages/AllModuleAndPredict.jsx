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
    const name='123';
    // history.location.state
    let history = useHistory();
    return <div>
        <NavigatorBar id={0} linkTo="null" />
        <div>
            <h1 className='big-title'>所有模型</h1>
            <button className="show-data">
                <Link to={"/newModule"}>
                    新增模型
                </Link>
            </button>
            <Cards name={name} substances={substances} />)
        </div>

    </div>

}

export default AllModuleAndPredict;