import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';  

const Footer = () => {
  const { currentTheme } = useDarkMode();
  const { t , i18n} = useTranslation();

  const isArabic = i18n.language === 'ar'; 
  return (
    <footer style={{
      backgroundColor: currentTheme.cardBackground,
      borderTop: `1px solid ${currentTheme.borderColor}`,
      padding: '2rem 0',
      marginTop: '4rem',
      direction: isArabic ? 'rtl' : 'ltr'
    }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        
        {/* Left Side */}
        <div>
          <Link to="/" style={{
            color: currentTheme.textPrimary,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textDecoration: 'none'
          }}>
            Momentix
          </Link>
        </div>

        <div className="d-flex justify-content-center">
          <Link to="/" style={{ color: currentTheme.textSecondary, textDecoration: 'none', fontSize: '0.95rem' }}>
            {t(`Home`)}
          </Link>
        </div>

        <div style={{ color: currentTheme.textSecondary, fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} {t(`Momentix. All rights reserved`)}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
