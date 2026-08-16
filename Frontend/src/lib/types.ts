export type Currency = number;

export type AccountType = 'SAVINGS' | 'CURRENT' | 'SALARY' | 'NRI' | 'MINOR' | 'BUSINESS';
export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';

export interface Account {
  id: string;
  accountNumber: string;
  ifsc: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
  openedOn: string;
  nominee?: string;
}

export type FdType = 'CUMULATIVE' | 'NON_CUMULATIVE' | 'FLEXI' | 'TAX_SAVER';
export type FdStatus = 'ACTIVE' | 'MATURED' | 'WITHDRAWN';
export type PayoutFrequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'AT_MATURITY';

export interface FixedDeposit {
  id: string;
  fdNumber: string;
  principal: number;
  rate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  interestEarned: number;
  type: FdType;
  status: FdStatus;
  autoRenew: boolean;
}

export type RdStatus = 'ACTIVE' | 'MATURED' | 'CLOSED';
export type PaymentMode = 'AUTO_DEBIT' | 'MANUAL';

export interface RdInstallment {
  number: number;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: 'PAID' | 'PENDING' | 'SCHEDULED' | 'OVERDUE';
}

export interface RecurringDeposit {
  id: string;
  rdNumber: string;
  monthlyAmount: number;
  rate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  interestEarned: number;
  status: RdStatus;
  paymentMode: PaymentMode;
  debitDate: number;
  installments: RdInstallment[];
}

export type LoanType = 'PERSONAL' | 'HOME' | 'AUTO' | 'EDUCATION' | 'GOLD';
export type LoanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'RETURNED';
export type LoanCategory = 'RETAIL' | 'SME' | 'CORPORATE' | 'AGRICULTURE';

export interface ApprovalStep {
  level: number;
  role: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  approver: string | null;
  approvedAt: string | null;
  comments?: string;
}

export interface Loan {
  id: string;
  applicationNumber: string;
  applicant: string;
  type: LoanType;
  category: LoanCategory;
  amount: number;
  tenureMonths: number;
  rate: number;
  emi: number;
  purpose: string;
  status: LoanStatus;
  submittedAt: string;
  creditScore: number;
  riskGrade: 'A' | 'B' | 'C' | 'D';
  dti: number;
  slaHours: number;
  submittedHoursAgo: number;
  approvalTimeline: ApprovalStep[];
}

export type TxnType = 'DEBIT' | 'CREDIT';
export type TxnStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TxnType;
  status: TxnStatus;
  balance: number;
  reference?: string;
}

export type CardType = 'DEBIT_CARD' | 'CREDIT_CARD';
export type CardVariant = 'CLASSIC' | 'GOLD' | 'PLATINUM' | 'BUSINESS';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'PENDING_ISSUANCE';

export interface BankCard {
  id: string;
  type: CardType;
  variant: CardVariant;
  numberMasked: string;
  holder: string;
  expiry: string;
  status: CardStatus;
  dailyLimit: number;
  monthlyLimit: number;
  international: boolean;
}

export type TransferType = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'INTERNAL';

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
}
