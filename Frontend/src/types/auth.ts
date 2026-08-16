// Auth Types
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

export interface AuthResponse {
  status: 'SUCCESS' | 'ERROR';
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    requiresTwoFactor: boolean;
    twoFactorId?: string;
    twoFactorMethods?: string[];
    user: User;
  };
}

export interface LoginRequest {
  userId: string;
  password: string;
  loginType: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
  captchaToken?: string;
  deviceInfo?: {
    deviceId: string;
    deviceType: 'MOBILE' | 'WEB' | 'TABLET';
    browser: string;
    os: string;
    ipAddress: string;
  };
}

export interface TwoFactorVerificationRequest {
  twoFactorId: string;
  otp: string;
  method: 'SMS' | 'EMAIL' | 'AUTHENTICATOR';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  verify2FA: (data: TwoFactorVerificationRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  refreshToken: () => Promise<void>;
}
