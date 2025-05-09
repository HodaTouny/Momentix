const express = require('express')
const router = express.Router()
const eventRoutes = require('./eventRoutes')
const authRoutes = require('./authRoutes')
const bookingRoutes = require('./bookingRoutes')

router.use('/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/bookings', bookingRoutes)

module.exports = router