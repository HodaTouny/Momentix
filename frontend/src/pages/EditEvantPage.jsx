import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventsService from '../services/eventService';
import EventForm from '../components/eventForm/EventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '../components/common/ToastAlert';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsService.getEventById(eventId),
  });

  const mutation = useMutation({
    mutationFn: ({ id, updatedData }) => eventsService.updateEvent(id, updatedData),
    onSuccess: async () => {
      showSuccessToast('Event created successfully');

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.refetchQueries({
        queryKey: ['events', 1],
        exact: false,
      });
      navigate('/'); 
    },
    onError: (error) => {
      console.error(error);
      showErrorToast('Failed to update event');
    },
  });

  const handleEdit = (formData) => {
    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    mutation.mutate({ id: eventId, updatedData });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !eventData)
    return <p style={{ textAlign: 'center', color: 'red' }}>Error loading event details.</p>;

  return (
    <div className="container py-5">
      <h2>Edit Event</h2>
      <EventForm mode="edit" initialValues={eventData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditEventPage;
