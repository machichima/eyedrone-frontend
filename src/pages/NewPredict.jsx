import React, { useState } from "react";
import useModelSelector from "../components/useModelSelector";
import usePanelSelector from "../components/usePanelSelector";
import useImageSelector from "../components/useImageSelector";

function NewPredict() {
  const [predictDateTime, setPredictDateTime] = useState("");
  const { modelId, ModelSelector } = useModelSelector();
  const { panelId, isConfirmed, PanelSelector } = usePanelSelector();
  const { image, ImageSelector } = useImageSelector();
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
        <ModelSelector />
      </form>
      <PanelSelector />
    </div>
  );
}

export default NewPredict;
