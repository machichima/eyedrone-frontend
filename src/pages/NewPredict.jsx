import React, { useState } from "react";
import { useQuery } from "react-query";
import { getModelList } from "../api/model";

function NewPredict() {
  const [predictDate, setPredictDate] = useState("");
  const [predictTime, setPredictTime] = useState("");
  const [modelId, setModelId] = useState(0);
  const {
    data: models,
    isLoading,
    isError,
    error,
  } = useQuery("model-list", getModelList);
  if (isLoading) {
    return <p>正在載入模型列表...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  const options = models.map((model) => (
    <option key={model.id} value={model.id}>
      {model.name}
    </option>
  ));
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
        <select value={modelId} onChange={(e) => setModelId(e.target.value)}>
          {options}
        </select>
      </form>
    </div>
  );
}

export default NewPredict;
