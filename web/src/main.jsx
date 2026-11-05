/* main.jsx - punctul de pornire: afiseaza <App /> in elementul #root (M v2.0.0) */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // inaintea componentelor, ca stilurile lor sa aiba prioritate
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
