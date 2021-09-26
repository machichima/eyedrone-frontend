import React from 'react';
import NewModule from './NewModule';
import NewPredict from './NewPredict';
import AllModuleAndPredict from './AllModuleAndPredict';
import {BrowserRouter, HashRouter,Route,Switch} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()

function App() {
    return <QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={AllModuleAndPredict} />
            <Route path="/newPredict" component={NewPredict} />
            <Route path="/newModule" component={NewModule} />
        </Switch>
    </BrowserRouter>
    </QueryClientProvider>
}

export default App;