// CSS imports
import '../styles/styles.css';

import App from '../scripts/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    mainContent: document.querySelector('#mainContent'),
  });
  app.initialize();
});
