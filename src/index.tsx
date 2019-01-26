import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SimulatorContainer from './components/Simulator/SimulatorContainer';

const startApp = () => {
  ReactDOM.render(
      <Router>
        <Route path="/" component={SimulatorContainer} />
      </Router>
    , document.getElementById('root'));
};

if (!(window as any).cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
