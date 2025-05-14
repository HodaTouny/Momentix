import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';  
import { useDarkMode } from '../../contexts/DarkModeContext'; 

const LanguageSwitcher = () => {
const { t, i18n } = useTranslation();
  const { currentTheme } = useDarkMode(); 
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng) => {
    localStorage.setItem('language', lng);
    i18n.changeLanguage(lng);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        onClick={toggleDropdown}
        style={{
          backgroundColor: 'transparent',
          color: currentTheme.primary,
          border: `1px solid ${currentTheme.primary}`,
          padding: '6px 12px',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = currentTheme.primaryHover;
            e.target.style.color = currentTheme.buttonText;
          }}

        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = currentTheme.primary;
        }}

      >
        {t('Language')}
        <span style={{ fontSize: '0.7rem' }}>▼</span> {/* small triangle */}
      </button>

      <ul className={`dropdown-menu ${open ? 'show' : ''}`}>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
        </li>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => changeLanguage('ar')}
          >
            العربية
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
