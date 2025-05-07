const axios = require('axios');
const logger = require('../lib/logger');

async function Translate(event, lang) {
  let title, description, venue, category;

  if (lang === 'ar') {
    title = event.title_en;
    description = event.description_en;
    venue = event.venue;
    category = event.category_en;
  } else {
    title = event.title_ar;
    description = event.description_ar;
    venue = event.venue;
    category = event.category_ar;
  }

  const prompt = `
            This is an event. Please translate it to ${lang === 'ar' ? 'Arabic' : 'English'} in a high-quality, natural, well-formatted way.

            Title: ${title}
            Description: ${description}
            Venue: ${venue}
            Category: ${category}

            Return a response where each translated part is labeled clearly as:
            Title: ...
            Description: ...
            Venue: ...
            Category: ...
            Only return these 4 fields, no additional text.

`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const extractField = (label) => {
      const regex = new RegExp(`${label}:\\s*(.+)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };
    const translatedDate = {title: extractField('Title'),description: extractField('Description'),venue: extractField('Venue'),category: extractField('Category')};
    return translatedDate
  } catch (error) {
    logger.error(error);
    throw new Error('Gemini translation failed');
  }
}

module.exports = { Translate };
