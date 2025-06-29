import createLoginTemplate from './templates/login-template';

class LoginView {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
  }

  render() {
    this._mainContent.innerHTML = createLoginTemplate();
    this._emailInput = this._mainContent.querySelector('#loginEmail');
    this._passwordInput = this._mainContent.querySelector('#loginPassword');
  }

  getLoginData() {
    return {
      email: this._emailInput.value,
      password: this._passwordInput.value,
    };
  }

  bindSubmit(handler) {
    this._mainContent.querySelector('#loginForm').addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  destroy() {
    // No specific cleanup needed for LoginView
  }
}

export default LoginView;