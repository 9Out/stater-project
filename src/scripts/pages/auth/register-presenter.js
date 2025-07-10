import RegisterView from './register-view';

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
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
        window.location.reload();
      } else {
        alert(`Registrasi gagal: ${response.message}`);
      }
    } catch (error) {
      alert(`Terjadi kesalahan saat registrasi: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default RegisterPresenter;