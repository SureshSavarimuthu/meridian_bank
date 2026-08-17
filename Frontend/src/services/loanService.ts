import { apiCall } from './api';

export interface LoanApplicationRequest {
  customerId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenure: number;
  purpose?: string;
  collateralType?: string;
  collateralDetails?: string;
}

export interface LoanDecisionRequest {
  loanId: string;
  decision: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  approvedAmount?: number;
  approvedInterestRate?: number;
}

export interface LoanResponse {
  id: string;
  loanNumber: string;
  customerId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyEmi: number;
  outstandingAmount: number;
  status: string;
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  purpose?: string;
  collateralType?: string;
  rejectionReason?: string;
  approvedBy?: string;
  repaymentSchedule?: RepaymentEntry[];
}

export interface RepaymentEntry {
  id: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  principalComponent: number;
  interestComponent: number;
  penaltyAmount: number;
  status: string;
}

export interface LoanStats {
  pending: number;
  approved: number;
  disbursed: number;
}

export const loanService = {
  apply: (data: LoanApplicationRequest) =>
    apiCall<LoanResponse>('/loans/apply', 'POST', data),

  getByCustomer: (customerId: string) =>
    apiCall<LoanResponse[]>(`/loans/customer/${customerId}`),

  getById: (loanId: string) =>
    apiCall<LoanResponse>(`/loans/${loanId}`),

  getByNumber: (loanNumber: string) =>
    apiCall<LoanResponse>(`/loans/number/${loanNumber}`),

  getPending: () =>
    apiCall<LoanResponse[]>('/loans/pending'),

  getByStatus: (status: string) =>
    apiCall<LoanResponse[]>(`/loans/status/${status}`),

  decide: (data: LoanDecisionRequest) =>
    apiCall<LoanResponse>('/loans/decide', 'POST', data),

  disburse: (loanId: string) =>
    apiCall<LoanResponse>(`/loans/${loanId}/disburse`, 'POST'),

  close: (loanId: string) =>
    apiCall<LoanResponse>(`/loans/${loanId}/close`, 'POST'),

  getStats: () =>
    apiCall<LoanStats>('/loans/stats'),
};
