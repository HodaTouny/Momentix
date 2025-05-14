import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventsService from '../services/eventService';

export const useEvents = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsService.getAllEvents(),
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });

  const createEvent = useMutation({
    mutationFn: eventsService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, formData }) => eventsService.updateEvent(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: eventsService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
