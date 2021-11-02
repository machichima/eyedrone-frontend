import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getPanelList } from "../api/panel";

function usePanelSelector() {
  const [panelId, setPanelId] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const {
    data: panels,
    isLoading,
    isError,
    error,
  } = useQuery("panel-list", getPanelList);

  const mutation = useMutation((files) => {
    console.log("selected files");
    if (files.length !== 5) {
      alert("請上傳 5 張圖片");
      return;
    }
    const name = files[0].name.split("_")[1];
    console.log(name);
    const fileNames = [];
    for (let i = 0; i < 5; i++) {
      fileNames.push(window.URL.createObjectURL(files.item(i)));
    }
    console.log(fileNames);
    const payload = new FormData();
    payload.append("blue", fileNames[0]);
    payload.append("green", fileNames[1]);
    payload.append("red", fileNames[2]);
    payload.append("nir", fileNames[3]);
    payload.append("red_edge", fileNames[4]);
  });

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
        {panel.name}
      </option>
    ));

    return (
      <div>
        <label>選擇校正圖片：</label>
        <select
          value={panelId}
          onChange={(e) => setPanelId(Number(e.target.value))}
          disabled={confirm}
        >
          <option value={0}>--</option>
          {options}
        </select>
        <br />
        <label>上傳新校正圖片：</label>
        <input
          id="upload-img"
          type="file"
          onChange={(e) => {
            mutation.mutate(e.target.files);
          }}
          multiple
        />
        <button disabled={!panelId || confirm} onClick={() => setConfirm(true)}>
          確定
        </button>
      </div>
    );
  }
  return {
    panelId,
    PanelSelector,
  };
}

export default usePanelSelector;
