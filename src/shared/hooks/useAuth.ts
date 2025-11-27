import { useCallback } from 'react';
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
    login: storeLogin,
    logout: storeLogout,
    hasRole: storeHasRole,
    clearError: storeClearError,
    clearSuccessMessage: storeClearSuccessMessage,
    isTokenExpired: storeIsTokenExpired,
    getAccessToken: storeGetAccessToken,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      return storeLogin(credentials);
    },
    [storeLogin]
  );

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const hasRole = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      return storeHasRole(requiredRoles);
    },
    [storeHasRole]
  );

  const clearError = useCallback(() => {
    storeClearError();
  }, [storeClearError]);

  const clearSuccessMessage = useCallback(() => {
    storeClearSuccessMessage();
  }, [storeClearSuccessMessage]);

  const isTokenExpired = useCallback((): boolean => {
    return storeIsTokenExpired();
  }, [storeIsTokenExpired]);

  const getAccessToken = useCallback((): string | null => {
    return storeGetAccessToken();
  }, [storeGetAccessToken]);

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
