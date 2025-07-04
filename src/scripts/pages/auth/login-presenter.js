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
        this._view.displaySuccess('Login berhasil!', '/');
      } else {
        this._view.displayError(`Login gagal: ${response.message}`);
      }
    } catch (error) {
      this._view.displayError(`Terjadi kesalahan saat login: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default LoginPresenter;