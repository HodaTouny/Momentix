const { Translate } = require('../utils/geminiIntegration');
const i18n = require('../config/i18n')
const logger = require('../lib/logger')

async function fillMissingTranslations(req, res, next) {
  try {
    const body = req.body;

    if (!body.title_en || !body.description_en || !body.venue_en || !body.category_en) {
      const translatedEn = await Translate(body, 'en');
      body.title_en = translatedEn.title;
      body.description_en = translatedEn.description;
      body.venue_en =  translatedEn.venue;
      body.category_en = translatedEn.category;
    }

    if (!body.title_ar || !body.description_ar || !body.venue_ar || !body.category_ar) {
      const translatedAr = await Translate(body, 'ar');
      body.title_ar = translatedAr.title;
      body.description_ar =  translatedAr.description;
      body.venue_ar =  translatedAr.venue;
      body.category_ar =  translatedAr.category;
    }

    next();
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: i18n.__('Translation Failed') });
  }
}

module.exports = {fillMissingTranslations};
