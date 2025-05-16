import apiClient from './apiService';

const dashboardService = {
  getDashboardData: async () => {
    const { data } = await apiClient.get('/api/dashboard');
    return data;
  }
};

export default dashboardService;
