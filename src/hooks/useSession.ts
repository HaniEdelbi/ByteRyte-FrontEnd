import { useQuery } from '@tanstack/react-query';
import { sessionService, Session } from '../services/sessionService';

/**
 * Hook to fetch active sessions for the current user
 */
export const useActiveSessions = () => {
  return useQuery<Session[], Error>({
    queryKey: ['sessions'],
    queryFn: sessionService.getSessions,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};
