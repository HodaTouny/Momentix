const prisma = require('../lib/prisma');
const logger = require('../lib/logger');
const i18n = require('../config/i18n');
const { handlePrismaError } = require('../utils/Errors/prismaErrors');
const { CustomError } = require('../utils/Errors/customErrors');

class BookingService {
  async book(userId, eventId, lang) {
    i18n.setLocale(lang);

    try {
      const existing = await prisma.booking.findFirst({where: { user_id: userId, event_id: eventId }});
      if (existing) {
        throw new CustomError(i18n.__('You have already booked this event'), 400);
      }
      const event = await prisma.event.findUnique({ where: { event_id: eventId } });
      if (!event) {
        throw new CustomError(i18n.__('Event not found'), 404);
      }
      if (event.date < new Date()) {
        throw new CustomError(i18n.__("You can't book a past event"), 400);
      }
      const booking = await prisma.booking.create({data: {user_id: userId,event_id: eventId} });
      return booking;
    } catch (error) {
      logger.error(error);
      handlePrismaError(error, i18n.__('Booking'));
    }
  }

  async getByUser(userId, lang) {
    i18n.setLocale(lang);

    try {
      const bookings = await prisma.booking.findMany({
        where: { user_id: userId },
        include: { event: true }
      });

      return bookings;

    } catch (error) {
      logger.error(error);
      handlePrismaError(error, i18n.__('Booking'));
    }
  }
}

module.exports = new BookingService();
