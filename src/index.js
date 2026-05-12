import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Force unregister ALL service workers and clear ALL caches
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister()
      console.log('SW unregistered')
    })
  })
}
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name)
      console.log('Cache cleared:', name)
    })
  })
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();