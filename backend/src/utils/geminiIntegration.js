const axios = require('axios');
const logger = require('../lib/logger');
require('dotenv').config();

async function Translate(event, lang) {
  let title, description, venue, category;
  

  if (lang === 'ar') {
    title = event.title_en;
    description = event.description_en;
    venue = event.venue_en;
    category = event.category_en;
  } else {
    title = event.title_ar;
    description = event.description_ar;
    venue = event.venue_ar;
    category = event.category_ar;
  }

  const prompt = `
        You are a professional human translator. Your task is to translate the following event details into ${lang === 'ar' ? 'Arabic' : 'English'}.
        Translate naturally, understanding the full meaning of the text, not just word-by-word. Make the translation sound fluent, culturally appropriate, and engaging — as if written originally in the target language.
        Here are the fields:

            Title: ${title}
            Description: ${description}
            Venue: ${venue}
            Category: ${category}

        Instructions:
        - Preserve the original meaning and tone.
        - Adapt phrases when necessary for naturalness.
        - Field labels must remain exactly as: Title, Description, Venue, Category.
        - Return only the translated fields in this format:
            Title: ...
            Description: ...
            Venue: ...
            Category: ...
        Do not add any extra explanation or text.
        - Strictly output only the four fields, formatted clearly.

`;
    if (!title || !description || !venue || !category) {
      throw new Error('Missing event data for translation.');
    }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      logger.error('Gemini API returned empty translation.');
      throw new Error('Translation service failed');
    }
    const extractField = (label) => {
      const regex = new RegExp(`${label}:\\s*(.+)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };
    const translatedDate = {title: extractField('Title'),description: extractField('Description'),venue: extractField('Venue'),category: extractField('Category')};
    return translatedDate
  } catch (error) {
    console.log(error.message);
    logger.error(error);
    throw new Error('Gemini translation failed');
  }
}

module.exports = { Translate };
