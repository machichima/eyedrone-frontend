import React, { useState } from "react";
import useModelSelector from "../components/useModelSelector";

function NewPredict() {
  const [predictDateTime, setPredictDateTime] = useState("");
  const { modelId, ModelSelector } = useModelSelector();
  console.log(modelId);
  return (
    <div>
      <h1 className="big-title">填寫預測數據</h1>
      <form className="model-name-form">
        <label>日期: </label>
        <input
          type="datetime-local"
          name="name"
          id="model-name"
          value={predictDateTime}
          onChange={(e) => setPredictDateTime(e.target.value)}
          required
        ></input>
        <label style={{ marginLeft: "10px" }}>選擇模型: </label>
        <ModelSelector />
      </form>
    </div>
  );
}

export default NewPredict;
