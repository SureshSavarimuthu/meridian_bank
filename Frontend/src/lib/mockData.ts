import type {
  Account, FixedDeposit, RecurringDeposit, Loan, Transaction, BankCard, Beneficiary,
} from './types';
import type { User} from './auth';

// Mock users for different roles
export const mockUsers: Record<string, User> = {
  customer: {
    id: 'USER-CUST-001',
    customerId: 'CUST-2024-001',
    userId: 'john.doe',
    fullName: 'John Doe',
    email: 'john@email.com',
    mobile: '+91 98765 43210',
    roles: ['CUSTOMER'],
    permissions: [
      'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE',
      'FD_CREATE', 'FD_VIEW', 'FD_RENEW', 'FD_WITHDRAW',
      'RD_CREATE', 'RD_VIEW', 'RD_PAY_INSTALLMENT',
      'LOAN_APPLY',
      'TRANSACTION_INITIATE',
      'CARD_APPLY', 'CARD_BLOCK',
    ],
    lastLogin: '13-Aug-2026 · 10:30 AM · Chrome / Windows',
  },
  loanOfficer: {
    id: 'USER-EMP-001',
    userId: 'loan.officer',
    fullName: 'Robert Smith',
    email: 'robert.smith@bank.com',
    mobile: '+91 87654 32109',
    roles: ['LOAN_OFFICER'],
    permissions: [
      'ACCOUNT_VIEW', 'ACCOUNT_CREATE',
      'LOAN_APPLY', 'LOAN_APPROVE',
      'DOCUMENT_VERIFY', 'RISK_ASSESS',
      'TRANSACTION_VIEW',
    ],
    branchId: 'BR-001',
  },
  branchManager: {
    id: 'USER-EMP-002',
    userId: 'branch.manager',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@bank.com',
    mobile: '+91 76543 21098',
    roles: ['BRANCH_MANAGER', 'LOAN_OFFICER'],
    permissions: [
      'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE',
      'FD_CREATE', 'FD_VIEW',
      'RD_CREATE', 'RD_VIEW',
      'LOAN_APPLY', 'LOAN_APPROVE', 'LOAN_REJECT',
      'TRANSACTION_INITIATE', 'TRANSACTION_APPROVE',
      'DOCUMENT_VERIFY', 'RISK_ASSESS', 'DISBURSE',
    ],
    branchId: 'BR-001',
  },
  regionalManager: {
    id: 'USER-EMP-003',
    userId: 'regional.manager',
    fullName: 'David Kumar',
    email: 'david.kumar@bank.com',
    mobile: '+91 65432 10987',
    roles: ['REGIONAL_MANAGER'],
    permissions: [
      'LOAN_APPROVE', 'LOAN_REJECT',
      'TRANSACTION_APPROVE', 'TRANSACTION_REVERSE',
      'RISK_ASSESS', 'DISBURSE',
    ],
    regionId: 'REG-001',
    branchId: 'BR-001',
  },
  admin: {
    id: 'USER-ADMIN-001',
    userId: 'admin.user',
    fullName: 'System Administrator',
    email: 'admin@bank.com',
    mobile: '+91 54321 09876',
    roles: ['SYSTEM_ADMIN'],
    permissions: [
      'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE',
      'LOAN_APPLY', 'LOAN_APPROVE', 'LOAN_REJECT',
      'TRANSACTION_INITIATE', 'TRANSACTION_APPROVE', 'TRANSACTION_REVERSE',
      'ADMIN_CONFIG',
    ],
  },
};

export const currentUser = mockUsers.customer;

export const accounts: Account[] = [
  { id: 'ACC-001', accountNumber: '12345678901', ifsc: 'MERI0123456', type: 'SAVINGS', balance: 125450, status: 'ACTIVE', openedOn: '2021-03-12', nominee: 'Jane Doe' },
  { id: 'ACC-002', accountNumber: '98765432109', ifsc: 'MERI0123456', type: 'CURRENT', balance: 482300, status: 'ACTIVE', openedOn: '2022-07-01' },
  { id: 'ACC-003', accountNumber: '55123498071', ifsc: 'MERI0987654', type: 'SALARY', balance: 78900, status: 'ACTIVE', openedOn: '2023-01-15', nominee: 'Jane Doe' },
];

