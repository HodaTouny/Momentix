const { createClient } = require('redis');
const logger = require('./logger');

const redis = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-16863.c259.us-central1-2.gce.redns.redis-cloud.com',
    port: 16863,
    tls: {}
  }
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis connection error:', err));

redis.connect(); 

module.exports = redis;
