import { parseActivePathname } from '../../routes/url-parser';
import DetailStoryView from './detail-story-view';
import Swal from 'sweetalert2'; // Asumsi Anda menggunakan SweetAlert2 untuk notifikasi

class DetailStoryPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new DetailStoryView({ mainContent });
  }

  async init() {
    await this._getStoryDetail();
  }

  async _getStoryDetail() {
    const url = UrlParser.parseActiveUrlWithoutCombiner(); // Gunakan ini untuk mendapatkan segmen URL
    const storyId = url[1]; // Mengambil ID dari segmen URL, misal '/stories/123' -> '123'

    if (!storyId) {
      console.error('Story ID not found in URL.');
      Swal.fire('Error', 'ID cerita tidak ditemukan.', 'error');
      // Render halaman error atau redirect
      return;
    }

    try {
      Swal.fire({
        title: 'Memuat Cerita...',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      const story = await this._model.getDetailStory(storyId);

      Swal.close();

      if (story) {
        this._view.render(story);
      } else {
        Swal.fire('Error', 'Detail cerita tidak ditemukan.', 'error');
        this._view.render({ // Render template dengan data kosong atau pesan tidak ditemukan
            name: 'Cerita Tidak Ditemukan',
            description: 'Maaf, cerita yang Anda cari tidak ada.',
            photoUrl: 'https://via.placeholder.com/400x250?text=No+Image',
            createdAt: new Date().toISOString(),
            lat: null,
            lon: null
        });
      }
    } catch (error) {
      console.error('Error fetching story detail:', error);
      Swal.fire('Error', 'Gagal memuat detail cerita: ' + error.message, 'error');
      this._view.render({ // Render template dengan data kosong atau pesan error
            name: 'Error Memuat Cerita',
            description: 'Terjadi kesalahan saat memuat cerita.',
            photoUrl: 'https://via.placeholder.com/400x250?text=Error',
            createdAt: new Date().toISOString(),
            lat: null,
            lon: null
        });
    }
  }

  destroy() {
    this._view.destroy(); // Pastikan view juga dihancurkan
  }
}

export default DetailStoryPresenter;