export const fixedDeposits: FixedDeposit[] = [
  { id: 'FD-001', fdNumber: 'FD240115001', principal: 100000, rate: 6.5, tenureMonths: 12, startDate: '2024-01-15', maturityDate: '2025-01-14', maturityAmount: 106500, interestEarned: 6500, type: 'CUMULATIVE', status: 'ACTIVE', autoRenew: true },
  { id: 'FD-002', fdNumber: 'FD240320002', principal: 500000, rate: 7.0, tenureMonths: 36, startDate: '2024-03-20', maturityDate: '2027-03-20', maturityAmount: 605000, interestEarned: 105000, type: 'TAX_SAVER', status: 'ACTIVE', autoRenew: false },
  { id: 'FD-003', fdNumber: 'FD230710003', principal: 50000, rate: 5.5, tenureMonths: 6, startDate: '2023-07-10', maturityDate: '2024-01-10', maturityAmount: 51675, interestEarned: 1675, type: 'NON_CUMULATIVE', status: 'MATURED', autoRenew: false },
];

export const recurringDeposits: RecurringDeposit[] = [
  {
    id: 'RD-001', rdNumber: 'RD240115001', monthlyAmount: 1000, rate: 6.75, tenureMonths: 12,
    startDate: '2024-01-15', maturityDate: '2025-01-15', maturityAmount: 12437, interestEarned: 437,
    status: 'ACTIVE', paymentMode: 'AUTO_DEBIT', debitDate: 15,
    installments: [
      { number: 1, dueDate: '2024-01-15', paidDate: '2024-01-15', amount: 1000, status: 'PAID' },
      { number: 2, dueDate: '2024-02-15', paidDate: '2024-02-15', amount: 1000, status: 'PAID' },
      { number: 3, dueDate: '2024-03-15', paidDate: '2024-03-15', amount: 1000, status: 'PAID' },
      { number: 4, dueDate: '2024-04-15', paidDate: '2024-04-15', amount: 1000, status: 'PAID' },
      { number: 5, dueDate: '2024-05-15', paidDate: '2024-05-15', amount: 1000, status: 'PAID' },
      { number: 6, dueDate: '2024-06-15', paidDate: '2024-06-15', amount: 1000, status: 'PAID' },
      { number: 7, dueDate: '2024-07-15', paidDate: '2024-07-15', amount: 1000, status: 'PAID' },
      { number: 8, dueDate: '2024-08-15', paidDate: '2024-08-15', amount: 1000, status: 'PAID' },
      { number: 9, dueDate: '2024-09-15', paidDate: null, amount: 1000, status: 'PENDING' },
      { number: 10, dueDate: '2024-10-15', paidDate: null, amount: 1000, status: 'SCHEDULED' },
      { number: 11, dueDate: '2024-11-15', paidDate: null, amount: 1000, status: 'SCHEDULED' },
      { number: 12, dueDate: '2024-12-15', paidDate: null, amount: 1000, status: 'SCHEDULED' },
    ],
  },
];

