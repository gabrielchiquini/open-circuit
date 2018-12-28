import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SimulatorContainer from './components/Simulator/SimulatorContainer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = createStore((state: any, action) => state);
const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route path="/" exact component={SimulatorContainer} />
      </Router>
    </Provider>
    , document.getElementById('root'));
};

if (!(window as any).cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
