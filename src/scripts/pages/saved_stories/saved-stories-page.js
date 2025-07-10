import FavoriteStoryIdb from '../../utils/indexeddb-helper';

const createSavedStoryItemTemplate = (story) => `
  <article class="story-item">
      <div class="story-header">
          <img class="story-image" src="${story.photoUrl}" alt="Gambar dari cerita ${story.name}">
      </div>
      <div class="story-content">
          <h3 class="story-name">${story.name}</h3>
          <p class="story-description">${story.description.substring(0, 150)}...</p>
          <button class="btn-delete" data-id="${story.id}" aria-label="Hapus cerita ${story.name} dari daftar simpan">Hapus</button>
      </div>
  </article>
`;

class SavedStoriesPage {
  async render() {
    return `
      <section class="container">
        <h1>Cerita Tersimpan</h1>
        <div id="saved-stories-list" class="story-list-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this._mainContainer = document.querySelector('#saved-stories-list');
    await this._renderStoryList();
  }

  async _renderStoryList() {
    const stories = await FavoriteStoryIdb.getAllStories();
    this._mainContainer.innerHTML = '';

    if (stories.length > 0) {
      stories.forEach(story => {
        this._mainContainer.innerHTML += createSavedStoryItemTemplate(story);
      });
    } else {
      this._mainContainer.innerHTML = '<p class="empty-message">Anda belum menyimpan cerita apapun.</p>';
    }

    this._attachDeleteButtonListeners();
  }

  _attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const storyId = event.target.dataset.id;
        await FavoriteStoryIdb.deleteStory(storyId);
        alert('Cerita berhasil dihapus.');

        // Render ulang hanya daftar cerita setelah dihapus
        await this._renderStoryList();
      });
    });
  }
}

export default SavedStoriesPage;