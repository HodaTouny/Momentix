const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')
const validate  = require('../middlewares/validate')
const { createEventSchema, updateEventSchema } = require('../validations/eventSchema')
const { authenticateJWT , requireAdmin} = require('../middlewares/auth')
const {fillMissingTranslations} = require('../middlewares/translate')
const {upload} = require('../middlewares/upload')


router.get('/',eventController.getEvents)
router.post('/', upload.single('image'),authenticateJWT,requireAdmin,fillMissingTranslations,validate(createEventSchema), eventController.createEvent)
router.put('/:id', upload.single('image'),authenticateJWT ,requireAdmin,validate(updateEventSchema), eventController.updateEvent)
router.delete('/:id',authenticateJWT,requireAdmin,  eventController.deleteEvent)
router.get('/:id', eventController.getEvent)

module.exports = router