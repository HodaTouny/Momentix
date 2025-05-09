
const eventController = require('../../src/controllers/eventController');
const eventService = require('../../src/services/eventService');
const UploadService = require('../../src/services/uploadService');
const i18n = require('../../src/config/i18n'); 

jest.mock('../../src/services/eventService');
jest.mock('../../src/services/uploadService');

describe('EventController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    test('should return events (English)', async () => {
      const req = { query: {}, headers: { 'accept-language': 'en' } };
      const res = mockRes();
      const data = [{ id: 1 }];
      eventService.getEvents.mockResolvedValue(data);

      await eventController.getEvents(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ events: data });
    });

    test('should handle getEvents error', async () => {
      const req = { query: {}, headers: { 'accept-language': 'ar' } };
      const res = mockRes();
      const error = new Error('Fail');
      eventService.getEvents.mockRejectedValue(error);

      await eventController.getEvents(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createEvent', () => {
    test('should create event', async () => {
      const req = {
        body: { title_en: 'Test Event', title_ar: 'حدث اختبار' },
        file: { buffer: Buffer.from('fake image') },
        headers: { 'accept-language': 'ar' }
      };
      const res = mockRes();
      const created = { id: 1, title_en: 'Test Event', title_ar: 'حدث اختبار' };

      eventService.createEvent.mockResolvedValue(created);

      await eventController.createEvent(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('ar');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event created successfully',
        event: created
      });
    });

    test('should return 400 if image is missing', async () => {
      const req = {
        body: { title_en: 'No Image Event' },
        headers: { 'accept-language': 'ar' }
      };
      const res = mockRes();

      await eventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Image is required' });
    });

    test('should handle service-level error on event creation', async () => {
      const req = {
        body: { title_en: 'Test Event' },
        file: { buffer: Buffer.from('fake image') },
        headers: { 'accept-language': 'ar' }
      };
      const res = mockRes();
      const error = new Error('Service failed');

      eventService.createEvent.mockRejectedValue(error);

      await eventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Service failed' });
    });
  });

  describe('updateEvent', () => {
    test('should update event', async () => {
      const req = {
        params: { id: '1' },
        body: { title_en: 'Updated Event' },
        headers: { 'accept-language': 'en' }
      };
      const res = mockRes();
      const updated = { id: 1, title_en: 'Updated Event' };

      eventService.updateEvent.mockResolvedValue(updated);

      await eventController.updateEvent(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event updated successfully',
        event: updated
      });
    });

    test('should handle update error', async () => {
      const req = { params: { id: '1' }, body: {}, headers: {} };
      const res = mockRes();
      const error = new Error('Update failed');

      eventService.updateEvent.mockRejectedValue(error);

      await eventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteEvent', () => {
    test('should delete event', async () => {
      const req = { params: { id: '1' }, headers: { 'accept-language': 'ar' } };
      const res = mockRes();
      const deleted = { id: 1 };

      eventService.deleteEvent.mockResolvedValue(deleted);

      await eventController.deleteEvent(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('ar');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event deleted successfully',
        event: deleted
      });
    });

    test('should handle delete error', async () => {
      const req = { params: { id: '999' }, headers: {} };
      const res = mockRes();
      const error = new Error('Delete failed');

      eventService.deleteEvent.mockRejectedValue(error);

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getEvent', () => {
    test('should return single event', async () => {
      const req = { params: { id: '1' }, headers: { 'accept-language': 'en' } };
      const res = mockRes();
      const found = { id: 1 };

      eventService.getEvent.mockResolvedValue(found);

      await eventController.getEvent(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ event: found });
    });

    test('should handle getEvent error', async () => {
      const req = { params: { id: '999' }, headers: {} };
      const res = mockRes();
      const error = new Error('Not found');

      eventService.getEvent.mockRejectedValue(error);

      await eventController.getEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
