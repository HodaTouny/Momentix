const cron = require('node-cron');
const prisma = require('../lib/prisma');
const logger = require('../lib/logger');
function startEventStatusCron() {
  cron.schedule('0 0 * * *', async () => {
    logger.log('Running event status updater job...');

    try {
      const now = new Date();

      const updated = await prisma.event.updateMany({
        where: {
          date: { lt: now },
          status: "active",
        },
        data: {
          status: "inactive",
        },
      });

      logger.log(`Updated ${updated.count} event(s) to inActive.`);
    } catch (error) {
      logger.error('Error updating events:', error);
    }
  });
}

module.exports = startEventStatusCron;