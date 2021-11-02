import React from "react";
import { Link } from "react-router-dom";

function NavigatorBar() {
  return (
    <div style={{ width: "100%" }}>
      <nav style={{ width: "100%" }}>
        <Link to="/">EyeDrone</Link>
      </nav>
    </div>
  );
}

export default NavigatorBar;
