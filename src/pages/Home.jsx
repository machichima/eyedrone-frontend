import React from "react";
import ModelList from "../components/ModelList";
import PredictList from "../components/PredictList";

function Home() {
  return (
    <div>
      <div>
        <ModelList />
        <hr />
        <PredictList />
      </div>
    </div>
  );
}

export default Home;
