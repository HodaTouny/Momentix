const dashboardService = require('../../src/services/dashboardService');
const prisma = require('../../src/lib/prisma');

jest.mock('../../src/lib/prisma');
jest.mock('../../src/lib/prisma', () => ({
  user: {
    count: jest.fn(),
  },
  booking: {
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  event: {
    count: jest.fn(),
    groupBy: jest.fn(),
    findUnique: jest.fn(),
  }
}));

describe('DashboardService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummaryCards()', () => {
    it('should return correct summary', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.booking.count.mockResolvedValue(5);
      prisma.event.count.mockResolvedValue(3);
      prisma.booking.findMany.mockResolvedValue([
        { event: { price: 200 } },
        { event: { price: 300 } }
      ]);

      const result = await dashboardService.getSummaryCards();

      expect(result).toEqual({
        totalUsers: 10,
        totalBookings: 5,
        totalEvents: 3,
        totalRevenue: 500
      });
    });
  });

  describe('getEventsPerCategory()', () => {
    it('should map event counts by language', async () => {
      prisma.event.groupBy.mockResolvedValue([
        { category_en: 'Tech', _count: { category_en: 3 } }
      ]);

      const result = await dashboardService.getEventsPerCategory('en');

      expect(result).toEqual([{ category: 'Tech', totalEvents: 3 }]);
    });
  });

  describe('getBookingsPerCategory()', () => {
    it('should group bookings and resolve categories', async () => {
      prisma.booking.groupBy.mockResolvedValue([{ event_id: 1, _count: 2 }]);
      prisma.event.findUnique.mockResolvedValue({ category_en: 'Art' });

      const result = await dashboardService.getBookingsPerCategory('en');

      expect(result).toEqual([{ category: 'Art', totalBookings: 2 }]);
    });
  });

  describe('getRevenuePerCategory()', () => {
    it('should calculate revenue by category', async () => {
      prisma.booking.findMany.mockResolvedValue([
        { event: { category_en: 'Tech', price: 100 } },
        { event: { category_en: 'Tech', price: 200 } },
        { event: null } 
      ]);

      const result = await dashboardService.getRevenuePerCategory('en');

      expect(result).toEqual([{ category: 'Tech', totalRevenue: 300 }]);
    });
  });
});
