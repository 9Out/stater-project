const createRegisterTemplate = () => `
  <h2 tabindex="0">Registrasi</h2>
  <form id="registerForm">
    <div class="form-group">
      <label for="registerName">Nama:</label>
      <input type="text" id="registerName" name="name" required aria-label="Nama lengkap Anda">
    </div>
    <div class="form-group">
      <label for="registerEmail">Email:</label>
      <input type="email" id="registerEmail" name="email" required aria-label="Alamat email Anda">
    </div>
    <div class="form-group">
      <label for="registerPassword">Password:</label>
      <input type="password" id="registerPassword" name="password" required aria-label="Buat kata sandi Anda">
    </div>
    <button type="submit" aria-label="Daftar akun">Registrasi</button>
  </form>
  <p>Sudah punya akun? <a href="#/login" aria-label="Masuk ke akun Anda">Login disini</a></p>
`;
export default createRegisterTemplate;