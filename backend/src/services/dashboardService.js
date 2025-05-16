const prisma = require('../lib/prisma');
const logger = require('../lib/logger');
const { handlePrismaError } = require('../utils/Errors/prismaErrors');
const i18n = require('../config/i18n');

class DashboardService {
  async getSummaryCards() {
    try {
      const [totalUsers, totalBookings, totalEvents, bookings] = await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.event.count(),
        prisma.booking.findMany({
          select: {
            event: {
              select: {
                price: true,
              },
            },
          },
        }),
      ]);

      const totalRevenue = bookings.reduce((sum, b) => {
        const price = parseFloat(b.event?.price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        totalUsers,
        totalBookings,
        totalEvents,
        totalRevenue: Math.round(totalRevenue),
      };
    } catch (error) {
      logger.error(error);
      throw handlePrismaError(error);
    }
  }

  async getBookingsPerCategory(lang) {
    i18n.setLocale(lang);
    const categoryField = lang === 'ar' ? 'category_ar' : 'category_en';

    try {
      const groupedBookings = await prisma.booking.groupBy({
        by: ['event_id'],
        _count: true,
      });

      const withCategory = await Promise.all(
        groupedBookings.map(async (item) => {
          const event = await prisma.event.findUnique({
            where: { event_id: item.event_id },
            select: { [categoryField]: true },
          });

          return {
            category: event?.[categoryField] || i18n.__('Unknown'),
            totalBookings: item._count,
          };
        })
      );

      const summary = {};
      for (const item of withCategory) {
        summary[item.category] = (summary[item.category] || 0) + item.totalBookings;
      }

      return Object.entries(summary).map(([category, totalBookings]) => ({
        category,
        totalBookings,
      }));
    } catch (error) {
      logger.error(error);
      throw handlePrismaError(error);
    }
  }

  async getEventsPerCategory(lang) {
    i18n.setLocale(lang);
    const categoryField = lang === 'ar' ? 'category_ar' : 'category_en';

    try {
      const groupedEvents = await prisma.event.groupBy({
        by: [categoryField],
        _count: {
          [categoryField]: true,
        },
      });

      return groupedEvents.map((item) => ({
        category: item[categoryField],
        totalEvents: item._count[categoryField],
      }));
    } catch (error) {
      logger.error(error);
      throw handlePrismaError(error);
    }
  }

  async getRevenuePerCategory(lang) {
    i18n.setLocale(lang);
    const categoryField = lang === 'ar' ? 'category_ar' : 'category_en';

    try {
      const bookings = await prisma.booking.findMany({
        select: {
          event: {
            select: {
              [categoryField]: true,
              price: true,
            },
          },
        },
      });

      const summary = {};
      for (const { event } of bookings) {
        if (!event) continue;
        const category = event[categoryField] || i18n.__('Other');
        summary[category] = (summary[category] || 0) + (event.price || 0);
      }

      return Object.entries(summary).map(([category, totalRevenue]) => ({
        category,
        totalRevenue,
      }));
    } catch (error) {
      logger.error(error);
      throw handlePrismaError(error);
    }
  }
}

module.exports = new DashboardService();
