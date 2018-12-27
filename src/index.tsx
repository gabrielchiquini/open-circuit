import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


const startApp = () => {
  ReactDOM.render( <App />
    , document.getElementById('root'));
}

if(!(window as any).cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
