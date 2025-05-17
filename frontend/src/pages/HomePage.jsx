import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import eventsService from '../services/eventService';
import bookingsService from '../services/bookingService';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';
import EventCard from '../components/eventCard/eventCard';
import HeroComponent from '../components/hero/Hero';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';

const HomePage = () => {
  const { currentTheme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState(['date_DESC']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [eventToDelete, setEventToDelete] = useState(null);

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isArabic = i18n.language === 'ar';
  const pageSize = isAdmin ? 9 : 6;

  const categories = [
    { key: 'Technical', label_en: 'Technical', label_ar: 'تقني' },
    { key: 'Music', label_en: 'Music', label_ar: 'موسيقى' },
    { key: 'Business', label_en: 'Business', label_ar: 'أعمال' },
    { key: 'Education', label_en: 'Education', label_ar: 'تعليم' },
    { key: 'Health', label_en: 'Health', label_ar: 'صحة' },
    { key: 'Sports', label_en: 'Sports', label_ar: 'رياضة' },
    { key: 'Art', label_en: 'Art', label_ar: 'فن' },
    { key: 'Food', label_en: 'Food', label_ar: 'طعام' },
    { key: 'Other', label_en: 'Other', label_ar: 'اخرى' },
  ];

  const { data: bookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsService.getAllBookings,
    enabled: !!user && !isAdmin,
  });

  const { data: eventsData, isLoading, error, isFetching } = useQuery({
  queryKey: ['events', page, orderBy, selectedCategory, selectedStatus],
  queryFn: () => {
    const categoryValue =
      selectedCategory !== 'all'
        ? (() => {
            const found = categories.find((cat) => cat.key === selectedCategory);
            return found ? (isArabic ? found.label_ar : found.label_en) : undefined;
          })()
        : undefined;

    const statusValue = selectedStatus !== 'all' ? selectedStatus : undefined;

    return eventsService.getAllEvents(page, pageSize, orderBy, categoryValue, statusValue);
  },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  const bookedEventIds = bookings?.map((b) => b.event_id) || [];
  const events = eventsData?.data || [];
  const totalEvents = eventsData?.total || 0;
  const totalPages = Math.ceil(totalEvents / pageSize);

  const bookingMutation = useMutation({
    mutationFn: bookingsService.bookEvent,
    onSuccess: async () => {
      await refetchBookings();
      navigate('/booking-confirmation');
    },
    onError: () => {
      showErrorToast('Failed to book event');
    },
  });

  const deleteMutation = useMutation({
  mutationFn: eventsService.deleteEvent,
  onSuccess: async (data) => {
    showSuccessToast(data.message || 'Event deleted successfully');
    await queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === 'events',
    });
  },
  onError: () => {
    showErrorToast('Failed to delete event');
  },
});


  const handleDelete = (eventId) => {
    if (!isAdmin) return;
    setEventToDelete(eventId);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete);
      setEventToDelete(null);
    }
  };

  const handleBook = (eventId) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    bookingMutation.mutate(eventId);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value === 'newest' ? ['date_DESC'] : ['date_ASC']);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  if (isLoading || deleteMutation.isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container py-5 text-center" style={{ color: 'red' }}>
        {t('Error loading events')}
      </div>
    );
  }

  return (
    <div>
      {!isAdmin && <HeroComponent />}
      <div id="events">
        {/* Filters */}
        <div className="container py-4 d-flex flex-wrap gap-3 justify-content-end" style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          <select onChange={handleOrderChange} value={orderBy[0] === 'date_DESC' ? 'newest' : 'oldest'}
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary, border: `1px solid ${currentTheme.borderColor}`, padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <option value="newest">{t('Newest First')}</option>
            <option value="oldest">{t('Oldest First')}</option>
          </select>

          <select onChange={handleCategoryChange} value={selectedCategory}
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary, border: `1px solid ${currentTheme.borderColor}`, padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <option value="all">{isArabic ? 'كل الفئات' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {isArabic ? cat.label_ar : cat.label_en}
              </option>
            ))}
          </select>

          <select onChange={handleStatusChange} value={selectedStatus}
            style={{ backgroundColor: currentTheme.cardBackground, color: currentTheme.textPrimary, border: `1px solid ${currentTheme.borderColor}`, padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <option value="all">{t('All Events')}</option>
            <option value="inactive">{t('Expired')}</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="container py-3">
          <div className="row">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.event_id} className="col-md-4 mb-4 d-flex">
                  <EventCard
                    event={event}
                    onBook={handleBook}
                    onDelete={handleDelete}
                    isBooked={bookedEventIds.includes(event.event_id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <h4>{t('No events found')}</h4>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="container py-4 d-flex justify-content-between align-items-center">
          <Button variant="secondary" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || isFetching}>
            {t('Previous')}
          </Button>
          <span style={{ color: currentTheme.textPrimary }}>
            {t('Page')} {page} {t('of')} {totalPages}
          </span>
          <Button onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))} disabled={page === totalPages || isFetching}>
            {t('Next')}
          </Button>
        </div>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          show={!!eventToDelete}
          onClose={() => setEventToDelete(null)}
          onConfirm={handleConfirmDelete}
          title={t('Delete Event')}
          message={t('Are you sure you want to delete this event?')}
        />
      </div>
    </div>
  );
};

export default HomePage;
