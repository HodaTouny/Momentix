const { fillMissingTranslations } = require('../../src/middlewares/translate');
const { Translate } = require('../../src/utils/geminiIntegration');

jest.mock('../../src/utils/geminiIntegration', () => ({
  Translate: jest.fn()
}));

describe('fillMissingTranslations middleware', () => {
  const next = jest.fn();
  let req;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        title_en: 'Test Title',
        description_en: 'Desc',
        venue_en: 'Cairo',
        category_en: 'Music',
      }
    };
  });

  test('should translate missing Arabic fields from English', async () => {
    Translate.mockResolvedValue({
      title: 'عنوان',
      description: 'وصف',
      venue: 'القاهرة',
      category: 'موسيقى'
    });

    const res = mockRes();

    await fillMissingTranslations(req, res, next);

    expect(Translate).toHaveBeenCalledWith(req.body, 'ar');
    expect(req.body.title_ar).toBe('عنوان');
    expect(req.body.description_ar).toBe('وصف');
    expect(req.body.venue_ar).toBe('القاهرة');
    expect(req.body.category_ar).toBe('موسيقى');
    expect(next).toHaveBeenCalled();
  });

  test('should translate missing English fields from Arabic', async () => {
    req.body = {
      title_ar: 'حدث',
      description_ar: 'وصف',
      venue_ar: 'الرياض',
      category_ar: 'فن'
    };

    Translate.mockResolvedValue({
      title: 'Event',
      description: 'Description',
      venue: 'Riyadh',
      category: 'Art'
    });

    const res = mockRes();

    await fillMissingTranslations(req, res, next);

    expect(Translate).toHaveBeenCalledWith(req.body, 'en');
    expect(req.body.title_en).toBe('Event');
    expect(req.body.description_en).toBe('Description');
    expect(req.body.venue_en).toBe('Riyadh');
    expect(req.body.category_en).toBe('Art');
    expect(next).toHaveBeenCalled();
  });

  test('should skip translation if nothing is missing', async () => {
    req.body = {
      title_en: 'X', title_ar: 'Y',
      description_en: '1', description_ar: '2',
      venue_en: 'A', venue_ar: 'B',
      category_en: 'M', category_ar: 'N'
    };

    const res = mockRes();

    await fillMissingTranslations(req, res, next);

    expect(Translate).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('should handle translation failure', async () => {
    Translate.mockRejectedValue(new Error('Gemini failed'));

    const res = mockRes();

    await fillMissingTranslations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringMatching(/translation failed/i) });
    expect(next).not.toHaveBeenCalled();
  });
});
