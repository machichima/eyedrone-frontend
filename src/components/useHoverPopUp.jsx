import React, { useState } from "react";

function useHoverPopUp(id, getValue) {
  const [value, setValue] = useState(null);
  const [display, setDisplay] = useState(false);
  const [position, setPosition] = useState([0, 0]);

  function update(e, imageKey) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setDisplay(true);
    setPosition([x, y]);

    const value = getValue(e, imageKey);
    setValue(value);
  }

  function hide() {
    setDisplay(false);
  }

  function HoverPopUp() {
    if (display) {
      const left = position[0];
      const top = position[1];
      return (
        <span
          className="valtooltip"
          id={id}
          style={{ left, top, ...toolTipStyle }}
        >
          {value}
        </span>
      );
    } else {
      return null;
    }
  }

  return {
    update,
    hide,
    HoverPopUp,
  };
}

const toolTipStyle = {
  display: "block",
  background: "#C8C8C8",
  marginTop: "20px",
  padding: "10px",
  position: "absolute",
  zIndex: "2000",
};

export default useHoverPopUp;
