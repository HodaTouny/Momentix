require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const i18n = require('./config/i18n');
const limiter = require('./config/RateLimiter');
const corsOptions = require('./config/cors');
const logger = require('./lib/logger');
const routes = require('./routes');
const startEventStatusCron = require('./jobs/oldEvents');


const app = express();

app.use(i18n.init);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet());

startEventStatusCron();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

['JWT_SECRET', 'REFRESH_TOKEN'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: i18n.__('Route not found') });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: i18n.__('Internal server error: %s', err.message),
  });
});

module.exports = app;
