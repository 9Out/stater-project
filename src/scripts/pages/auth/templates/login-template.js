const createLoginTemplate = () => `
  <h1 tabindex="0">Login</h1>
  <form id="loginForm">
    <div class="form-group">
      <label for="loginEmail">Email:</label>
      <input type="email" id="loginEmail" name="email" required aria-label="Alamat email Anda">
    </div>
    <div class="form-group">
      <label for="loginPassword">Password:</label>
      <input type="password" id="loginPassword" name="password" required aria-label="Kata sandi Anda">
    </div>
    <button type="submit" aria-label="Masuk">Login</button>
  </form>
  <p>Belum punya akun? <a href="#/register" aria-label="Daftar sekarang">Registrasi disini</a></p>
`;
export default createLoginTemplate;