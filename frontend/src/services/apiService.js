import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://atc-01060584671.onrender.com';

const getCookies = () => {
  const access = Cookies.get('access_token');
  const refrsh = Cookies.get('refresh_token');
  return { access, refrsh };
};

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

    const { access } = getCookies();
    if (access) {
      config.headers['Authorization'] = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refrsh } = getCookies();
      if (!refrsh) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post('/api/auth/refresh');
        const newAccessToken = refreshResponse?.data?.access_token;

        if (newAccessToken) {
          Cookies.set('access_token', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }

        return Promise.reject(refreshResponse);
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
