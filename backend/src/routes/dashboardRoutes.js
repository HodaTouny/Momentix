const DashboardController = require('../controllers/dashboardController');
const { requireAdmin, authenticateJWT } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', authenticateJWT, requireAdmin, DashboardController.getDashboardData);

module.exports = router;