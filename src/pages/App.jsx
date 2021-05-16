import React from 'react';
import NewModule from './NewModule';
import NewPredict from './NewPredict';
import AllModuleAndPredict from './AllModuleAndPredict';
import {HashRouter,Route,Switch} from "react-router-dom";

function App() {
    return <HashRouter>
        <Switch>
            <Route exact path="/" component={AllModuleAndPredict} />
            <Route exact path="/newPredict" component={NewPredict} />
            <Route exact path="/newModule" component={NewModule} />
        </Switch>
    </HashRouter>
}

export default App;