import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, LoginCredentials } from '../types/auth';

// Mock users for local simulation
const mockUsers: Array<User & { password: string }> = [
  { id: '1', email: 'admin@boabolatv.com', password: 'admin123', name: 'Admin', role: 'ADMIN' },
  { id: '2', email: 'presenter@boabolatv.com', password: 'presenter123', name: 'Apresentador', role: 'PRESENTER' },
  { id: '3', email: 'subscriber@boabolatv.com', password: 'subscriber123', name: 'Assinante', role: 'SUBSCRIBER' },
  { id: '4', email: 'user@boabolatv.com', password: 'user123', name: 'Usuário', role: 'USER' },
];

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (requiredRoles: UserRole[]) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundUser = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (foundUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = foundUser;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return true;
        }

        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: 'E-mail ou senha inválidos' 
        });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      hasRole: (requiredRoles: UserRole[]): boolean => {
        const { user } = get();
        if (!user) return false;
        return requiredRoles.includes(user.role);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
