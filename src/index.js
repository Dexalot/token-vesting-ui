import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
registerServiceWorker()