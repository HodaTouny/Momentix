import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next'; 
import { Player } from '@lottiefiles/react-lottie-player';
import Button from '../../components/common/Button';
import confettiAnimation from '../../assests/congrats.json';
import './bookingConfirmation.css';


const BookingConfirmationPage = () => {
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
    className="container booking-confirmation-container"
    style={{ color: currentTheme.textPrimary }}
    >
    <Player
      autoplay
      loop
      src={confettiAnimation}
      className="booking-animation"
    />

    <h1 className="booking-message">
      {t('Congratulations! Your booking was successful!')}
    </h1>

    <Button className="booking-button" onClick={() => navigate('/')}>
      {t('Back to Home')}
    </Button>
  </div>

  );
};

export default BookingConfirmationPage;
