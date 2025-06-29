import LoginView from './login-view';
import StoryModel from '../../models/story-model'; // Perubahan path import

class LoginPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new LoginView({ mainContent });
  }

  async init() {
    this._view.render();
    this._view.bindSubmit(this._onSubmit.bind(this));
  }

  async _onSubmit() {
    const loginData = this._view.getLoginData();
    try {
      const response = await this._model.login(loginData);
      if (response.success) {
        alert('Login berhasil!');
        window.location.hash = '#/';
      } else {
        alert(`Login gagal: ${response.message}`);
      }
    } catch (error) {
      alert(`Terjadi kesalahan saat login: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default LoginPresenter;