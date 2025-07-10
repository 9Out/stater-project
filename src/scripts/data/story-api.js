import CONFIG from '../config';
import axios from 'axios';

class StoryApi {
  static async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseJson = await response.json();
      
      // Debug log untuk melihat response
      console.log('Register response:', responseJson);
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      
      return responseJson;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(`Register gagal: ${error.message}`);
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseJson = await response.json();
      
      // Debug log untuk melihat struktur response
      console.log('Login response:', responseJson);
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }

      // Validasi berbagai kemungkinan struktur response
      let token = null;
      
      if (responseJson.loginResult && responseJson.loginResult.token) {
        // Format: { error: false, message: "success", loginResult: { userId: "...", name: "...", token: "..." } }
        token = responseJson.loginResult.token;
      } else if (responseJson.data && responseJson.data.token) {
        // Format: { error: false, message: "success", data: { token: "..." } }
        token = responseJson.data.token;
      } else if (responseJson.token) {
        // Format: { error: false, message: "success", token: "..." }
        token = responseJson.token;
      }
      
      if (!token) {
        throw new Error('Token tidak ditemukan dalam response server');
      }
      
      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(`Login gagal: ${error.message}`);
    }
  }

  static async getAllStories(token, page = 1, size = 10, location = 0) {
    try {
      const headers = token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      };
      
      const response = await fetch(`${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
        headers,
      });
      
      const responseJson = await response.json();
      
      console.log('Get stories response:', responseJson);
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      
      // Validasi response untuk stories
      if (responseJson.listStory) {
        return responseJson.listStory;
      } else if (responseJson.data && responseJson.data.listStory) {
        return responseJson.data.listStory;
      } else {
        throw new Error('Data stories tidak ditemukan');
      }
    } catch (error) {
      console.error('Get stories error:', error);
      throw new Error(`Gagal mengambil stories: ${error.message}`);
    }
  }

  static async addStory({ description, photo, lat, lon }, token) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      
      if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
        formData.append('lat', lat.toString());
        formData.append('lon', lon.toString());
      }

      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const responseJson = await response.json();
      
      console.log('Add story response:', responseJson);
      
      if (responseJson.error) {
        throw new Error(responseJson.message);
      }
      
      return responseJson;
    } catch (error) {
      console.error('Add story error:', error);
      throw new Error(`Gagal menambah story: ${error.message}`);
    }
  }

  static async getDetailStory(id, token) {
      const response = await axios.get(`${CONFIG.BASE_URL}/stories/${id}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data.story; // Kembalikan objek story langsung
  }

  // Method tambahan untuk debugging
  static async testConnection() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/`);
      const responseJson = await response.json();
      console.log('API Connection test:', responseJson);
      return responseJson;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
}

export default StoryApi;