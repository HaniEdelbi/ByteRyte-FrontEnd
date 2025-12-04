/**
 * React Query hooks for authentication
 * Provides easy-to-use hooks with caching and state management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/services/authService';
import { showNotification } from '@/hooks/use-notification';

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      // Only check if authenticated, don't fetch from backend
      const isAuth = authService.isAuthenticated();
      
      if (!isAuth) {
        return null;
      }
      
      // Try to get user from localStorage if available
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }
      
      return null;
    },
    retry: false,
    staleTime: Infinity, // User data doesn't change unless they logout/login
  });
}

/**
 * Hook to login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Update user cache immediately - this will trigger re-renders
      queryClient.setQueryData(['user', 'current'], data.user);
      
      showNotification({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to register
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Update user cache immediately - this will trigger re-renders
      queryClient.setQueryData(['user', 'current'], data.user);
      
      showNotification({
        title: 'Welcome to ByteRyte!',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error: Error) => {
      showNotification({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear user from localStorage
      localStorage.removeItem('currentUser');
      
      // Clear all cached data
      queryClient.clear();
      
      showNotification({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
    onError: () => {
      // Even on error, clear local data
      localStorage.removeItem('currentUser');
      queryClient.clear();
      
      showNotification({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
  });
}
