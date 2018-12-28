import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SimulatorContainer from './components/Simulator/SimulatorContainer';

const startApp = () => {
  ReactDOM.render(
      <Router>
        <Route path="/" exact component={SimulatorContainer} />
      </Router>
    , document.getElementById('root'));
};

if (!(window as any).cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
