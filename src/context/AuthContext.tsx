import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { STORAGE_KEYS } from '@/utils/constants';
import type { LoginPayload, Role, SignupPayload, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  getDefaultRoute: (role?: Role | null) => string;
  updateUser: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const roleRouteMap: Record<Role, string> = {
  PATIENT: '/app/patient/dashboard',
  DOCTOR: '/app/doctor/dashboard',
  ADMIN: '/app/admin',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }

    setIsLoading(false);
  }, []);

  const persistAuth = (nextUser: User, nextToken: string, refreshToken?: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  };

  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    persistAuth(response.user, response.tokens.accessToken, response.tokens.refreshToken);
  };

  const signup = async (payload: SignupPayload) => {
    const response = await authService.signup(payload);
    persistAuth(response.user, response.tokens.accessToken, response.tokens.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const updateUser = (fields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...fields };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      signup,
      logout,
      getDefaultRoute: (role) => (role ? roleRouteMap[role] : '/login'),
      updateUser,
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

