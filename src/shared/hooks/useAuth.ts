import { useAuthStore } from '../../store';
import type { LoginCredentials, User, UserRole, AuthToken } from '../../types';

export interface UseAuthReturn {
  // State
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  clearError: () => void;
  clearSuccessMessage: () => void;
  
  // Token utilities
  isTokenExpired: () => boolean;
  getAccessToken: () => string | null;
}

/**
 * Custom hook for authentication operations.
 * Provides a clean interface to the auth store with additional utilities.
 * 
 * @example
 * ```tsx
 * const { user, login, logout, hasRole, isAuthenticated } = useAuth();
 * 
 * // Check if user has access
 * if (hasRole(['ADMIN', 'PRESENTER'])) {
 *   // Show admin/presenter content
 * }
 * 
 * // Login
 * const success = await login({ email, password });
 * ```
 */
export function useAuth(): UseAuthReturn {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    login,
    logout,
    hasRole,
    clearError,
    clearSuccessMessage,
    isTokenExpired,
    getAccessToken,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    login,
    logout,
    hasRole,
    clearError,
    clearSuccessMessage,
    isTokenExpired,
    getAccessToken,
  };
}
