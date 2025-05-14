const express = require('express');
const BookingController = require('../controllers/bookingController');
const { requireUser, authenticateJWT } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createBookingSchema } = require('../validations/bookingSchema');
const router = express.Router();

router.use(authenticateJWT);
router.use(requireUser);
router.get('/:eventId',validate(createBookingSchema), BookingController.bookEvent);
router.get('/', authenticateJWT,requireUser,BookingController.getMyBookings);

module.exports = router;
