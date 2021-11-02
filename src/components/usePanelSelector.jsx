import React, { useState } from "react";
import { useQuery } from "react-query";
import { getPanelList } from "../api/panel";

function usePanelSelector() {
  const [panelId, setPanelId] = useState(0);
  const {
    data: panels,
    isLoading,
    isError,
    error,
  } = useQuery("panel-list", getPanelList);
  function PanelSelector() {
    if (isLoading) {
      return <p>正在載入校正圖片列表...</p>;
    }
    if (isError) {
      console.log(error);
      return <p>發生錯誤</p>;
    }
    const options = panels.map((panel) => (
      <option key={panel.id} value={panel.id}>
        {panel.id}
      </option>
    ));
    return (
      <div>
        <label>選擇校正圖片：</label>
        <select
          value={panelId}
          onChange={(e) => setPanelId(Number(e.target.value))}
        >
          <option value={0}>--</option>
          {options}
        </select>
      </div>
    );
  }
  return {
    panelId,
    PanelSelector,
  };
}

export default usePanelSelector;
