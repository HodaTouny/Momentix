const express = require('express')
const router = express.Router()
const eventRoutes = require('./eventRoutes')
const authRoutes = require('./authRoutes')

router.use('/auth', authRoutes)
router.use('/events', eventRoutes)