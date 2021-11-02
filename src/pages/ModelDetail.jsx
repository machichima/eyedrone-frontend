import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "../components/axios";

async function getModelDetail(id) {
  const res = await axios.get(`/api/models/${id}/`);
  return res.data;
}

function ModelDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["model-detail", id],
    () => getModelDetail(id)
  );
  if (isLoading) {
    return <p>正在載入模型...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  console.log(data);
  const substanceList = data.substances.map(({ name, formula, r2 }) => (
    <div key={name}>
      <h3>{name}</h3>
      <p>公式：{formula}</p>
      <p>R2：{r2}</p>
    </div>
  ));
  return (
    <div>
      <h1>{data.name}</h1>
      <div>{substanceList}</div>
    </div>
  );
}

export default ModelDetail;
