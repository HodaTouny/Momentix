const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')
const { validate } = require('../middlewares/validate')
const { createEventSchema, updateEventSchema } = require('../schemas/eventSchema')
const { authenticateJWT , requireAdmin} = require('../middlewares/auth')
const {fillMissingTranslations} = require('../middlewares/translate')

router.get('/',eventController.getEvents)
router.post('/', authenticateJWT,requireAdmin,fillMissingTranslations,validate(createEventSchema), eventController.createEvent)
router.put('/:id',authenticateJWT ,requireAdmin,fillMissingTranslations,validate(updateEventSchema), eventController.updateEvent)
router.delete('/:id',authenticateJWT,requireAdmin,  eventController.deleteEvent)
router.get('/:id', eventController.getEvent)

module.exports = router