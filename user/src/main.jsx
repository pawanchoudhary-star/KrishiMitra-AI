import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import './index.css'
import './App.css'

// Global fetch interceptor to support dynamic backend URLs in production
const originalFetch = window.fetch;
window.fetch = async function (resource, options) {
  let url = resource;
  if (typeof resource === 'string' && resource.startsWith('http://localhost:5000')) {
    const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
    if (backendUrl && !backendUrl.includes('localhost:5173')) {
      url = resource.replace('http://localhost:5000', backendUrl);
    }
  }
  return originalFetch(url, options);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
