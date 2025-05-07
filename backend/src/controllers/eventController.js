const eventService = require("../services/eventService");
const i18n = require("../config/i18n");

class EventController {
  setLocale(req) {
    const lang = req.headers['accept-language'] || 'ar';
    i18n.setLocale(lang);
    return lang;
  }

  async getEvents(req, res) {
    const lang = this.setLocale(req);
    try {
      const events = await eventService.getEvents(req.query, lang);
      res.status(200).json({ events });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createEvent(req, res) {
    const lang = this.setLocale(req);
    try {
      const event = await eventService.createEvent(req.body, lang);
      res.status(201).json({
        message: i18n.__("Event created successfully"),
        event
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEvent(req, res) {
    const lang = this.setLocale(req);
    const { id } = req.params;
    try {
      const event = await eventService.updateEvent(Number(id), req.body, lang);
      res.status(200).json({
        message: i18n.__("Event updated successfully"),
        event
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteEvent(req, res) {
    const lang = this.setLocale(req);
    const { id } = req.params;
    try {
      const event = await eventService.deleteEvent(Number(id), lang);
      res.status(200).json({
        message: i18n.__("Event deleted successfully"),
        event
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getEvent(req, res) {
    const lang = this.setLocale(req);
    const { id } = req.params;
    try {
      const event = await eventService.getEvent(Number(id), lang);
      res.status(200).json({ event });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new EventController();
