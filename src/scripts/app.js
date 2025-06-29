import routes from '../scripts/routes/routes';
import StoryModel from '../scripts/models/story-model';
import { startViewTransitionIfSupported } from '../scripts/utils/view-transition';
import { getActiveRoute, parseActivePathname } from '../scripts/routes/url-parser';

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
      this._updateAuthNavUI();
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
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const presenterClass = routes[url] || routes['/'];
    const urlSegments = parseActivePathname();

    if (this._currentPresenter && typeof this._currentPresenter.destroy === 'function') {
        this._currentPresenter.destroy();
    }

    this._updateAuthNavUI();

    if (presenterClass) {
      startViewTransitionIfSupported(async () => {
        this._mainContent.innerHTML = '';
        const presenter = new presenterClass({
          model: this._storyModel,
          mainContent: this._mainContent,
        });
        this._currentPresenter = presenter;
        await presenter.init();
      });
    } else {
      startViewTransitionIfSupported(async () => {
        this._mainContent.innerHTML = '<h2>404 Not Found</h2><p>Halaman yang Anda minta tidak ditemukan.</p>';
      });
      this._currentPresenter = null;
    }
  }

  async initialize() {
    window.addEventListener('hashchange', () => this.renderPage());
    window.addEventListener('load', () => this.renderPage());

    await this.renderPage();
  }
}

export default App;