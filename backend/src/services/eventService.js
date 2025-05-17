const prisma = require('../lib/prisma');
const logger = require('../lib/logger');
const i18n = require('../config/i18n');
const { handlePrismaError } = require('../utils/Errors/prismaErrors');
const { CustomError } = require('../utils/Errors/customErrors');
const { parseInclude, processFilters, parseOrderBy } = require('../utils/parseQuery');
const UploadService = require('./uploadService');
const { invalidateDashboardCache, deleteEventCache } = require('../utils/redisInvalidate');
const redis = require('../lib/redis');

class EventService {
  async getEvents(query, lang) {
    i18n.setLocale(lang);
    try {
      let { page, pageSize, include, orderBy, ...filters } = query;

      const category = query.category_en || query.category_ar || null;
      if (orderBy) orderBy = parseOrderBy(orderBy);
      const orderKey = orderBy[0].date
      console.log(orderKey)
      const cacheKey = `events:page=${page}&size=${pageSize}&order=${orderKey}&cat_en=${category || 'all'}`;
      filters = processFilters(filters);
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      if (include) include = parseInclude(include);
    
      const options = { where: filters, include, orderBy };
      const pageNum = parseInt(page, 10);
      const size = parseInt(pageSize, 10);

      if (page && pageSize) {
        const skip = (pageNum - 1) * size;
        const take = size;
        const [data, total] = await Promise.all([
          prisma.event.findMany({ ...options, skip, take }),
          prisma.event.count({ where: filters }),
        ]);

        const result = { data, total, page: pageNum, pageSize: size };
        await redis.set(cacheKey, JSON.stringify(result), 'EX', 600);
        return result;
      } else {
        const data = await prisma.event.findMany(options);
        await redis.set(cacheKey, JSON.stringify(data), 'EX', 600);
        return data;
      }
    } catch (error) {
      logger.error(error);
      handlePrismaError(error, i18n.__('Event'));
    }
  }

  async createEvent(data, lang) {
    i18n.setLocale(lang);
    const { imagePath, ...eventData } = data;
    try {
      const event = await prisma.event.create({ data: eventData });
      const { secure_url, public_id } = await UploadService.uploadModelImage(imagePath, 'event', event.event_id);
      const updatedEvent = await prisma.event.update({
        where: { event_id: event.event_id },
        data: { image: secure_url, public_id: public_id },
      });

      await invalidateDashboardCache();
      try {
        await deleteEventCache();
      } catch (err) {
        logger.error('Failed to delete event cache:', err);
      }

      return updatedEvent;
    } catch (error) {
      logger.error(error);
      handlePrismaError(error, i18n.__('Event'));
    }
  }

  async updateEvent(id, data, lang) {
    i18n.setLocale(lang);
    try {
      const event = await prisma.event.findUnique({ where: { event_id: id } });
      if (!event) throw new CustomError(i18n.__('Event not found'), 404);

      const { imagePath, ...restData } = data;
      let updatedData = { ...restData };

      if (imagePath) {
        if (event.public_id) await UploadService.deleteModelImage(event.public_id);
        const { secure_url, public_id } = await UploadService.uploadModelImage(imagePath, 'event', id);
        updatedData.image = secure_url;
        updatedData.public_id = public_id;
      }

      const updatedEvent = await prisma.event.update({
        where: { event_id: id },
        data: updatedData,
      });

      await invalidateDashboardCache();
      try {
        await deleteEventCache();
      } catch (err) {
        logger.error('Failed to delete event cache:', err);
      }

      return updatedEvent;
    } catch (error) {
      logger.error(error);
      if (error instanceof CustomError) throw error;
      handlePrismaError(error, i18n.__('Event'));
    }
  }

  async deleteEvent(id, lang) {
    i18n.setLocale(lang);
    try {
      const event = await prisma.event.findUnique({ where: { event_id: id } });
      if (!event) throw new CustomError(i18n.__('Event not found'), 404);

      await prisma.booking.deleteMany({ where: { event_id: id } });
      if (event.public_id) await UploadService.deleteModelImage(event.public_id);

      const deletedEvent = await prisma.event.delete({ where: { event_id: id } });

      await invalidateDashboardCache();
      try {
        await deleteEventCache();
      } catch (err) {
        logger.error('Failed to delete event cache:', err);
      }

      return deletedEvent;
    } catch (error) {
      logger.error(error);
      if (error instanceof CustomError) throw error;
      handlePrismaError(error, i18n.__('Event'));
    }
  }

  async getEvent(id, lang) {
    i18n.setLocale(lang);
    try {
      const event = await prisma.event.findUnique({ where: { event_id: id } });
      if (!event) throw new CustomError(i18n.__('Event not found'), 404);
      return event;
    } catch (error) {
      logger.error(error);
      if (error instanceof CustomError) throw error;
      handlePrismaError(error, i18n.__('Event'));
    }
  }
}

module.exports = new EventService();
