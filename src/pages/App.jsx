import React from "react";
import NewModule from "./NewModule";
import NewPredict from "./NewPredict";
import Home from "./Home";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import NavigatorBar from "../components/NavigatorBar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigatorBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/predicts/new" component={NewPredict} />
          <Route path="/models/new" component={NewModule} />
        </Switch>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
