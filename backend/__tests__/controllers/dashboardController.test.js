const dashboardController = require('../../src/controllers/dashboardController');
const dashboardService = require('../../src/services/dashboardService');
const logger = require('../../src/lib/logger');

jest.mock('../../src/services/dashboardService');

describe('DashboardController', () => {
  const req = { headers: { 'accept-language': 'en' } };
  const res = mockRes();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return dashboard data with 200', async () => {
    const fakeData = {
      summaryCards: { totalUsers: 5, totalBookings: 10, totalEvents: 3, totalRevenue: 5000 },
      bookingsPerCategory: [{ category: 'Tech', totalBookings: 6 }],
      eventsPerCategory: [{ category: 'Tech', totalEvents: 3 }],
      revenuePerCategory: [{ category: 'Tech', totalRevenue: 5000 }]
    };

    dashboardService.getSummaryCards.mockResolvedValue(fakeData.summaryCards);
    dashboardService.getBookingsPerCategory.mockResolvedValue(fakeData.bookingsPerCategory);
    dashboardService.getEventsPerCategory.mockResolvedValue(fakeData.eventsPerCategory);
    dashboardService.getRevenuePerCategory.mockResolvedValue(fakeData.revenuePerCategory);

    await dashboardController.getDashboardData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it('should handle errors and return 500', async () => {
    dashboardService.getSummaryCards.mockImplementation(() => {
      throw new Error('Test error');
    });

    await dashboardController.getDashboardData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
