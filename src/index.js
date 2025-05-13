import React from 'react';
import ReactDOM from 'react-dom/client';
import { SigmaPluginProvider } from '@sigmacomputing/plugin';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SigmaPluginProvider>
      <App />
    </SigmaPluginProvider>
  </React.StrictMode>
); 