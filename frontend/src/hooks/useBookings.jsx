import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bookingsService from '../services/bookingService';

export const useBookings = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsService.getAllBookings,
    enabled: false, 
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createBooking = useMutation({
    mutationFn: bookingsService.bookEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return {
    bookings: data || [],
    createBooking,
    isLoading,
    error,
    refetch,
  };
};
