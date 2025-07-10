import CONFIG from '../config';
import axios from 'axios';

class StoryApi {
  static async register({ name, email, password }) {
    try {
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
      const message = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan';
      throw new Error(`Registrasi gagal: ${message}`);
    }
  }

  static async login({ email, password }) {
    try {
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
      const message = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan';
      throw new Error(`Login gagal: ${message}`);
    }
  }

  static async getAllStories(token) {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}/stories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.listStory;
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan';
      throw new Error(`Gagal mengambil cerita: ${message}`);
    }
  }

  static async addStory({ description, photo, lat, lon }, token) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    try {
      const response = await axios.post(`${CONFIG.BASE_URL}/stories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan';
      throw new Error(`Gagal menambah cerita: ${message}`);
    }
  }

  static async getDetailStory(id, token) {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}/stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.story;
    } catch (error) {
      const message = error.response ? error.response.data.message : 'Terjadi kesalahan jaringan';
      throw new Error(`Gagal memuat detail cerita: ${message}`);
    }
  }
}

export default StoryApi;