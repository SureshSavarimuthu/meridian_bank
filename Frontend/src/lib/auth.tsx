import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { currentUser, mockUsers } from '@/lib/mockData';

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
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize from localStorage on mount
  const initializeAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuth(true);
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.clear();
      }
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(
    async (userId: string, password: string, loginType: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => {
      setLoading(true);
      try {
        // Mock login - look up user from mockUsers by userId
        let mockUser: User | null = null;

        // Find user by userId in mockUsers
        for (const user of Object.values(mockUsers)) {
          if (user.userId === userId) {
            mockUser = user;
            break;
          }
        }

        // If user not found, create a default user with roles based on loginType
        if (!mockUser) {
          mockUser = {
            ...currentUser,
            userId,
            roles: loginType === 'CUSTOMER' ? ['CUSTOMER'] : loginType === 'ADMIN' ? ['SYSTEM_ADMIN'] : ['LOAN_OFFICER'],
          };
        }

        // Add lastLogin timestamp
        mockUser.lastLogin = new Date().toLocaleString('en-IN', { 
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: true 
        });

        localStorage.setItem('accessToken', 'mock-jwt-token');
        localStorage.setItem('refreshToken', 'mock-refresh-token');
        localStorage.setItem('user', JSON.stringify(mockUser));

        setUser(mockUser);
        setAuth(true);
      } catch (error) {
        console.error('Login failed:', error);
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
      // Mock logout - replace with actual API call
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
    (permission: Permission): boolean => {
      return user?.permissions.includes(permission) ?? false;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.roles.includes(role) ?? false;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.some((role) => user?.roles.includes(role) ?? false);
    },
    [user]
  );

  const refreshToken = useCallback(async () => {
    try {
      // Mock refresh - replace with actual API call
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        await logout();
        return;
      }
      // Token would be refreshed here via API
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
        hasPermission,
        hasRole,
        hasAnyRole,
        refreshToken,
      }}
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
