const User = {
  _token: null, // Bisa jadi ini hanya cache, sumber utama dari localStorage

  getToken() {
    if (this._token) {
      return this._token;
    }
    // Coba ambil dari localStorage jika belum ada di memori
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      this._token = storedToken;
    }
    return this._token;
  },

  setToken(token) {
    this._token = token;
    localStorage.setItem('userToken', token); // Simpan ke localStorage
  },

  clearToken() {
    this._token = null;
    localStorage.removeItem('userToken'); // Hapus dari localStorage
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default User;