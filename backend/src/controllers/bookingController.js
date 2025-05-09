const bookingService = require('../services/bookingService');
const i18n = require('../config/i18n');

class BookingController {
  setLanguage(req) {
    const lang = req.headers['accept-language'] || 'en';
    i18n.setLocale(lang);
    return lang;
  }

  async bookEvent(req, res) {
    const lang = this.setLanguage(req);
    const { eventId } = req.params;
    const userId = req.user.id;
    try {
      const booking = await bookingService.book(userId, eventId, lang);
      res.status(201).json({message: i18n.__('Event booked successfully'),booking});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyBookings(req, res) {
    const lang = this.setLanguage(req);
    const userId = req.user.id;

    try {
      const bookings = await bookingService.getByUser(userId, lang);
      res.status(200).json({ bookings });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();
