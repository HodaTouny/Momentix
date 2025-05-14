import React, { useState } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'email') {
      setEmailValid(validateEmail(value));
    }
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showErrorToast(t('Please enter a valid email address.'));
      setEmailValid(false);
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      showSuccessToast(t('Login successful!'));
      navigate('/');
    } catch (err) {
      showErrorToast(err.response?.data?.message || t('Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ color: currentTheme.textPrimary }}>
      <h2 className="text-center mb-4">{t('Login')}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">{t('Email')}</label>
          <input
            type="email"
            className={`form-control ${!emailValid ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary }}
          />
          {!emailValid && (
            <div className="invalid-feedback">
              {t('Please enter a valid email address.')}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">{t('Password')}</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary }}
          />
        </div>

        <div className="d-grid">
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner small /> : t('Login')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
