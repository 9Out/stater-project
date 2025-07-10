import CONFIG from '../config';
import axios from 'axios';

class StoryApi {
  static async register({ name, email, password }) {
    try {
      console.log('Mencoba registrasi untuk:', { name, email });
      const response = await axios.post(`${CONFIG.BASE_URL}/register`, {
        name,
        email,
        password,
      });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Koneksi ke server gagal.';
      console.error('Error saat registrasi:', error);
      throw new Error(`Registrasi gagal: ${message}`);
    }
  }

  static async login({ email, password }) {
    try {
      console.log('Mencoba login untuk:', email);
      const response = await axios.post(`${CONFIG.BASE_URL}/login`, {
        email,
        password,
      });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      const { loginResult } = response.data;
      if (!loginResult || !loginResult.token) {
        throw new Error('Token tidak ditemukan dari server.');
      }
      return loginResult.token;
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Koneksi ke server gagal.';
      console.error('Error saat login:', error);
      throw new Error(`Login gagal: ${message}`);
    }
  }

  async fetchAllStories() {
    try {
        const storiesFromApi = await StoryApi.getAllStories(this._userToken);
        await FavoriteStoryIdb.clearStories();
        storiesFromApi.forEach(story => {
            FavoriteStoryIdb.putStory(story);
        });
        this._stories = storiesFromApi;
        return { success: true, data: this._stories };
    } catch (error) {
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
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated.');
    }
    try {
      const story = await StoryApi.getDetailStory(id, this.token);
      return story;
    } catch (error) {
      console.error(`Failed to get detail for story ID ${id}:`, error);
      throw error;
    }
  }
}

export default StoryModel;