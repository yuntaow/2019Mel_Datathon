import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Team from './team';
import Intro  from './Intro';
import * as serviceWorker from './serviceWorker';
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Provider } from 'react-redux'
import store from "./redux/store";

  export default function Root() {
    return (
      <Router>
          <Switch>
            <Route path="/about">
              <h1> Hello </h1>/
            </Route>
            <Route path="/intro">
                <Intro />
            </Route>
            <Route path="/dashboard">
              <Provider store={store}>
                <App />
              </Provider>
            </Route>
            <Route path="/team">
                <Team />
            </Route>
            <Redirect from="/" to="dashboard" />
          </Switch>
      </Router>
    );
}


ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