export const loans: Loan[] = [
  {
    id: 'LOAN-001', applicationNumber: 'PL-2024-001234', applicant: 'John Doe',
    type: 'PERSONAL', category: 'RETAIL', amount: 150000, tenureMonths: 36, rate: 10.5,
    emi: 4875, purpose: 'Home Renovation', status: 'UNDER_REVIEW', submittedAt: '2024-01-15T10:30:00Z',
    creditScore: 780, riskGrade: 'A', dti: 25, slaHours: 24, submittedHoursAgo: 3,
    approvalTimeline: [
      { level: 1, role: 'BRANCH_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
      { level: 2, role: 'REGIONAL_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
    ],
  },
  {
    id: 'LOAN-002', applicationNumber: 'PL-2024-001235', applicant: 'Jane Smith',
    type: 'PERSONAL', category: 'RETAIL', amount: 400000, tenureMonths: 48, rate: 11.0,
    emi: 10338, purpose: 'Medical Expense', status: 'UNDER_REVIEW', submittedAt: '2024-01-15T09:15:00Z',
    creditScore: 720, riskGrade: 'B', dti: 38, slaHours: 24, submittedHoursAgo: 18,
    approvalTimeline: [
      { level: 1, role: 'BRANCH_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
    ],
  },
  {
    id: 'LOAN-003', applicationNumber: 'HL-2024-000567', applicant: 'Mike Ross',
    type: 'HOME', category: 'RETAIL', amount: 2500000, tenureMonths: 240, rate: 8.5,
    emi: 21636, purpose: 'Home Purchase', status: 'UNDER_REVIEW', submittedAt: '2024-01-14T14:20:00Z',
    creditScore: 810, riskGrade: 'A', dti: 30, slaHours: 48, submittedHoursAgo: 30,
    approvalTimeline: [
      { level: 1, role: 'BRANCH_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
      { level: 2, role: 'REGIONAL_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
      { level: 3, role: 'CREDIT_COMMITTEE', status: 'PENDING', approver: null, approvedAt: null },
    ],
  },
  {
    id: 'LOAN-004', applicationNumber: 'AL-2024-000890', applicant: 'Sarah Lee',
    type: 'AUTO', category: 'RETAIL', amount: 800000, tenureMonths: 60, rate: 9.2,
    emi: 16716, purpose: 'Car Purchase', status: 'UNDER_REVIEW', submittedAt: '2024-01-14T11:00:00Z',
    creditScore: 690, riskGrade: 'C', dti: 45, slaHours: 24, submittedHoursAgo: 26,
    approvalTimeline: [
      { level: 1, role: 'BRANCH_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
    ],
  },
  {
    id: 'LOAN-005', applicationNumber: 'GL-2024-000123', applicant: 'Tom Chen',
    type: 'GOLD', category: 'RETAIL', amount: 75000, tenureMonths: 12, rate: 12.0,
    emi: 6674, purpose: 'Gold Loan', status: 'UNDER_REVIEW', submittedAt: '2024-01-13T16:45:00Z',
    creditScore: 650, riskGrade: 'C', dti: 28, slaHours: 24, submittedHoursAgo: 50,
    approvalTimeline: [
      { level: 1, role: 'BRANCH_MANAGER', status: 'PENDING', approver: null, approvedAt: null },
    ],
  },
];

export const transactions: Transaction[] = [
  { id: 'TXN-001', date: '2024-01-15', description: 'NEFT Transfer to Jane Smith', amount: 25000, type: 'DEBIT', status: 'SUCCESSFUL', balance: 75000, reference: 'NEFT2024001234' },
  { id: 'TXN-002', date: '2024-01-14', description: 'Electricity Bill Payment', amount: 1500, type: 'DEBIT', status: 'SUCCESSFUL', balance: 100000, reference: 'BILL202400987' },
  { id: 'TXN-003', date: '2024-01-13', description: 'FD Interest Credit', amount: 12500, type: 'CREDIT', status: 'SUCCESSFUL', balance: 101500, reference: 'INT202400556' },
  { id: 'TXN-004', date: '2024-01-12', description: 'Salary Credit - Tech Corp', amount: 85000, type: 'CREDIT', status: 'SUCCESSFUL', balance: 89000, reference: 'SAL202400112' },
  { id: 'TXN-005', date: '2024-01-11', description: 'UPI Payment to Grocery Store', amount: 1200, type: 'DEBIT', status: 'SUCCESSFUL', balance: 4000, reference: 'UPI202400778' },
  { id: 'TXN-006', date: '2024-01-10', description: 'ATM Withdrawal', amount: 5000, type: 'DEBIT', status: 'SUCCESSFUL', balance: 5200, reference: 'ATM202400045' },
  { id: 'TXN-007', date: '2024-01-09', description: 'RD Auto-Debit Installment', amount: 1000, type: 'DEBIT', status: 'SUCCESSFUL', balance: 10200, reference: 'RDA202400033' },
  { id: 'TXN-008', date: '2024-01-08', description: 'IMPS Transfer to R. Kumar', amount: 8000, type: 'DEBIT', status: 'PENDING', balance: 11200, reference: 'IMPS202400091' },
];

export const cards: BankCard[] = [
  { id: 'CARD-001', type: 'DEBIT_CARD', variant: 'PLATINUM', numberMasked: '4532 1234 5678 1234', holder: 'JOHN DOE', expiry: '08/27', status: 'ACTIVE', dailyLimit: 100000, monthlyLimit: 300000, international: false },
  { id: 'CARD-002', type: 'CREDIT_CARD', variant: 'GOLD', numberMasked: '5412 9876 5432 9876', holder: 'JOHN DOE', expiry: '11/26', status: 'ACTIVE', dailyLimit: 50000, monthlyLimit: 150000, international: true },
];

export const beneficiaries: Beneficiary[] = [
  { id: 'B-001', name: 'Jane Smith', accountNumber: '98765432109', bankName: 'XYZ Bank', ifsc: 'XYZW0123456' },
  { id: 'B-002', name: 'Rahul Kumar', accountNumber: '55123498071', bankName: 'State Bank', ifsc: 'SBIN0001234' },
  { id: 'B-003', name: 'Priya Sharma', accountNumber: '77123456098', bankName: 'HDFC Bank', ifsc: 'HDFC0009876' },
];

export const notifications = [
  { id: 'N1', title: 'FD Maturity Alert', body: 'Your FD-003 matures in 3 days', time: '2h ago', type: 'warning' as const },
  { id: 'N2', title: 'EMI Due Reminder', body: 'Loan EMI of ₹4,875 due on 25 Jan', time: '5h ago', type: 'info' as const },
  { id: 'N3', title: 'Transaction Successful', body: '₹25,000 transferred via NEFT', time: '1d ago', type: 'success' as const },
];
