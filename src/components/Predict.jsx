import React, { useEffect, useState } from "react";

import useHoverPopUp from "./useHoverPopUp";

function PredictImage({ predictId, imageKey, url, getValue }) {
  const id = `${predictId}-${imageKey}`;
  const { HoverPopUp, update, hide } = useHoverPopUp(
    `valtooltip-${id}`,
    getValue
  );

  return (
    <div key={id}>
      <h4 style={{ marginLeft: "0px" }}>{imageKey}</h4>
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <img
          alt={id}
          id={id}
          className="predict-val-img"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
          src={url}
          onMouseMove={(e) => update(e, imageKey)}
          onMouseLeave={hide}
        ></img>
        <HoverPopUp />
      </div>
    </div>
  );
}

function Predict(predictData, predictId) {
  const [productJSON, chProductJSON] = useState(null);

  useEffect(() => {
    const url = predictData.product;
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    chProductJSON(JSON.parse(Httpreq.response));
  }, []);

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

  const imageList = Object.entries(predictData)
    .filter(([key, value]) => {
      return key !== "image" && key !== "product" && value;
    })
    .map(([key, value]) => {
      console.log("Map: ", key, value);
      return (
        <PredictImage
          predictId={predictId}
          imageKey={key}
          url={value}
          getValue={getProductValue}
        />
      );
    });

  return (
    <div key={predictId}>
      <h4 style={{ marginLeft: "0px" }}>{predictData.image}</h4>
      {imageList}
    </div>
  );
}

export default Predict;
