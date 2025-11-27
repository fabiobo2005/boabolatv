import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, LoginCredentials, AuthToken } from '../types/auth';

// Mock users for local simulation
const mockUsers: Array<User & { password: string }> = [
  { id: '1', email: 'admin@boabolatv.com', password: 'admin123', name: 'Admin', role: 'ADMIN' },
  { id: '2', email: 'presenter@boabolatv.com', password: 'presenter123', name: 'Apresentador', role: 'PRESENTER' },
  { id: '3', email: 'subscriber@boabolatv.com', password: 'subscriber123', name: 'Assinante', role: 'SUBSCRIBER' },
  { id: '4', email: 'user@boabolatv.com', password: 'user123', name: 'Usuário', role: 'USER' },
];

// Helper to generate mock token (simulates JWT)
const generateMockToken = (userId: string): AuthToken => {
  const now = Date.now();
  const expiresIn = 3600; // 1 hour in seconds
  return {
    accessToken: `mock_access_token_${userId}_${now}`,
    refreshToken: `mock_refresh_token_${userId}_${now}`,
    expiresIn,
    expiresAt: now + expiresIn * 1000,
    tokenType: 'Bearer',
  };
};

export interface AuthStore {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  clearError: () => void;
  clearSuccessMessage: () => void;
  isTokenExpired: () => boolean;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      successMessage: null,

      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null, successMessage: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundUser = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (foundUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = foundUser;
          const token = generateMockToken(foundUser.id);
          set({ 
            user: userWithoutPassword, 
            token,
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            successMessage: 'Login realizado com sucesso!',
          });
          return true;
        }

        set({ 
          user: null,
          token: null,
          isAuthenticated: false, 
          isLoading: false,
          error: 'E-mail ou senha inválidos',
          successMessage: null,
        });
        return false;
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          error: null,
          successMessage: null,
        });
      },

      hasRole: (requiredRoles: UserRole[]): boolean => {
        const { user } = get();
        if (!user) return false;
        return requiredRoles.includes(user.role);
      },

      clearError: () => {
        set({ error: null });
      },

      clearSuccessMessage: () => {
        set({ successMessage: null });
      },

      isTokenExpired: (): boolean => {
        const { token } = get();
        if (!token) return true;
        return Date.now() > token.expiresAt;
      },

      getAccessToken: (): string | null => {
        const { token } = get();
        if (!token || get().isTokenExpired()) return null;
        return token.accessToken;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
