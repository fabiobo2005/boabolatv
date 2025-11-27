export type UserRole = 'VISITOR' | 'USER' | 'PRESENTER' | 'SUBSCRIBER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
  tokenType: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for future API integration
export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<{ user: User; token: AuthToken }>;
  logout: () => Promise<void>;
  refreshToken: (refreshToken: string) => Promise<AuthToken>;
  getCurrentUser: () => Promise<User>;
}
