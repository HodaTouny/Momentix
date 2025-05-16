const DashboardService = require('../services/dashboardService');
const logger = require('../lib/logger');

class DashboardController {
  async getDashboardData(req, res) {
    try {
      const lang = req.headers['accept-language'] || 'en';

      const [
        summaryCards,
        bookingsPerCategory,
        eventsPerCategory,
        revenuePerCategory
      ] = await Promise.all([
        DashboardService.getSummaryCards(),
        DashboardService.getBookingsPerCategory(lang),
        DashboardService.getEventsPerCategory(lang),
        DashboardService.getRevenuePerCategory(lang)
      ]);

      return res.status(200).json({
        summaryCards,
        bookingsPerCategory,
        eventsPerCategory,
        revenuePerCategory
      });

    } catch (error) {
      logger.error('Dashboard error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new DashboardController();
