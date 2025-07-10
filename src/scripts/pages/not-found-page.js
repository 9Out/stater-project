class NotFoundPage {
  async render() {
    return `
      <section class="container">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada.</p>
      </section>
    `;
  }

  async afterRender() {
    // Tidak ada aksi setelah render
  }
}

export default NotFoundPage;