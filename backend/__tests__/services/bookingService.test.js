const bookingService = require('../../src/services/bookingService');
const prisma = require('../../src/lib/prisma');
const logger = require('../../src/lib/logger');
const i18n = require('../../src/config/i18n');
const { handlePrismaError } = require('../../src/utils/Errors/prismaErrors');

jest.mock('../../src/lib/prisma', () => ({
  booking: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn()
  },
  event: {
    findUnique: jest.fn()
  }
}));

describe('BookingService', () => {
  const lang = 'en';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('book()', () => {
    it('should create booking if not already booked and event is valid', async () => {
      prisma.booking.findFirst.mockResolvedValue(null);
      prisma.event.findUnique.mockResolvedValue({ id: 1, date: new Date(Date.now() + 10000) });
      prisma.booking.create.mockResolvedValue({ id: 10, user_id: 1, event_id: 1 });

      const result = await bookingService.book(1, 1, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual({ id: 10, user_id: 1, event_id: 1 });
    });

    it('should throw if already booked', async () => {
      prisma.booking.findFirst.mockResolvedValue({ id: 1 });

      await expect(bookingService.book(1, 1, lang)).rejects.toThrow('You have already booked this event');
    });

    it('should throw if event not found', async () => {
      prisma.booking.findFirst.mockResolvedValue(null);
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(bookingService.book(1, 999, lang)).rejects.toThrow('Event not found');
    });

    it("should throw if event is in the past", async () => {
      prisma.booking.findFirst.mockResolvedValue(null);
      prisma.event.findUnique.mockResolvedValue({ id: 1, date: new Date(Date.now() - 10000) });

      await expect(bookingService.book(1, 1, lang)).rejects.toThrow("You can't book a past event");
    });

    it('should handle unknown error and call logger + handlePrismaError', async () => {
      const fakeError = new Error('Unknown failure');
      prisma.booking.findFirst.mockRejectedValue(fakeError);

      await expect(bookingService.book(1, 1, lang)).rejects.toThrow('Mocked Booking error');
      expect(logger.error).toHaveBeenCalledWith(fakeError);
      expect(handlePrismaError).toHaveBeenCalledWith(fakeError, 'Booking');
    });
  });

  describe('getByUser()', () => {
    it('should return user bookings with events', async () => {
      const bookings = [{ id: 1, event: { title_en: 'Test Event' } }];
      prisma.booking.findMany.mockResolvedValue(bookings);

      const result = await bookingService.getByUser(1, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual(bookings);
    });

    it('should handle unknown error and call logger + handlePrismaError', async () => {
      const error = new Error('DB exploded');
      prisma.booking.findMany.mockRejectedValue(error);

      await expect(bookingService.getByUser(1, lang)).rejects.toThrow('Mocked Booking error');
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Booking');
    });
  });
});
