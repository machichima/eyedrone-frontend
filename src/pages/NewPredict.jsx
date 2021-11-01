import React, { useState } from "react";
import useModelSelector from "../components/useModelSelector";

function NewPredict() {
  const [predictDate, setPredictDate] = useState("");
  const [predictTime, setPredictTime] = useState("");
  const { modelId, ModelSelector } = useModelSelector();
  console.log(modelId);
  return (
    <div>
      <h1 className="big-title">填寫預測數據</h1>
      <form className="model-name-form">
        <label>日期: </label>
        <input
          type="date"
          name="name"
          id="model-name"
          value={predictDate}
          onChange={(e) => setPredictDate(e.target.value)}
          required
        ></input>
        <label style={{ marginLeft: "10px" }}>時間: </label>
        <input
          type="time"
          name="name"
          id="model-name"
          value={predictTime}
          onChange={(e) => setPredictTime(e.target.value)}
          required
        ></input>
        <label style={{ marginLeft: "10px" }}>選擇模型: </label>
        <ModelSelector />
      </form>
    </div>
  );
}

export default NewPredict;
