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
    const { id } = parseActivePathname();
    if (!id) {
        this._view.showError('ID cerita tidak ditemukan.');
        return;
    }

    this._view.showLoading();
    try {
        const story = await this._model.getDetailStory(id);
        this._view.hideLoading();
        if (story) {
            this._view.render(story);
        } else {
            this._view.showError('Detail cerita tidak ditemukan.');
        }
    } catch (error) {
        this._view.hideLoading();
        this._view.showError(`Gagal memuat detail cerita: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy(); // Pastikan view juga dihancurkan
  }
}

export default DetailStoryPresenter;