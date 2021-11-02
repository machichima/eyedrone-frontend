import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "./axios";

async function getPredicts() {
  try {
    const res = await axios.get("/api/predicts/");
    return res.data;
  } catch (err) {
    throw err;
  }
}

function PredictList() {
  const { data, isLoading, isError, error } = useQuery(
    "predict-list",
    getPredicts
  );
  if (isLoading) {
    return <p>正在載入預測列表...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  const predictList = data.map((predict, index) => {
    console.log(predict);
    const name = predict.created_at.toString();
    return (
      <li key={predict.id}>
        <Link to={`/predicts/${predict.id}`}>{name}</Link>
      </li>
    );
  });
  return (
    <div>
      <h1 className="big-title">所有預測</h1>
      <div className="center-button">
        <Link className="new-model-button" to="/predicts/new">
          新增預測
        </Link>
      </div>
      <ul>{predictList}</ul>
    </div>
  );
}

export default PredictList;
