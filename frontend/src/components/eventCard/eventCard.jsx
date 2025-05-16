import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import imageNotFound from '../../assests/imageNotFound.jpg';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EventCard = ({ event, onBook, isBooked, onDelete }) => {
  const { currentTheme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isArabic = i18n.language === 'ar';
  const title = isArabic ? event.title_ar : event.title_en;
  const venue = isArabic ? event.venue_ar : event.venue_en;
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isActive = event.status.toLowerCase() === 'active';

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-event/${event.event_id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(event.event_id);
  };

  const handleCardClick = () => {
    navigate(`/event/${event.event_id}`);
  };

  return (
    <div
      className="event-card"
      onClick={handleCardClick}
      style={{
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.textPrimary,
        border: `1px solid ${currentTheme.borderColor}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '400px',
        direction: isArabic ? 'rtl' : 'ltr',
        cursor: 'pointer',
      }}
    >
      <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
        <img
          src={event.image || imageNotFound}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          padding: '1rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h5 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{title}</h5>
          <p style={{ color: currentTheme.textSecondary, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p style={{ color: currentTheme.textSecondary, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            {venue}
          </p>
          <p style={{ fontWeight: '600', marginBottom: '1rem' }}>EGP {event.price}</p>
        </div>

        {isAdmin ? (
          <div className="d-flex justify-content-end gap-3" onClick={(e) => e.stopPropagation()}>
            <FaEdit
              onClick={handleEdit}
              style={{ cursor: 'pointer', fontSize: '2rem', color: currentTheme.primary }}
              title={t('Edit')}
            />
            <FaTrash
              onClick={handleDeleteClick}
              style={{ cursor: 'pointer', fontSize: '2rem', color: currentTheme.primary }}
              title={t('Delete')}
            />
          </div>
        ) : isBooked ? (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: currentTheme.primaryHover,
              color: currentTheme.buttonText,
              padding: '0.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {t('Booked')}
          </div>
        ) : isActive ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onBook(event.event_id);
            }}
          >
                {t('Book Now')}
          </Button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: currentTheme.primaryHover,
              color: currentTheme.buttonText,
              padding: '0.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {t('Expired')}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
