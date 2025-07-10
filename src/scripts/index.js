// CSS imports
import '../styles/styles.css';

import App from '../scripts/app.js';

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
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}
});
