// src/scripts/pages/home/app.js
import StoryListView from '../pages/home/story-list-view.js'; 
import StoryModel from '../models/story-model.js'; // Perubahan path import


class StoryListPresenter {
  constructor({ model, mainContent }) {
    this._model = model;
    this._view = new StoryListView({ mainContent });
  }

  async init() {
    if (!this._model.isAuthenticated()) {
      alert('Anda harus login untuk melihat cerita!');
      window.location.hash = '#/login';
      return;
    }

    const response = await this._model.fetchAllStories();
    if (response.success) {
      this._view.render(response.data);
      await this._view.afterRender();
    } else {
      this._view.render([]);
      alert(`Gagal memuat cerita: ${response.message}`);
    }
  }

  destroy() {
    this._view.destroy();
  }
}
export default StoryListPresenter;