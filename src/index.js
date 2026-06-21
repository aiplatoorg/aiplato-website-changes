import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css'
// import dotenv from 'dotenv';

// if (process.env.NODE_ENV === 'development') {
//   dotenv.config({ path: '.env' });
// } else if (process.env.NODE_ENV === 'staging') {
//   dotenv.config({ path: '.env.staging' });
// } else {
//   dotenv.config({ path: '.env.production' });
// }

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
