const eventController = require('../controllers/eventController')
const express = require('express')
const router = express.Router()

router.use('/events', eventController)