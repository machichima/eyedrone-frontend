import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../components/axios";
import ModuleInfoPopUp from "../components/moduleInfoPopUp";
import PredictInfoPopUp from "../components/predictInfoPopUp";
import ModelList from "../components/ModelList";
import PredictList from "../components/PredictList";

function Home(props) {
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
    if (props.location.pathname === "/") {
      window.addEventListener("load", async () => {
        const resPredict = await axios.get("/api/predicts/");
        chPredictData(resPredict.data);
        console.log(resPredict.data);

        const res = await axios.get("/api/models/");
        let data = [];
        let predictDataTemp = [];
        console.log(res);
        if (res.data.length < 1) return;
        for (let i = res.data[0].id; i <= res.data.length; i++) {
          let res_id;
          try {
            res_id = await axios.get("/api/models/" + i);
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

  return (
    <div>
      <div>
        <ModelList />
        <hr />
        <PredictList />
      </div>
      {cliModelCardIndex != null ? (
        <ModuleInfoPopUp
          id={modelData[cliModelCardIndex].id}
          modelName={modelData[cliModelCardIndex].name}
          substances={modelData[cliModelCardIndex].substances}
          onClick={getClickedCard}
        />
      ) : null}
      {cliPreCardIndex != null ? (
        <PredictInfoPopUp
          id={predictData[cliPreCardIndex].id}
          created_at={predictData[cliPreCardIndex].created_at}
          results={predictData[cliPreCardIndex].results}
          onClick={getPredictClickedCard}
        />
      ) : null}
      <br></br>
    </div>
  );
}

export default Home;
