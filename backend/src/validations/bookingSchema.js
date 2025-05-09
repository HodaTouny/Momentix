const joi = require('joi');

const createBookingSchema = joi.object({
    event_id: joi.number().required(),
    user_id: joi.number().required(),
});

module.exports = {
    createBookingSchema
}