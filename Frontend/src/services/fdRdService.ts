import { apiCall } from './api';

export interface FdCreateRequest {
  customerId: string;
  linkedAccountNumber: string;
  fdType: string;
  principal: number;
  tenureDays: number;
  payoutFrequency?: string;
  autoRenew?: boolean;
  nomineeName?: string;
  nomineeRelationship?: string;
}

export interface FdResponse {
  id: string;
  fdNumber: string;
  customerId: string;
  linkedAccountNumber: string;
  fdType: string;
  principal: number;
  interestRate: number;
  tenureDays: number;
  payoutFrequency: string;
  maturityDate: string;
  maturityAmount: number;
  interestEarned: number;
  status: string;
  autoRenew: boolean;
  nomineeName: string;
  openedDate: string;
  closedDate?: string;
}

export interface RdCreateRequest {
  customerId: string;
  linkedAccountNumber: string;
  monthlyAmount: number;
  tenureMonths: number;
  debitDate?: number;
  paymentMode?: string;
  nomineeName?: string;
  nomineeRelationship?: string;
}

export interface RdInstallmentResponse {
  installmentNumber: number;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: string;
}

export interface RdResponse {
  id: string;
  rdNumber: string;
  customerId: string;
  linkedAccountNumber: string;
  monthlyAmount: number;
  interestRate: number;
  tenureMonths: number;
  debitDate: number;
  paymentMode: string;
  totalDeposited: number;
  maturityDate: string;
  maturityAmount: number;
  interestEarned: number;
  status: string;
  installmentsPaid: number;
  nomineeName: string;
  openedDate: string;
  closedDate?: string;
  installments: RdInstallmentResponse[];
}

export interface FdStats {
  active: number;
  matured: number;
}

export interface RdStats {
  active: number;
}

export const fdService = {
  create: (data: FdCreateRequest) =>
    apiCall<FdResponse>('/fd', 'POST', data),

  getByCustomer: (customerId: string) =>
    apiCall<FdResponse[]>(`/fd/customer/${customerId}`),

  getById: (fdId: string) =>
    apiCall<FdResponse>(`/fd/${fdId}`),

  getByNumber: (fdNumber: string) =>
    apiCall<FdResponse>(`/fd/number/${fdNumber}`),

  getByStatus: (status: string) =>
    apiCall<FdResponse[]>(`/fd/status/${status}`),

  withdraw: (fdId: string) =>
    apiCall<FdResponse>(`/fd/${fdId}/withdraw`, 'POST'),

  renew: (fdId: string) =>
    apiCall<FdResponse>(`/fd/${fdId}/renew`, 'POST'),

  getStats: () =>
    apiCall<FdStats>('/fd/stats'),
};

export const rdService = {
  create: (data: RdCreateRequest) =>
    apiCall<RdResponse>('/rd', 'POST', data),

  getByCustomer: (customerId: string) =>
    apiCall<RdResponse[]>(`/rd/customer/${customerId}`),

  getById: (rdId: string) =>
    apiCall<RdResponse>(`/rd/${rdId}`),

  getByNumber: (rdNumber: string) =>
    apiCall<RdResponse>(`/rd/number/${rdNumber}`),

  getByStatus: (status: string) =>
    apiCall<RdResponse[]>(`/rd/status/${status}`),

  payInstallment: (rdId: string) =>
    apiCall<RdResponse>(`/rd/${rdId}/pay`, 'POST'),

  close: (rdId: string) =>
    apiCall<RdResponse>(`/rd/${rdId}/close`, 'POST'),

  getStats: () =>
    apiCall<RdStats>('/rd/stats'),
};
