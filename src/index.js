import React from 'react';
import ReactDOM from 'react-dom/client';
import "@fontsource/lato/700.css";        // headings
import "@fontsource/noto-sans/400.css";  // body text
import "@fontsource/noto-sans/700.css";  // bold body (if needed)
import './index.css';
import App from './App';
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);