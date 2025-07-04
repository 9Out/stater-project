import RegisterView from './register-view';
import StoryModel from '../../models/story-model'; // Perubahan path import

class RegisterPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new RegisterView({ mainContent });
  }

  async init() {
    this._view.render();
    this._view.bindSubmit(this._onSubmit.bind(this));
  }

  async _onSubmit() {
    const registerData = this._view.getRegisterData();
    try {
      const response = await this._model.register(registerData);
      if (response.success) {
        this._view.displaySuccess('Registrasi berhasil! Silakan login.', '#/login');
      } else {
        this._view.displayError(`Registrasi gagal: ${response.message}`);
      }
    } catch (error) {
      this._view.displayError(`Terjadi kesalahan saat registrasi: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default RegisterPresenter;