import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
};
