import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated by looking for authToken
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
}
