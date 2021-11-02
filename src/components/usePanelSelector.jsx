import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getPanelList } from "../api/panel";
import { uploadPanelOrImage } from "../api/image";

function usePanelSelector() {
  const [panelId, setPanelId] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const {
    data: panels,
    isLoading,
    isError,
    error,
  } = useQuery(["panel-list", uploaded], getPanelList);

  const mutation = useMutation(
    async (files) => {
      return await uploadPanelOrImage("/api/panels/", files);
    },
    {
      onSuccess: (panel) => {
        console.log(panel);
        setPanelId(panel.id);
        setUploaded(true);
      },
    }
  );

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
          disabled={panelId}
        />
        {mutation.isLoading ? "上傳中" : null}
        {mutation.isError ? "錯誤" : null}
        {mutation.isSuccess ? "成功上傳" : null}
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
