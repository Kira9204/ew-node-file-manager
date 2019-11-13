import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>
  , document.getElementById('root'));
