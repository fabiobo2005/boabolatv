import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../hooks';
import type { UserRole } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
}

/**
 * AuthGuard component for protecting routes.
 * 
 * Features:
 * - Redirects unauthenticated users to login page
 * - Redirects unauthorized users (wrong role) to a fallback page
 * - Shows loading state while checking authentication
 * - Preserves the original location for redirect after login
 * 
 * @example
 * ```tsx
 * // Basic authentication check
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * 
 * // With role requirements
 * <AuthGuard requiredRoles={['ADMIN', 'PRESENTER']}>
 *   <AdminContent />
 * </AuthGuard>
 * 
 * // Custom redirects
 * <AuthGuard 
 *   requiredRoles={['SUBSCRIBER']} 
 *   redirectTo="/signin" 
 *   unauthorizedRedirectTo="/upgrade"
 * >
 *   <SubscriberContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  requiredRoles,
  redirectTo = '/login',
  unauthorizedRedirectTo = '/',
}: AuthGuardProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
