const { Translate } = require('../utils/geminiIntegration');
const i18n = require('../config/i18n')
const logger = require('../lib/logger')


const CATEGORY_MAP = {
  Technical: 'تقني',
  Music: 'موسيقى',
  Business: 'أعمال',
  Education: 'تعليم',
  Health: 'صحة',
  Sports: 'رياضة',
  Art: 'فن',
  Food: 'طعام'
};

function normalizeCategory(category, lang) {
  if (!category) return lang === 'ar' ? 'أخرى' : 'Other';

  const enToAr = CATEGORY_MAP;
  const arToEn = Object.entries(enToAr).reduce((acc, [en, ar]) => {
    acc[ar] = en;
    return acc;
  }, {});

  const isArabicInput = Object.values(enToAr).includes(category);
  const isEnglishInput = Object.keys(enToAr).includes(category);

  if (lang === 'en') {
    if (isArabicInput) {
      return arToEn[category] || 'Other';
    } else if (isEnglishInput) {
      return category;
    } else {
      logger?.error?.(`Unknown category: "${category}"`);
      return 'Other';
    }
  } else if (lang === 'ar') {
    if (isEnglishInput) {
      return enToAr[category] || 'أخرى';
    } else if (isArabicInput) {
      return category;
    } else {
      logger?.error?.(`Unknown category: "${category}"`);
      return 'أخرى';
    }
  }

  return lang === 'ar' ? 'أخرى' : 'Other';
}


async function fillMissingTranslations(req, res, next) {
  try {
    const body = req.body;

    if (!body.title_en || !body.description_en || !body.venue_en || !body.category_en) {
      const translatedEn = await Translate(body, 'en');
      body.title_en = translatedEn.title;
      body.description_en = translatedEn.description;
      body.venue_en =  translatedEn.venue;
      body.category_en = normalizeCategory(translatedEn.category, 'en');
    }

    if (!body.title_ar || !body.description_ar || !body.venue_ar || !body.category_ar) {
      const translatedAr = await Translate(body, 'ar');
      body.title_ar = translatedAr.title;
      body.description_ar =  translatedAr.description;
      body.venue_ar =  translatedAr.venue;
      body.category_ar =  normalizeCategory(translatedAr.category, 'ar');
    }



    next();
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ error: i18n.__('Translation Failed') });
  }
}

module.exports = {fillMissingTranslations};
