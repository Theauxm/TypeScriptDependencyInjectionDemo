import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Required import for all services to be registered correctly
import "./di/services";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
