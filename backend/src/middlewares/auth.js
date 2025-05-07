const i18n = require('../config/i18n');


function requireAdmin(req, res, next) {
    i18n.setLocale(req.language || 'en');
    const role = req.user.role.toLowerCase();
    if (req.user && role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: i18n.__('Unauthorized') });
    }
}
function requireUser(req, res, next) {
    i18n.setLocale(req.language || 'en');
    const role = req.user.role.toLowerCase();
    if (req.user && role === 'user') {
        next();
    } else {
        res.status(401).json({ message: i18n.__('Unauthorized') });
    }
}

const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const i18n = require('../config/i18n');
require('dotenv').config();

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  i18n.setLocale(req.headers['accept-language'] || 'en');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: i18n.__('Unauthorized: User not found') });
      }
    } catch (error) {
      res.status(401).json({ message: i18n.__('Unauthorized: Invalid token') });
    }
  } else {
    res.status(401).json({ message: i18n.__('Unauthorized: No token provided') });
  }
};



module.exports = { requireAdmin, requireUser , authenticateJWT };