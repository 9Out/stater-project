import createRegisterTemplate from './templates/register-template';

class RegisterView {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
  }

  render() {
    this._mainContent.innerHTML = createRegisterTemplate();
    this._nameInput = this._mainContent.querySelector('#registerName');
    this._emailInput = this._mainContent.querySelector('#registerEmail');
    this._passwordInput = this._mainContent.querySelector('#registerPassword');
  }

  getRegisterData() {
    return {
      name: this._nameInput.value,
      email: this._emailInput.value,
      password: this._passwordInput.value,
    };
  }

  bindSubmit(handler) {
    this._mainContent.querySelector('#registerForm').addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  destroy() {
    // No specific cleanup needed for RegisterView
  }
}

export default RegisterView;