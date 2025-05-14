import React, { useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validateName = (name) => {
    const pattern = /^[A-Za-z\s]+$/; 
    return pattern.test(name);
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return pattern.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : t('Invalid email format.')
      }));
    }

    if (name === 'name') {
      setErrors(prev => ({
        ...prev,
        name: validateName(value) ? '' : t('Name must contain only letters and spaces.')
      }));
    }

    if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value) ? '' : t('Password must be at least 8 characters, and include upper, lower, number and special character.')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = {};

    if (!validateName(formData.name)) {
      currentErrors.name = t('Name must contain only letters and spaces.');
    }
    if (!validateEmail(formData.email)) {
      currentErrors.email = t('Invalid email format.');
    }
    if (!validatePassword(formData.password)) {
      currentErrors.password = t('Password must be at least 8 characters, and include upper, lower, number and special character.');
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      showErrorToast(t('Please fix the errors before submitting.'));
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      showSuccessToast(t('Registration successful! Redirecting to login...'));
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      showErrorToast(err.response?.data?.message || t('Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ color: currentTheme.textPrimary }}>
      <h2 className="text-center mb-4">{t('Register')}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">{t('Name')}</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary }}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">{t('Email')}</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary }}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{t('Password')}</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary }}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="d-grid">
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner small /> : t('Register')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
