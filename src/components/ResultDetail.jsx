import React from "react";
import { useQuery } from "react-query";
import axios from "./axios";

import useHoverPopUp from "./useHoverPopUp";

function ResultImage({ resultId, imageKey, url, getValue }) {
  const id = `${resultId}-${imageKey}`;
  const { HoverPopUp, update, hide } = useHoverPopUp(`valtooltip-${id}`, (e) =>
    getValue(e, imageKey)
  );

  return (
    <div key={id}>
      <h4 style={{ marginLeft: "0px" }}>{imageKey}</h4>
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <img
          alt={id}
          id={id}
          className="predict-val-img"
          src={url}
          onMouseMove={(e) => update(e)}
          onMouseLeave={hide}
        ></img>
        <HoverPopUp />
      </div>
    </div>
  );
}

function ResultDetail({ result, resultId }) {
  const {
    data: productJSON,
    isLoading,
    isError,
    error,
  } = useQuery(["predict-result-product", result.product], async () => {
    const res = await axios.get(result.product);
    return res.data;
  });

  if (isLoading) {
    return <p>正在載入預測...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }

  console.log(productJSON);
  function getProductValue(e, imageKey) {
    let currentW = document.querySelector(".predict-val-img").offsetWidth; //canvas外的container的width
    let currentH = document.querySelector(".predict-val-img").offsetHeight; //canvas外的container的height

    try {
      const data = productJSON[imageKey];
      let JSONw = data[0].length;
      let JSONh = data.length;
      let JSONIndexW = Math.round((e.nativeEvent.offsetX / currentW) * JSONw);
      if (JSONIndexW < 0) JSONIndexW = 0;
      else if (JSONIndexW > JSONw) JSONIndexW = JSONw;

      let JSONIndexH = Math.round((e.nativeEvent.offsetY / currentH) * JSONh);
      if (JSONIndexH < 0) JSONIndexH = 0;
      else if (JSONIndexH > JSONh) JSONIndexH = JSONh;

      const result = data[JSONIndexH][JSONIndexW];

      return result === 0 ? `NaN` : `${Math.round(result * 100) / 100}`;
    } catch (err) {
      console.log(err);
      return "Something bad happened";
    }
  }

  const imageList = Object.entries(result)
    .filter(([key, value]) => {
      return key !== "image" && key !== "product" && value;
    })
    .map(([key, value]) => {
      return (
        <ResultImage
          resultId={resultId}
          imageKey={key}
          url={value}
          getValue={getProductValue}
        />
      );
    });

  return (
    <div key={resultId}>
      <h4 style={{ marginLeft: "0px" }}>{result.image}</h4>
      {imageList}
    </div>
  );
}

export default ResultDetail;
