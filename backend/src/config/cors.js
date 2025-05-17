const cors = require('cors');
require('dotenv').config();
const corsOptions = cors.CorsOptions = {
  origin: `https://atc-01060584671-1.onrender.com`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}

module.exports = corsOptions