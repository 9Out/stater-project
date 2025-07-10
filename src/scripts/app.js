import routes from '../scripts/routes/routes';
import StoryModel from '../scripts/models/story-model';
import { startViewTransitionIfSupported } from '../scripts/utils/view-transition';
import { getActiveRoute, parseActivePathname } from '../scripts/routes/url-parser';
import NotificationHelper from '../scripts/utils/notification-helper';
import PushNotificationManager from '../scripts/utils/push-notification-manager'; // Import
import NotFoundPage from '../scripts/pages/not-found-page';

class App {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
    this._storyModel = new StoryModel();
    this._logoutButton = document.querySelector('#logoutButton');
    this._loginNavLink = document.querySelector('#loginNavLink');
    this._registerNavLink = document.querySelector('#registerNavLink');
    this._currentPresenter = null;

    this._setupLogoutButton();
  }

  _setupLogoutButton() {
    this._logoutButton.addEventListener('click', async () => {
      await this._storyModel.logout();
      alert('Anda telah logout.');
      window.location.hash = '#/login';
      window.location.reload(); // Reload setelah logout
    });
    this._updateAuthNavUI();
  }

  _updateAuthNavUI() {
    if (this._storyModel.isAuthenticated()) {
      this._logoutButton.style.display = 'block';
      if (this._loginNavLink) this._loginNavLink.style.display = 'none';
      if (this._registerNavLink) this._registerNavLink.style.display = 'none';
    } else {
      this._logoutButton.style.display = 'none';
      if (this._loginNavLink) this._loginNavLink.style.display = 'block';
      if (this._registerNavLink) this._registerNavLink.style.display = 'block';
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const presenterClass = routes[url] || NotFoundPage;
    const urlSegments = parseActivePathname();

    if (this._currentPresenter && typeof this._currentPresenter.destroy === 'function') {
        this._currentPresenter.destroy();
    }

    this._updateAuthNavUI();

    if (presenterClass) {
        startViewTransitionIfSupported(async () => {
          this._mainContent.innerHTML = '';

          const component = new presenterClass({
            model: this._storyModel,
            mainContent: this._mainContent,
          });

          this._currentPresenter = component;
          if (typeof component.init === 'function') {
            await component.init();
          } else if (typeof component.render === 'function') {
            this._mainContent.innerHTML = await component.render();
            if (typeof component.afterRender === 'function') {
              await component.afterRender();
             }
          }
        });
    }
  }

  async initialize() {
    window.addEventListener('hashchange', () => this.renderPage());
    window.addEventListener('load', async () => { // Jadikan async
      await this.renderPage();

      // Minta izin notifikasi
      await NotificationHelper._requestPermission();
      
      // Jika pengguna sudah login, coba subscribe push notif
      if (this._storyModel.isAuthenticated()) {
        await PushNotificationManager.subscribePush();
      }
    });
  }
}

export default App;