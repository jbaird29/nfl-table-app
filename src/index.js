import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { ConfigProvider } from 'antd'
import reportWebVitals from './components/1unused/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
      <ConfigProvider
          // componentSize="small"
      >
        <App />
      </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
