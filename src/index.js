import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './components/1unused/reportWebVitals';
import firebase from "firebase/app";
import "firebase/analytics";

firebase.initializeApp({
  apiKey: "AIzaSyDrjcf8G_KlYoNqmms7pwPZmGYGIk0uUds",
  authDomain: "nfl-table.firebaseapp.com",
  projectId: "nfl-table",
  storageBucket: "nfl-table.appspot.com",
  messagingSenderId: "290686633807",
  appId: "1:290686633807:web:6a9f51ae91451dac2ea73a",
  measurementId: "G-7HEN34YMG0"
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
