const express = require('express');
const BookingController = require('../controllers/bookingController');
const { requireUser, authenticateJWT } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createBookingSchema } = require('../schemas/bookingSchema');
const router = express.Router();

router.use(authenticateJWT);
router.use(requireUser);
router.post('/:eventId',validate(createBookingSchema), BookingController.bookEvent);
router.get('/', BookingController.getMyBookings);

module.exports = router;
