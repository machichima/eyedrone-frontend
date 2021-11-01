import React from "react";
import NewModule from "./NewModule";
import NewPredict from "./NewPredict";
import Home from "./Home";
import ModelDetail from "./ModelDetail";
import PredictDetail from "./PredictDetail";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import NavigatorBar from "../components/NavigatorBar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigatorBar />
        <div className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/predicts/new" component={NewPredict} />
            <Route path="/predicts/:id" component={PredictDetail} />
            <Route path="/models/new" component={NewModule} />
            <Route path="/models/:id-:name" component={ModelDetail} />
          </Switch>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
