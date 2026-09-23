import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline capabilities and PWA installation
if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates
        registration.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('Native SW registration note:', err);
      });
  } catch {
    // Virtual register fallback
    try {
      registerSW({ immediate: true });
    } catch {}
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
