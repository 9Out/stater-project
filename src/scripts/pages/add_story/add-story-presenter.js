import AddStoryView from './add-story-view';
import StoryModel from '../../models/story-model'; // Perubahan path import

class AddStoryPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new AddStoryView({ mainContent });
  }

  async init() {
    if (!this._model.isAuthenticated()) {
      alert('Anda harus login untuk menambah cerita!');
      window.location.hash = '#/login';
      return;
    }
    this._view.render();
    this._view.bindSubmit(this._onSubmit.bind(this));
  }

  async _onSubmit() {
    const storyData = this._view.getStoryData();

    if (!storyData.description || !storyData.photo) {
      alert('Deskripsi dan gambar harus diisi.');
      return;
    }

    try {
      const response = await this._model.addStory(storyData);
      if (response.success) {
        alert('Cerita berhasil ditambahkan!');
        this._view.destroy();
        window.location.hash = '#/';
      } else {
        alert(`Gagal menambah cerita: ${response.message}`);
      }
    } catch (error) {
      alert(`Terjadi kesalahan saat menambah cerita: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default AddStoryPresenter;