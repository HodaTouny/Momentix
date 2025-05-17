import apiClient from './apiService';

const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/api/auth/login', credentials);
    return data.user; 
  },

  register: async (userData) => {
    await apiClient.post('/api/auth/register', userData);
  },

  logout: async () => {
    await apiClient.get('/api/auth/logout');
  },
  getCurrentUser: async () => {
    const { data } = await apiClient.get('/api/auth/me');
    return data.user;
  }
};

export default authService;
