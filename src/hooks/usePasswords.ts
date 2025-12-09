/**
 * React Query hooks for password management
 * Provides easy-to-use hooks with caching and state management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { passwordService, CreatePasswordData, UpdatePasswordData } from '@/services/passwordService';
import { showNotification } from '@/hooks/use-notification';

/**
 * Hook to get all passwords across all vaults
 */
export function usePasswords() {
  return useQuery({
    queryKey: ['passwords'],
    queryFn: () => passwordService.getAll(),
  });
}

/**
 * Hook to get a single password
 */
export function usePassword(id: string) {
  return useQuery({
    queryKey: ['passwords', id],
    queryFn: () => passwordService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a password
 */
export function useCreatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePasswordData) => passwordService.create(data),
    onSuccess: () => {
      // Invalidate and refetch passwords
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      
      showNotification({
        title: 'Password saved',
        description: 'Your password has been securely stored.',
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: 'Failed to save password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a password
 */
export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePasswordData }) =>
      passwordService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific password and list
      queryClient.invalidateQueries({ queryKey: ['passwords', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      
      showNotification({
        title: 'Password updated',
        description: 'Your password has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: 'Failed to update password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a password
 */
export function useDeletePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => passwordService.delete(id),
    onSuccess: () => {
      // Invalidate passwords list
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      
      showNotification({
        title: 'Password deleted',
        description: 'The password has been removed from your vault.',
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: 'Failed to delete password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to search passwords
 * TODO: Implement search functionality in passwordService
 */
// export function useSearchPasswords(vaultId: string, query: string) {
//   return useQuery({
//     queryKey: ['passwords', vaultId, 'search', query],
//     queryFn: () => passwordService.search(vaultId, query),
//     enabled: query.length > 0 && !!vaultId,
//   });
// }

/**
 * Hook to get favorite passwords
 * TODO: Implement favorites functionality in passwordService
 */
// export function useFavoritePasswords(vaultId: string) {
//   return useQuery({
//     queryKey: ['passwords', vaultId, 'favorites'],
//     queryFn: () => passwordService.getFavorites(vaultId),
//     enabled: !!vaultId,
//   });
// }
