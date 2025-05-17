const redis = require('../lib/redis');
const logger = require('../lib/logger');

// Invalidate fixed dashboard keys
async function invalidateDashboardCache() {
  const keys = [
    'dashboard:summary',
    'dashboard:events:en',
    'dashboard:events:ar',
    'dashboard:bookings:en',
    'dashboard:bookings:ar',
    'dashboard:revenue:en',
    'dashboard:revenue:ar',
  ];

  try {
    const result = await Promise.all(keys.map((key) => redis.del(key)));
    logger.info(`Deleted dashboard cache keys: ${keys.join(', ')}`);
  } catch (err) {
    logger.error('Error deleting dashboard cache:', err);
  }
}

async function deleteEventCache() {
  let cursor = '0';
  let deletedCount = 0;

  try {
    do {
      const { cursor: nextCursor, keys } = await redis.scan(cursor, {
        MATCH: 'events:*',
        COUNT: 100,
      });

      if (Array.isArray(keys) && keys.length > 0) {
        await redis.del(...keys);
        deletedCount += keys.length;
      }

      cursor = nextCursor;
    } while (cursor !== '0');

    logger.info(`Deleted ${deletedCount} Redis event cache keys.`);
  } catch (err) {
    logger.error('Error deleting event cache:', err);
  }
}

module.exports = { invalidateDashboardCache, deleteEventCache };
