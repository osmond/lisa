/* global VITE_BASE_PATH */
import { useEffect } from 'react';
import useSnackbar from './useSnackbar.jsx';

export default function useServiceWorker() {
  const context = useSnackbar();
  const showSnackbar = context && context.showSnackbar;

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const base = typeof VITE_BASE_PATH !== 'undefined'
      ? VITE_BASE_PATH
      : (process.env.VITE_BASE_PATH || '/');
    const swPath = `${base.endsWith('/') ? base : base + '/'}sw.js`;

    navigator.serviceWorker.register(swPath).then((reg) => {
      if (reg.waiting) notify(reg.waiting);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notify(newWorker);
            }
          });
        }
      });
    }).catch((err) => {
      console.error('Service worker registration failed:', err);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    function notify(sw) {
      if (showSnackbar) {
        showSnackbar('New version available—click to update', () => {
          sw.postMessage({ type: 'SKIP_WAITING' });
        });
      } else if (confirm('New version available. Reload?')) {
        sw.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  }, [showSnackbar]);
}
