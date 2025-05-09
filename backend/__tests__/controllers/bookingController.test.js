const bookingController = require('../../src/controllers/bookingController');
const bookingService = require('../../src/services/bookingService');
const i18n = require('../../src/config/i18n');
jest.mock('../../src/services/bookingService');

describe('BookingController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bookEvent()', () => {
    it('should return 201 on successful booking', async () => {
      const req = {
        params: { eventId: '5' },
        user: { id: 1 },
        headers: { 'accept-language': 'en' }
      };
      const res = mockRes();

      const mockBooking = { id: 10, user_id: 1, event_id: 5 };
      bookingService.book.mockResolvedValue(mockBooking);

      await bookingController.bookEvent(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Event booked successfully',
        booking: mockBooking
      });
    });

    it('should return 400 on booking failure', async () => {
      const req = {
        params: { eventId: '5' },
        user: { id: 1 },
        headers: { 'accept-language': 'en' }
      };
      const res = mockRes();

      const error = new Error('You have already booked this event');
      bookingService.book.mockRejectedValue(error);

      await bookingController.bookEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getMyBookings()', () => {
    it('should return bookings for user', async () => {
      const req = {
        user: { id: 1 },
        headers: { 'accept-language': 'en' }
      };
      const res = mockRes();

      const mockBookings = [{ id: 1, event: { title_en: 'Test' } }];
      bookingService.getByUser.mockResolvedValue(mockBookings);

      await bookingController.getMyBookings(req, res);

      expect(i18n.setLocale).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ bookings: mockBookings });
    });

    it('should return 400 on service failure', async () => {
      const req = {
        user: { id: 1 },
        headers: { 'accept-language': 'en' }
      };
      const res = mockRes();

      const error = new Error('DB failed');
      bookingService.getByUser.mockRejectedValue(error);

      await bookingController.getMyBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
