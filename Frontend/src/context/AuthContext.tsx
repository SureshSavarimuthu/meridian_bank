import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  User, 
  AuthContextType, 
  LoginRequest, 
  TwoFactorVerificationRequest,
  Permission,
  UserRole,
  AuthResponse 
} from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth from localStorage/session
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response: AuthResponse = await authService.login(credentials);
      
      if (response.status === 'SUCCESS') {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('tokenType', response.data.tokenType);
        localStorage.setItem('expiresIn', String(response.data.expiresIn));
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        
        // Check if 2FA is required
        if (response.data.requiresTwoFactor) {
          setIsAuthenticated(false); // User needs to verify 2FA first
          return;
        }
        
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const verify2FA = useCallback(async (data: TwoFactorVerificationRequest) => {
    setLoading(true);
    try {
      const response = await authService.verify2FA(data);
      
      if (response.status === 'SUCCESS') {
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('2FA verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((role: UserRole): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  }, [user]);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        await logout();
        return;
      }

      const response = await authService.refreshToken(token);
      if (response.status === 'SUCCESS') {
        localStorage.setItem('accessToken', response.data.accessToken);
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    verify2FA,
    logout,
    hasPermission,
    hasRole,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
