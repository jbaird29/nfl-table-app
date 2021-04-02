import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './components/1unused/reportWebVitals';
import Firebase from './firebase/firebase'
import FirebaseContext from './firebase/context'


// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
// https://www.freecodecamp.org/news/how-to-build-a-todo-application-using-reactjs-and-firebase/
// https://codesource.io/building-a-serverless-web-app-using-firebase/
ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
