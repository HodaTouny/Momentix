import axios from 'axios';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

let currentLanguage = localStorage.getItem('language') || 'en';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': currentLanguage,
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

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const token = getCookie('refresh_token');  

      if (!token) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await apiClient.post('/api/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed or expired. Logging out user.');
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 429 && !originalRequest._retry429) {
      originalRequest._retry429 = true;
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;
      console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
