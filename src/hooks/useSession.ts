import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService, Session, Device } from '../services/sessionService';

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

/**
 * Hook to fetch all devices for the current user
 */
export const useDevices = () => {
  return useQuery<Device[], Error>({
    queryKey: ['devices'],
    queryFn: sessionService.getDevices,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

/**
 * Hook to revoke a device
 */
export const useRevokeDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deviceId: string) => sessionService.revokeDevice(deviceId),
    onSuccess: () => {
      // Invalidate devices query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
