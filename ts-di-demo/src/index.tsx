import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeServices } from './di/ServiceRegistration';

// Initialize the dependency injection container
initializeServices();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
