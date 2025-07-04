import AddStoryView from './add-story-view';
import StoryModel from '../../models/story-model'; // Perubahan path import

class AddStoryPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new AddStoryView({ mainContent });
  }

  async init() {
    if (!this._model.isAuthenticated()) {
      this._view.showAuthenticationError(); // Panggil method di View
      return;
    }
    this._view.render();
    this._view.bindSubmit(this._onSubmit.bind(this));
  }

  async _onSubmit() {
    const storyData = this._view.getStoryData();

    if (!storyData.description || !storyData.photo) {
      this._view.showValidationError('Deskripsi dan gambar harus diisi.'); // Panggil method di View
      return;
    }

    try {
      const response = await this._model.addStory(storyData);
      if (response.success) {
        this._view.showSuccessMessage('Cerita berhasil ditambahkan!', '#/'); // Panggil method di View
      } else {
        this._view.showErrorMessage(`Gagal menambah cerita: ${response.message}`);
      }
    } catch (error) {
      this._view.showErrorMessage(`Terjadi kesalahan saat menambah cerita: ${error.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}

export default AddStoryPresenter;