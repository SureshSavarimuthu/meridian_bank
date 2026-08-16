import { LoginRequest, TwoFactorVerificationRequest, AuthResponse } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Add request/response interceptor
const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown
): Promise<AuthResponse> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 401) {
    // Token expired, attempt refresh
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('accessToken', refreshData.data.accessToken);
          // Retry original request
          headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
          return apiCall(endpoint, method, data);
        } else {
          localStorage.clear();
          window.location.href = '/login';
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
        throw error;
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiCall('/auth/login', 'POST', credentials);
  },

  verify2FA: async (data: TwoFactorVerificationRequest): Promise<AuthResponse> => {
    return apiCall('/auth/verify-2fa', 'POST', data);
  },

  logout: async (refreshToken: string): Promise<AuthResponse> => {
    return apiCall('/auth/logout', 'POST', { refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiCall('/auth/refresh-token', 'POST', { refreshToken });
  },

  resend2FA: async (twoFactorId: string, method: string): Promise<AuthResponse> => {
    return apiCall('/auth/resend-2fa', 'POST', { twoFactorId, method });
  },
};
