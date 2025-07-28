import React from 'react';
import ReactDOM from 'react-dom/client';
import { ComparisonApp } from './ComparisonApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ComparisonApp />
  </React.StrictMode>
);
