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
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    requiresTwoFactor: boolean;
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
      permissions: string[];
    };
  };
}
