const redis = require('../lib/redis');
const logger = require('../lib/logger')

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

  await Promise.all(keys.map((key) => redis.del(key)));
}

async function deleteEventCache() {
  let cursor = '0';

  try {
    do {
      const { cursor: nextCursor, keys } = await redis.scan(cursor, {
        MATCH: 'events:*',
        COUNT: 100
      });

      if (Array.isArray(keys) && keys.length > 0) {
        await redis.del(...keys);
        logger.info('Deleting Redis keys:', keys);
      }

      cursor = nextCursor;
    } while (cursor !== '0');
  } catch (err) {
    logger.error('Error deleting event cache:', err);
  }
}


module.exports = { invalidateDashboardCache, deleteEventCache };
