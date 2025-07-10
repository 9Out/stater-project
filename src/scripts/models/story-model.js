import StoryApi from '../data/story-api';
import User from '../data/user';
import FavoriteStoryIdb from '../utils/indexeddb-helper';

class StoryModel {
  constructor() {
    this._stories = [];
    this._userToken = localStorage.getItem('userToken') || null;
  }

  isAuthenticated() {
    return !!this._userToken;
  }

  get token() {
    return this._userToken;
  }

  setToken(token) {
    this._userToken = token;
    localStorage.setItem('userToken', token);
  }

  clearToken() {
    this._userToken = null;
    localStorage.removeItem('userToken');
  }

  async register(data) {
    try {
      await StoryApi.register(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async login(data) {
    try {
      const token = await StoryApi.login(data);
      this.setToken(token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async logout() {
    this.clearToken();
  }

  async fetchAllStories() {
    try {
        const storiesFromApi = await StoryApi.getAllStories(this._userToken);
        // Hapus data lama dan simpan data baru
        await FavoriteStoryIdb.clearStories();
        storiesFromApi.forEach(story => {
            FavoriteStoryIdb.putStory(story);
        });
        this._stories = storiesFromApi;
        return { success: true, data: this._stories };
    } catch (error) {
        // Jika network gagal, coba ambil dari IndexedDB
        console.log('Gagal fetch dari API, mencoba dari IndexedDB...', error);
        try {
            const storiesFromDb = await FavoriteStoryIdb.getAllStories();
            if (storiesFromDb && storiesFromDb.length > 0) {
                this._stories = storiesFromDb;
                return { success: true, data: this._stories, fromCache: true };
            }
            return { success: false, message: 'Gagal memuat cerita dari network maupun cache.' };
        } catch (dbError) {
            return { success: false, message: `Gagal memuat cerita: ${dbError.message}` };
        }
    }
  }

  async addStory(data) {
    try {
      await StoryApi.addStory(data, this._userToken);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  async getDetailStory(id) {
    const token = this.getToken(); // Mengambil token
    if (!token) {
      throw new Error('User not authenticated.'); // Pastikan pengguna terautentikasi
    }
    try {
      const response = await StoryApi.getDetailStory(id, token); // Meneruskan token
      return response.data.story;
    } catch (error) {
      console.error(`Failed to get detail for story ID ${id}:`, error);
      throw error;
    }
  }
}

export default StoryModel;