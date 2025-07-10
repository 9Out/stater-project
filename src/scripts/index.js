// src/scripts/index.js
import '../styles/styles.css';
import App from '../scripts/app.js';
import PushNotificationManager from './utils/push-notification-manager';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    mainContent: document.querySelector('#mainContent'),
  });
  app.initialize();

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#mainContent');
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    mainContent.focus();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered: ', registration);
          // Langsung coba subscribe jika sudah login
          if (localStorage.getItem('userToken')) {
            PushNotificationManager.subscribePush();
          }
        })
        .catch(registrationError => {
          console.log('Service Worker registration failed: ', registrationError);
        });
      
      // Event listener untuk reload otomatis saat service worker baru aktif
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    });
  }
});