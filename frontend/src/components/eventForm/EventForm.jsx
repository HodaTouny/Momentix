import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const categories = [
  "Technical", "Music", "Business", "Education", "Health",
  "Sports", "Art", "Food", "Other",
];

const EventForm = ({ mode = 'create', initialValues = {}, onSubmit }) => {
  const { currentTheme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    image: null,
    title_en: '', description_en: '', category_en: '', venue_en: '',
    title_ar: '', description_ar: '', category_ar: '', venue_ar: '',
    date: '', price: '',
  });

  const [addOtherLang, setAddOtherLang] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      setFormData({
        image: null,
        title_en: initialValues.title_en || '',
        description_en: initialValues.description_en || '',
        category_en: initialValues.category_en || '',
        venue_en: initialValues.venue_en || '',
        title_ar: initialValues.title_ar || '',
        description_ar: initialValues.description_ar || '',
        category_ar: initialValues.category_ar || '',
        venue_ar: initialValues.venue_ar || '',
        date: initialValues.date ? new Date(initialValues.date).toISOString().substr(0, 10) : '',
        price: initialValues.price || '',
      });
    }
  }, [mode, initialValues]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const isArabicText = (text) => /^[\u0600-\u06FF\s.,؟،!؟'"-]+$/.test(text.trim());
  const isEnglishText = (text) => /^[A-Za-z0-9\s.,!?'"-]+$/.test(text.trim());

  const validate = () => {
    const newErrors = {};

    const baseFields = isArabic
      ? ['title_ar', 'description_ar', 'category_ar', 'venue_ar', 'date', 'price']
      : ['title_en', 'description_en', 'category_en', 'venue_en', 'date', 'price'];

    for (let field of baseFields) {
      if (!formData[field]) {
        newErrors[field] = 'Required';
      }
    }

    if (mode === 'create' && !formData.image) {
      newErrors['image'] = 'Image is required';
    }

    if (formData.date && new Date(formData.date) <= new Date()) {
      newErrors['date'] = 'Date must be in the future';
    }

    if (isArabic) {
      if (formData.title_ar && !isArabicText(formData.title_ar)) newErrors['title_ar'] = 'Must be Arabic text';
      if (formData.description_ar && !isArabicText(formData.description_ar)) newErrors['description_ar'] = 'Must be Arabic text';
      if (formData.venue_ar && !isArabicText(formData.venue_ar)) newErrors['venue_ar'] = 'Must be Arabic text';
    } else {
      if (formData.title_en && !isEnglishText(formData.title_en)) newErrors['title_en'] = 'Must be English text';
      if (formData.description_en && !isEnglishText(formData.description_en)) newErrors['description_en'] = 'Must be English text';
      if (formData.venue_en && !isEnglishText(formData.venue_en)) newErrors['venue_en'] = 'Must be English text';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    let payload = { ...formData };

    if (addOtherLang === 'auto') {
      if (isArabic) {
        delete payload.title_en;
        delete payload.description_en;
        delete payload.category_en;
        delete payload.venue_en;
      } else {
        delete payload.title_ar;
        delete payload.description_ar;
        delete payload.category_ar;
        delete payload.venue_ar;
      }
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] == null) {
        delete payload[key];
      }
    });

    await onSubmit(payload);

    setLoading(false);
  };

  const handleManualTranslate = () => {
    setAddOtherLang('manual');
  };

  const handleAutoTranslate = () => {
    setAddOtherLang('auto');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit}
      className="container py-4"
      style={{ color: currentTheme.textPrimary, direction: isArabic ? 'rtl' : 'ltr' }}
      encType="multipart/form-data"
    >

      {/* Upload Image */}
      <div className="form-group mb-4 text-center">
        <label><strong>{t('Image')}</strong></label>
        <div style={{
          width: '250px', height: '250px',
          margin: '1rem auto', border: `2px dashed ${currentTheme.borderColor}`,
          borderRadius: '12px', backgroundColor: currentTheme.cardBackground,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {formData.image ? (
            <img src={URL.createObjectURL(formData.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : initialValues?.image ? (
            <img src={initialValues.image} alt="Current Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: currentTheme.textSecondary }}>{t('No Image Selected')}</span>
          )}
        </div>
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleChange} 
          className={`form-control mt-2 ${errors.image ? 'is-invalid' : ''}`
        } 
        />
        {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
      </div>

      {/* Main Fields */}
      {[ 
        { label: t('Title'), name: isArabic ? 'title_ar' : 'title_en', type: 'text' },
        { label: t('Description'), name: isArabic ? 'description_ar' : 'description_en', type: 'textarea' },
        { label: t('Venue'), name: isArabic ? 'venue_ar' : 'venue_en', type: 'text' },
      ].map(({ label, name, type }) => (
        <div className="form-group mb-3" key={name}>
          <label><strong>{label}</strong></label>
          {type === 'textarea' ? (
            <textarea name={name} value={formData[name]} onChange={handleChange}
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`} rows="3" />
          ) : (
            <input type="text" name={name} value={formData[name]} onChange={handleChange}
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`} />
          )}
          {errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>}
        </div>
      ))}

      {/* Other language fields if manual */}
      {addOtherLang === 'manual' && (
        <>
          {[
            { label: isArabic ? t('Title (English)') : t('Title (Arabic)'), name: isArabic ? 'title_en' : 'title_ar', type: 'text' },
            { label: isArabic ? t('Description (English)') : t('Description (Arabic)'), name: isArabic ? 'description_en' : 'description_ar', type: 'textarea' },
            { label: isArabic ? t('Venue (English)') : t('Venue (Arabic)'), name: isArabic ? 'venue_en' : 'venue_ar', type: 'text' },
          ].map(({ label, name, type }) => (
            <div className="form-group mb-3" key={name}>
              <label><strong>{label}</strong></label>
              {type === 'textarea' ? (
                <textarea name={name} value={formData[name]} onChange={handleChange}
                  className={`form-control ${errors[name] ? 'is-invalid' : ''}`} rows="3" />
              ) : (
                <input type="text" name={name} value={formData[name]} onChange={handleChange}
                  className={`form-control ${errors[name] ? 'is-invalid' : ''}`} />
              )}
              {errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>}
            </div>
          ))}
        </>
      )}

      {/* Category */}
      <div className="form-group mb-3">
        <label><strong>{t('Category')}</strong></label>
        <select
          name={isArabic ? 'category_ar' : 'category_en'}
          value={isArabic ? formData.category_ar : formData.category_en}
          onChange={handleChange}
          className={`form-control ${errors[isArabic ? 'category_ar' : 'category_en'] ? 'is-invalid' : ''}`}
        >
          <option value="">{t('Select Category')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{t(cat)}</option>
          ))}
        </select>
        {errors[isArabic ? 'category_ar' : 'category_en'] && (
          <div className="invalid-feedback d-block">
            {errors[isArabic ? 'category_ar' : 'category_en']}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="form-group mb-3">
        <label><strong>{t('Date')}</strong></label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
        />
        {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
      </div>

      {/* Price */}
      <div className="form-group mb-3">
        <label><strong>{t('Price')}</strong></label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
        />
        {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
      </div>

      {/* Language Choice Buttons */}
      {mode === 'create' && (
        <div className="form-group mb-4">
          <label><strong>{t('Add the other language manually or auto-translate using AI?')}</strong></label>
          <div className="d-flex gap-2 mt-2">
            <Button
              variant={addOtherLang === 'manual' ? 'primary' : 'outline-primary'}
                  type="button"
                  onClick={handleManualTranslate}
                >
                  {t('Add Manually')}
                </Button>

                <Button
                  variant={addOtherLang === 'auto' ? 'primary' : 'outline-primary'}
                  type="button"
                  onClick={handleAutoTranslate}
                >
                  {t('AI Translate')}
                </Button>

          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="d-flex justify-content-center mt-4">
        <Button type="submit" style={{ minWidth: '200px' }}>
          {mode === 'create' ? t('Create Event') : t('Save Changes')}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
