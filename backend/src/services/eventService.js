const prisma = require('../lib/prisma')
const logger = require('../lib/logger')
const i18n = require('../config/i18n')
const {handlePrismaError} = require('../utils/Errors/prismaErrors')
const { CustomError } = require('../utils/Errors/customErrors')
const { parseInclude, processFilters } = require('../utils/parseQuery')

class EventService {
    async getEvents(query, lang) {
        i18n.setLocale(lang)
        try {
            let { page, pageSize, include, orderBy, ...filters } = query;
            if (include) include = parseInclude(include);
            if (orderBy) orderBy = parseInclude(orderBy);
            filters = processFilters(filters);
            const options = { where: filters, include, orderBy };
            const pageNum = parseInt(page, 10) 
            const size = parseInt(pageSize, 10) 


            if (page && pageSize) {
                const skip = (pageNum- 1) * size; 
                const take = size 
                const [data, total] = await Promise.all([
                  prisma.event.findMany({ ...options, skip, take }),
                  prisma.event.count({ where: filters }),
                ]);
                return { data, total , page: pageNum, pageSize: size };
            }
            else{
                const data = await prisma.event.findMany(options); 
                return data;  
            }
        } catch (error) {
            logger.error(error)
            handlePrismaError(error, i18n.__("Event"))
        }
    }

    async createEvent(data, lang) {
        i18n.setLocale(lang)
        try {
            const event = await prisma.event.create({ data });
            return event
        } catch (error) {
            logger.error(error)
            handlePrismaError(error, i18n.__("Event"))
        }
    }

    async updateEvent(id, data, lang) {
        i18n.setLocale(lang)
        try {
            const event = await prisma.event.findUnique({ where: { id } });
            if (!event) throw new CustomError(i18n.__("Event not found"), 404);
            const updatedEvent = await prisma.event.update({ where: { id }, data: data });
            return updatedEvent
        } catch (error) {
            logger.error(error)
            handlePrismaError(error, i18n.__("Event"))
        }
    }

    async deleteEvent(id, lang) {
        i18n.setLocale(lang)
        try {
            const event = await prisma.event.findUnique({ where: { id } });
            if (!event) throw new CustomError(i18n.__("Event not found"), 404);

            const deletedEvent = await prisma.event.delete({ where: { id } });
            return deletedEvent
        } catch (error) {
            logger.error(error)
            handlePrismaError(error, i18n.__("Event"))
        }
    }

    async getEvent(id, lang) {
        i18n.setLocale(lang)
        try {
            const event = await prisma.event.findUnique({ where: { id } });
            if (!event) throw new CustomError(i18n.__("Event not found"), 404);
            return event
        } catch (error) {
            logger.error(error)
            handlePrismaError(error, i18n.__("Event"))
        }
    }
}

module.exports = new EventService()