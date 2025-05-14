import apiClient from './apiService';

const bookingsService = {
  bookEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/bookings/${eventId}`);
    return data;
  },

  getAllBookings: async () => {
    const { data } = await apiClient.get('/api/bookings');
    return data.bookings;
  },
};

export default bookingsService;
