import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useTranslation } from 'react-i18next'; 
import Image from '../../assests/Hero.png';
import './HeroComponent.css'; 

const HeroComponent = () => {
  const { currentTheme } = useDarkMode();
  const { t, i18n } = useTranslation(); 

  const isArabic = i18n.language === 'ar'; 

  return (
    <section 
      className="hero-section" 
      style={{
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.textPrimary,
        direction: isArabic ? 'rtl' : 'ltr', 
        textAlign: isArabic ? 'right' : 'left'
      }}
    >
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-5">
        
        <div className="hero-text">
          <h1 className="hero-title">
            {t('Your Moments, Mastered — Welcome to Momentix')}
          </h1>

          <p 
            className="hero-subtitle" 
            style={{ color: currentTheme.textSecondary }}
          >
            {t('Plan, book, and celebrate unforgettable events — all in one place.')}
          </p>

         <a href="#events" style={{ textDecoration: 'none' }}>
            <Button>
              {t('Explore Events')}
            </Button>
          </a>
        </div>

        <div className="hero-image">
          <img 
            src={Image}
            alt="Event booking illustration"
            className="hero-img"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroComponent;
