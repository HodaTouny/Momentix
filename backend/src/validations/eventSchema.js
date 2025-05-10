const joi = require('joi');

const createEventSchema = joi.object({
  title_en: joi.string().required(),
  title_ar: joi.string().required(),
  description_en: joi.string().required(),
  description_ar: joi.string().required(),
  category_en: joi.string().required(),
  category_ar: joi.string().required(),
  date: joi.date().greater('now').required(),
  venue_en: joi.string().required(),
  venue_ar: joi.string().required(),
  price: joi.number().required(),
  created_by: joi.number().required()
});

const updateEventSchema = joi.object({
  title_en: joi.string(),
  title_ar: joi.string(),
  description_en: joi.string(),
  description_ar: joi.string(),
  category_en: joi.string(),
  category_ar: joi.string(),
  date: joi.date().greater('now'),
  venue_ar: joi.string(),
  venue_en: joi.string(),
  price: joi.number(),
  created_by: joi.number()
});

module.exports = {
  createEventSchema,
  updateEventSchema
};
