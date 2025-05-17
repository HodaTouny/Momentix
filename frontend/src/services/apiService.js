import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': localStorage.getItem('language') || 'en',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('language') || 'en';
    config.headers['Accept-Language'] = lang;

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post('/api/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed or expired. Logging out user.');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 429 && !originalRequest._retry429) {
      originalRequest._retry429 = true;
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);


export default apiClient;
