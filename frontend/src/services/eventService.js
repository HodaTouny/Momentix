import apiClient from './apiService';
import i18n from '../i18n';
const eventsService = {
   getAllEvents: async (
    page = 1,
    pageSize = 10,
    orderBy = ['date_DESC'],
    category,
    status
  ) => {
    const currentLang = i18n.language || 'en';

    const params = {
      page,
      pageSize,
      orderBy: JSON.stringify(orderBy),
    };

    if (category && category !== 'all') {
      if (currentLang === 'ar') {
        params.category_ar = category;
      } else {
        params.category_en = category;
      }
    }
    if (status && status !== 'all') {
      params.status = status;
    }

    const { data } = await apiClient.get('/api/events', { params });
    return data.events;
  },

  getEventById: async (id) => {
    const { data } = await apiClient.get(`/api/events/${id}`);
    return data.event;
  },

  createEvent: async (formData) => {
    const { data } = await apiClient.post('/api/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, 
    });
    return data.event;
  },

  updateEvent: async (id, formData) => {
    const { data } = await apiClient.put(`/api/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }, 
    });
    return data;
  },

  deleteEvent: async (id) => {
    const { data } = await apiClient.delete(`/api/events/${id}`);
    return data.message;
  },
};

export default eventsService;
