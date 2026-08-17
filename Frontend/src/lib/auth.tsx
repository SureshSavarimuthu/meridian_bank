import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { currentUser, mockUsers } from '@/lib/mockData';
import { apiCall } from '@/services/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === undefined;

export type UserRole =
  | 'CUSTOMER'
  | 'BRANCH_MANAGER'
  | 'REGIONAL_MANAGER'
  | 'ZONAL_MANAGER'
  | 'CIRCLE_HEAD'
  | 'GENERAL_MANAGER'
  | 'LOAN_OFFICER'
  | 'TELLER'
  | 'CSO'
  | 'SYSTEM_ADMIN';

export type Permission =
  | 'ACCOUNT_VIEW'
  | 'ACCOUNT_CREATE'
  | 'ACCOUNT_UPDATE'
  | 'FD_CREATE'
  | 'FD_VIEW'
  | 'FD_RENEW'
  | 'FD_WITHDRAW'
  | 'RD_CREATE'
  | 'RD_VIEW'
  | 'RD_PAY_INSTALLMENT'
  | 'LOAN_APPLY'
  | 'LOAN_APPROVE'
  | 'LOAN_REJECT'
  | 'TRANSACTION_INITIATE'
  | 'TRANSACTION_APPROVE'
  | 'TRANSACTION_REVERSE'
  | 'CARD_APPLY'
  | 'CARD_BLOCK'
  | 'DOCUMENT_VERIFY'
  | 'RISK_ASSESS'
  | 'DISBURSE'
  | 'ADMIN_CONFIG';

export interface User {
  id: string;
  customerId?: string;
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  roles: UserRole[];
  permissions: Permission[];
  branchId?: string;
  regionId?: string;
  zoneId?: string;
  circleId?: string;
  lastLogin?: string;
  profileImage?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (userId: string, password: string, loginType: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  refreshToken: () => Promise<void>;
  register: (username: string, password: string, email: string, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function mapApiUser(apiUser: Record<string, unknown>): User {
  return {
    id: apiUser.id as string,
    userId: apiUser.username as string,
    fullName: (apiUser.username as string).replace('.', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    email: (apiUser.email as string) || '',
    mobile: '',
    roles: (apiUser.roles as string[]) as UserRole[],
    permissions: (apiUser.permissions as string[]) as Permission[],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const initializeAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuth(true);
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => { initializeAuth(); }, [initializeAuth]);

  const login = useCallback(
    async (userId: string, password: string, loginType: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => {
      setLoading(true);
      try {
        if (USE_MOCK) {
          let mockUser: User | null = null;
          for (const u of Object.values(mockUsers)) {
            if (u.userId === userId) { mockUser = u; break; }
          }
          if (!mockUser) {
            mockUser = {
              ...currentUser,
              userId,
              roles: loginType === 'CUSTOMER' ? ['CUSTOMER'] : loginType === 'ADMIN' ? ['SYSTEM_ADMIN'] : ['LOAN_OFFICER'],
            };
          }
          mockUser.lastLogin = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short', hour12: true });
          localStorage.setItem('accessToken', 'mock-jwt-token');
          localStorage.setItem('refreshToken', 'mock-refresh-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          setAuth(true);
        } else {
          const response: Record<string, unknown> = await apiCall('/auth/login', 'POST', {
            username: userId,
            password,
            loginType,
          });
          const data = response.data as Record<string, unknown>;
          const apiUser = data.user as Record<string, unknown>;
          localStorage.setItem('accessToken', data.accessToken as string);
          localStorage.setItem('refreshToken', data.refreshToken as string);
          const mappedUser = mapApiUser(apiUser);
          mappedUser.lastLogin = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short', hour12: true });
          localStorage.setItem('user', JSON.stringify(mappedUser));
          setUser(mappedUser);
          setAuth(true);
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (username: string, password: string, email: string, role?: string) => {
      setLoading(true);
      try {
        if (USE_MOCK) {
          const newUser: User = {
            id: crypto.randomUUID(),
            userId: username,
            fullName: username.replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            email,
            mobile: '',
            roles: [((role || 'CUSTOMER') as UserRole)],
            permissions: [] as Permission[],
          };
          localStorage.setItem('accessToken', 'mock-jwt-token');
          localStorage.setItem('refreshToken', 'mock-refresh-token');
          localStorage.setItem('user', JSON.stringify(newUser));
          setUser(newUser);
          setAuth(true);
        } else {
          const response: Record<string, unknown> = await apiCall('/auth/register', 'POST', {
            username,
            password,
            email,
            role,
          });
          const data = response.data as Record<string, unknown>;
          const apiUser = data.user as Record<string, unknown>;
          localStorage.setItem('accessToken', data.accessToken as string);
          localStorage.setItem('refreshToken', data.refreshToken as string);
          const mappedUser = mapApiUser(apiUser);
          localStorage.setItem('user', JSON.stringify(mappedUser));
          setUser(mappedUser);
          setAuth(true);
        }
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      localStorage.clear();
      setUser(null);
      setAuth(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: Permission): boolean => user?.permissions.includes(permission) ?? false,
    [user]
  );

  const hasRole = useCallback(
    (role: UserRole): boolean => user?.roles.includes(role) ?? false,
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => roles.some((role) => user?.roles.includes(role) ?? false),
    [user]
  );

  const refreshToken = useCallback(async () => {
    try {
      const rt = localStorage.getItem('refreshToken');
      if (!rt) { await logout(); return; }
      if (!USE_MOCK) {
        const response: Record<string, unknown> = await apiCall('/auth/refresh-token', 'POST', { refreshToken: rt });
        const data = response.data as Record<string, unknown>;
        localStorage.setItem('accessToken', data.accessToken as string);
        localStorage.setItem('refreshToken', data.refreshToken as string);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, logout, hasPermission, hasRole, hasAnyRole, refreshToken, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
