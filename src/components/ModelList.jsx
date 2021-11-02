import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getModelList } from "../api/model";

function ModelList() {
  const { data, isLoading, isError, error } = useQuery(
    "model-list",
    getModelList
  );
  if (isLoading) {
    return <p>正在載入模型列表...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  const modelList = data.map((model, index) => (
    <li key={model.id}>
      <Link to={`/models/${model.id}-${model.name}`}>{model.name}</Link>
    </li>
  ));
  return (
    <div>
      <h1 className="big-title">所有模型</h1>
      <div className="center-button">
        <Link className="new-model-button" to="/models/new">
          新增模型
        </Link>
      </div>
      <ul>{modelList}</ul>
    </div>
  );
}

export default ModelList;
