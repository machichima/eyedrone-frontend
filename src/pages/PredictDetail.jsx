import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "../components/axios";
import ResultDetail from "../components/ResultDetail";

async function getPredict(id) {
  const res = await axios.get(`/api/predicts/${id}`);
  return res.data;
}

function PredictDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["predict-detail", id],
    () => getPredict(id)
  );
  if (isLoading) {
    return <p>正在載入預測...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  const resultList = data.results.map((result, id) => (
    <ResultDetail result={result} resultId={id} />
  ));
  return (
    <div>
      <p>Model ID: {data.model}</p>
      <div>{resultList}</div>
    </div>
  );
}

export default PredictDetail;
