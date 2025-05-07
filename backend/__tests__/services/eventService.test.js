const EventService = require('../../src/services/eventService');
const prisma = require('../../src/lib/prisma');
const logger = require('../../src/lib/logger');
const i18n = require('../../src/config/i18n');
const { handlePrismaError } = require('../../src/utils/Errors/prismaErrors');

jest.mock('../../src/lib/prisma', () => ({
  event: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('EventService', () => {
  const lang = 'en';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return paginated results', async () => {
      prisma.event.findMany.mockResolvedValue([{ id: 1 }]);
      prisma.event.count.mockResolvedValue(1);
      const query = { page: '1', pageSize: '10' };

      const result = await EventService.getEvents(query, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual({ data: [{ id: 1 }], total: 1, page: 1, pageSize: 10 });
    });

    it('should return all events if no pagination', async () => {
      prisma.event.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const query = {};

      const result = await EventService.getEvents(query, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should handle errors in getEvents', async () => {
      const error = new Error('DB Error');
      prisma.event.findMany.mockRejectedValue(error);

      await expect(EventService.getEvents({}, lang)).rejects.toThrow('Mocked Event error');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Event');
    });
  });

  describe('createEvent', () => {
    it('should create event', async () => {
      const eventData = { name: 'Test Event' };
      prisma.event.create.mockResolvedValue(eventData);

      const result = await EventService.createEvent(eventData, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual(eventData);
    });

    it('should handle error in createEvent', async () => {
      const error = new Error('Create Error');
      prisma.event.create.mockRejectedValue(error);

      await expect(EventService.createEvent({}, lang)).rejects.toThrow('Mocked Event error');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Event');
    });
  });

  describe('updateEvent', () => {
    it('should update existing event', async () => {
      prisma.event.findUnique.mockResolvedValue({ id: 1 });
      prisma.event.update.mockResolvedValue({ id: 1, name: 'Updated' });

      const result = await EventService.updateEvent(1, { name: 'Updated' }, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });

    it('should throw if event not found', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(EventService.updateEvent(1, {}, lang)).rejects.toThrow('Event not found');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(i18n.__).toHaveBeenCalledWith('Event not found');
    });

    it('should handle error in updateEvent', async () => {
      const error = new Error('Update Error');
      prisma.event.findUnique.mockResolvedValue({ id: 1 });
      prisma.event.update.mockRejectedValue(error);

      await expect(EventService.updateEvent(1, {}, lang)).rejects.toThrow('Mocked Event error');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Event');
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      prisma.event.delete.mockResolvedValue({ id: 1 });

      const result = await EventService.deleteEvent(1, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual({ id: 1 });
    });

    it('should handle error in deleteEvent', async () => {
      const error = new Error('Delete Error');
      prisma.event.delete.mockRejectedValue(error);

      await expect(EventService.deleteEvent(1, lang)).rejects.toThrow('Mocked Event error');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Event');
    });
  });

  describe('getEvent', () => {
    it('should get event by id', async () => {
      prisma.event.findUnique.mockResolvedValue({ id: 1 });

      const result = await EventService.getEvent(1, lang);

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(result).toEqual({ id: 1 });
    });

    it('should throw if event not found', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(EventService.getEvent(1, lang)).rejects.toThrow('Event not found');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(i18n.__).toHaveBeenCalledWith('Event not found');
    });

    it('should handle error in getEvent', async () => {
      const error = new Error('Get Error');
      prisma.event.findUnique.mockRejectedValue(error);

      await expect(EventService.getEvent(1, lang)).rejects.toThrow('Mocked Event error');

      expect(i18n.setLocale).toHaveBeenCalledWith(lang);
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(handlePrismaError).toHaveBeenCalledWith(error, 'Event');
    });
  });
});
