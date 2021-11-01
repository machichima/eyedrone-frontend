import React, { useState } from "react";
import { useQuery } from "react-query";
import { getModelList } from "../api/model";

function useModelSelector() {
  const [modelId, setModelId] = useState(1);
  function ModelSelector() {
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
      <select value={modelId} onChange={(e) => setModelId(e.target.value)}>
        {options}
      </select>
    );
  }
  return {
    modelId,
    ModelSelector,
  };
}

export default useModelSelector;
