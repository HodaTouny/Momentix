const express = require('express')
const router = express.Router()
const eventRoutes = require('./eventRoutes')
const authRoutes = require('./authRoutes')
const bookingRoutes = require('./bookingRoutes')
const dashboardRoutes = require('./dashboardRoutes')
router.use('/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/bookings', bookingRoutes)
router.use('/dashboard', dashboardRoutes);
module.exports = router