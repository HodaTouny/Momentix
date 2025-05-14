import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import bookingsService from '../services/bookingService';
import eventsService from '../services/eventService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';
import imageNotFound from '../assests/imageNotFound.jpg';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const { currentTheme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsService.getEventById(eventId),
  });

  const deleteMutation = useMutation({
    mutationFn: eventsService.deleteEvent,
    onSuccess: (data) => {
      showSuccessToast(data.message || 'Event deleted successfully');
      setShowConfirm(false);
      navigate('/');
    },
    onError: () => {
      showErrorToast('Failed to delete event');
      setDeleting(false);
    },
  });

  const isArabic = i18n.language === 'ar';

  if (isLoading) return <LoadingSpinner />;
  if (error || !event) return <p style={{ textAlign: 'center', color: 'red' }}>{t('Error loading event')}</p>;

  const title = isArabic ? event.title_ar : event.title_en;
  const description = isArabic ? event.description_ar : event.description_en;
  const category = isArabic ? event.category_ar : event.category_en;
  const venue = isArabic ? event.venue_ar : event.venue_en;

  const handleBook = async () => {
    try {
      await bookingsService.bookEvent(event.event_id);
      navigate('/booking-confirmation');
    } catch (err) {
      showErrorToast(t('Booking failed') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${event.event_id}`);
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setDeleting(true);
    deleteMutation.mutate(event.event_id);
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div
      className="container py-5"
      style={{
        color: currentTheme.textPrimary,
        minHeight: '100vh',
        backgroundColor: currentTheme.background,
        padding: '2rem 1rem',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <div
        className="row justify-content-center"
        style={{
          backgroundColor: currentTheme.cardBackground,
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div className="col-12 text-center p-4">
          <img
            src={event.image || imageNotFound}
            alt={title}
            style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-12 px-5 pb-5">
          <div className="form-group mb-3">
            <label><strong>{t('Title')}</strong></label>
            <input type="text" value={title} disabled className="form-control" />
          </div>

          <div className="form-group mb-3">
            <label><strong>{t('Description')}</strong></label>
            <textarea
              value={description}
              disabled
              className="form-control"
              rows="4"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group mb-3">
            <label><strong>{t('Category')}</strong></label>
            <input type="text" value={category} disabled className="form-control" />
          </div>

          <div className="form-group mb-3">
            <label><strong>{t('Date')}</strong></label>
            <input type="text" value={new Date(event.date).toLocaleDateString()} disabled className="form-control" />
          </div>

          <div className="form-group mb-3">
            <label><strong>{t('Venue')}</strong></label>
            <input type="text" value={venue} disabled className="form-control" />
          </div>

          <div className="form-group mb-4">
            <label><strong>{t('Price')}</strong></label>
            <input type="text" value={`$${event.price}`} disabled className="form-control" />
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3">
            {isAdmin ? (
              <>
                <Button variant="primary" onClick={handleEdit}>
                  {t('Edit Event')}
                </Button>
                <Button variant="danger" onClick={handleDeleteClick} disabled={deleting}>
                  {deleting ? t('Deleting...') : t('Delete Event')}
                </Button>
              </>
            ) : (
              <Button style={{ minWidth: '200px' }} onClick={handleBook}>
                {t('Book Now')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title={t('Delete Event?')}
        message={t('Are you sure you want to delete this event?')}
      />
    </div>
  );
};

export default EventDetailsPage;
