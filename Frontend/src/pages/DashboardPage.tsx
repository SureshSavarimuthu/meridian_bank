import {
  Wallet, PiggyBank, CalendarClock, Banknote, CreditCard, TrendingUp,
  ArrowUpRight, ArrowDownRight, Receipt, Download, ArrowLeftRight,
  FileText, Plus, Eye, EyeOff, CheckCircle, Clock, AlertCircle, Users,
  TrendingDown, BarChart3, Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNav } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { accounts, fixedDeposits, recurringDeposits, loans, transactions, cards, mockUsers } from '@/lib/mockData';
import { formatINR, formatINRShort, formatDate, maskAccount, classNames } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/Table';
import type { Transaction } from '@/lib/types';
import { AdminPage } from './admin/AdminPage';

// ============================================
// CUSTOMER DASHBOARD
// ============================================
function CustomerDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();
  const [hideBalance, setHideBalance] = useState(false);

  const savingsBalance = accounts.filter((a) => a.type === 'SAVINGS' || a.type === 'SALARY').reduce((s, a) => s + a.balance, 0);
  const fdTotal = fixedDeposits.filter((f) => f.status === 'ACTIVE').reduce((s, f) => s + f.principal, 0);
  const rdTotal = recurringDeposits.filter((r) => r.status === 'ACTIVE').reduce((s, r) => s + r.monthlyAmount * r.tenureMonths, 0);
  const loanOutstanding = 350000;
  const cardDue = 45000;

  const summaryCards = [
    { label: 'Savings Balance', value: savingsBalance, icon: <Wallet className="h-5 w-5" />, accent: 'brand', sub: `${accounts.length} accounts`, route: 'account-opening' as const },
    { label: 'Fixed Deposits', value: fdTotal, icon: <PiggyBank className="h-5 w-5" />, accent: 'accent', sub: `${fixedDeposits.filter(f => f.status === 'ACTIVE').length} active FDs`, route: 'fd-list' as const },
    { label: 'Recurring Deposits', value: rdTotal, icon: <CalendarClock className="h-5 w-5" />, accent: 'brand', sub: `${recurringDeposits.filter(r => r.status === 'ACTIVE').length} active RD`, route: 'rd-tracker' as const },
    { label: 'Loans Outstanding', value: loanOutstanding, icon: <Banknote className="h-5 w-5" />, accent: 'warning', sub: `${loans.length} active`, route: 'loan-application' as const },
    { label: 'Credit Card Due', value: cardDue, icon: <CreditCard className="h-5 w-5" />, accent: 'error', sub: 'Due 25 Jan', route: 'transfer' as const },
    { label: 'Investments', value: 100000, icon: <TrendingUp className="h-5 w-5" />, accent: 'accent', sub: 'Portfolio', route: 'dashboard' as const },
  ];

  const txnColumns: Column<Transaction>[] = [
    { key: 'date', header: 'Date', render: (t) => <span className="text-ink-500">{formatDate(t.date)}</span> },
    {
      key: 'description', header: 'Description',
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <div className={classNames(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            t.type === 'CREDIT' ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600',
          )}>
            {t.type === 'CREDIT' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </div>
          <span className="font-medium text-ink-800">{t.description}</span>
        </div>
      ),
    },
    {
      key: 'amount', header: 'Amount', align: 'right',
      render: (t) => (
        <span className={classNames('font-semibold', t.type === 'CREDIT' ? 'text-success-600' : 'text-ink-900')}>
          {t.type === 'CREDIT' ? '+' : '−'}{formatINR(t.amount, { decimals: true })}
        </span>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (t) => (
        <Badge variant={t.status === 'SUCCESSFUL' ? 'success' : t.status === 'PENDING' ? 'warning' : 'error'} dot>
          {t.status === 'SUCCESSFUL' ? 'Successful' : t.status === 'PENDING' ? 'Pending' : 'Failed'}
        </Badge>
      ),
    },
  ];

  const quickActions = [
    { label: 'Transfer', icon: <ArrowLeftRight className="h-5 w-5" />, route: 'transfer' as const, color: 'bg-brand-50 text-brand-600' },
    { label: 'Pay Bills', icon: <FileText className="h-5 w-5" />, route: 'transfer' as const, color: 'bg-accent-100 text-accent-700' },
    { label: 'Open FD', icon: <PiggyBank className="h-5 w-5" />, route: 'fd-open' as const, color: 'bg-warning-100 text-warning-700' },
    { label: 'Open RD', icon: <CalendarClock className="h-5 w-5" />, route: 'rd-open' as const, color: 'bg-brand-100 text-brand-700' },
    { label: 'Apply Loan', icon: <Banknote className="h-5 w-5" />, route: 'loan-application' as const, color: 'bg-error-100 text-error-600' },
    { label: 'Statement', icon: <Download className="h-5 w-5" />, route: 'dashboard' as const, color: 'bg-ink-100 text-ink-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-400">Welcome back,</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{user?.fullName}</h1>
          <p className="mt-1 text-xs text-ink-400">Last login: {user?.lastLogin}</p>
        </div>
        <Button variant="outline" leftIcon={hideBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} onClick={() => setHideBalance((v) => !v)}>
          {hideBalance ? 'Show balances' : 'Hide balances'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.route)}
            className="group text-left"
          >
            <Card className="transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft-lg">
              <div className="flex items-start justify-between">
                <div className={classNames('flex h-11 w-11 items-center justify-center rounded-xl', card.accent === 'brand' && 'bg-brand-50 text-brand-600', card.accent === 'accent' && 'bg-accent-100 text-accent-700', card.accent === 'warning' && 'bg-warning-100 text-warning-700', card.accent === 'error' && 'bg-error-100 text-error-600')}>
                  {card.icon}
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-500" />
              </div>
              <p className="mt-4 text-sm font-medium text-ink-500">{card.label}</p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-900">
                {hideBalance ? '₹ ••••••' : formatINR(card.value)}
              </p>
              <p className="mt-1 text-xs text-ink-400">{card.sub}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.route)}
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-ink-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className={classNames('flex h-12 w-12 items-center justify-center rounded-xl', a.color)}>
              {a.icon}
            </div>
            <span className="text-sm font-semibold text-ink-700">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" padding="md">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink-900">Recent transactions</h3>
              <p className="text-sm text-ink-500">Last {transactions.length} transactions across accounts</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('transfer')}>View all</Button>
          </div>
          <DataTable
            columns={txnColumns}
            data={transactions.slice(0, 6)}
            rowKey={(t) => t.id}
          />
        </Card>

        <Card padding="md">
          <h3 className="font-display text-base font-bold text-ink-900">Your accounts</h3>
          <p className="mb-4 text-sm text-ink-500">Quick access to all accounts</p>
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="rounded-xl border border-ink-100 p-3.5 transition-colors hover:bg-ink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{a.type.charAt(0) + a.type.slice(1).toLowerCase()} Account</p>
                    <p className="font-mono text-xs text-ink-400">{maskAccount(a.accountNumber)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-ink-900">{hideBalance ? '₹ ••••' : formatINRShort(a.balance)}</p>
                    <Badge variant="success" dot className="mt-1">{a.status === 'ACTIVE' ? 'Active' : a.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink-900">Active deposits</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('fd-list')}>View all</Button>
          </div>
          <div className="space-y-3">
            {fixedDeposits.filter((f) => f.status === 'ACTIVE').map((fd) => (
              <div key={fd.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{fd.fdNumber}</p>
                    <p className="text-xs text-ink-400">{fd.rate}% · {fd.tenureMonths} months · matures {formatDate(fd.maturityDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold text-ink-900">{formatINRShort(fd.principal)}</p>
                  <p className="text-xs text-success-600">+{formatINRShort(fd.interestEarned)} interest</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink-900">Your cards</h3>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('account-opening')}>New</Button>
          </div>
          <div className="space-y-3">
            {cards.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-xl bg-gradient-to-br from-brand-900 to-brand-700 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-brand-200">{c.type === 'DEBIT_CARD' ? 'Debit Card' : 'Credit Card'} · {c.variant}</p>
                    <p className="mt-2 font-mono text-sm tracking-wider">{c.numberMasked}</p>
                  </div>
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'error'}>{c.status}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-brand-200">{c.holder}</span>
                  <span className="font-mono">{c.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// BRANCH MANAGER DASHBOARD
// ============================================
function BranchManagerDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();

  const pendingLoans = loans.filter((l) => l.status === 'UNDER_REVIEW');
  const totalLoanValue = loans.reduce((sum, l) => sum + l.amount, 0);
  const averageCreditScore = Math.round(loans.reduce((sum, l) => sum + l.creditScore, 0) / loans.length);
  const totalCustomers = 245; // Mock data

  const statCards = [
    { label: 'Pending Approvals', value: pendingLoans.length, icon: <Clock className="h-5 w-5" />, color: 'warning' },
    { label: 'Loan Applications', value: loans.length, icon: <Banknote className="h-5 w-5" />, color: 'brand' },
    { label: 'Total Loan Value', value: formatINRShort(totalLoanValue), icon: <TrendingUp className="h-5 w-5" />, color: 'accent' },
    { label: 'Branch Customers', value: totalCustomers, icon: <Users className="h-5 w-5" />, color: 'success' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-ink-400">Branch Operations</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{user?.fullName}</h1>
        <p className="mt-1 text-xs text-ink-400">Branch: {user?.branchId || 'BR-001'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} padding="md">
            <div className="flex items-start justify-between">
              <div className={classNames('flex h-11 w-11 items-center justify-center rounded-xl', card.color === 'brand' && 'bg-brand-50 text-brand-600', card.color === 'warning' && 'bg-warning-100 text-warning-700', card.color === 'accent' && 'bg-accent-100 text-accent-700', card.color === 'success' && 'bg-success-100 text-success-600')}>
                {card.icon}
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-ink-500">{card.label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-900">{card.value}</p>
          </Card>
        ))}
      </div>

      <Card padding="md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">Pending Loan Approvals</h3>
            <p className="text-sm text-ink-500">{pendingLoans.length} applications awaiting approval</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('loan-approval')}>View all</Button>
        </div>
        <div className="space-y-3">
          {pendingLoans.slice(0, 5).map((loan) => (
            <div key={loan.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3.5 hover:bg-ink-50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-900">{loan.applicant}</p>
                  <Badge variant="warning" dot>{loan.type}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-400">{loan.applicationNumber} · {loan.purpose}</p>
                <p className="mt-1 text-xs text-ink-400">Submitted {loan.submittedHoursAgo}h ago · SLA: {loan.slaHours}h</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-ink-900">{formatINRShort(loan.amount)}</p>
                <Badge variant={loan.riskGrade === 'A' ? 'success' : loan.riskGrade === 'B' ? 'warning' : 'error'}>Risk: {loan.riskGrade}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// EMPLOYEE (LOAN OFFICER) DASHBOARD
// ============================================
function LoanOfficerDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();

  const pendingLoans = loans.filter((l) => l.status === 'UNDER_REVIEW');
  const highRiskLoans = loans.filter((l) => l.riskGrade === 'C' || l.riskGrade === 'D');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-ink-400">Loan Operations</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{user?.fullName}</h1>
        <p className="mt-1 text-xs text-ink-400">Loan Officer · {user?.branchId || 'BR-001'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md" className="border-l-4 border-l-warning-600">
          <Clock className="h-5 w-5 text-warning-600" />
          <p className="mt-4 text-sm font-medium text-ink-500">Pending Review</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink-900">{pendingLoans.length}</p>
        </Card>
        <Card padding="md" className="border-l-4 border-l-brand-600">
          <CheckCircle className="h-5 w-5 text-brand-600" />
          <p className="mt-4 text-sm font-medium text-ink-500">Processed This Month</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink-900">12</p>
        </Card>
        <Card padding="md" className="border-l-4 border-l-error-600">
          <AlertCircle className="h-5 w-5 text-error-600" />
          <p className="mt-4 text-sm font-medium text-ink-500">High Risk Applications</p>
          <p className="mt-1 font-display text-2xl font-bold text-ink-900">{highRiskLoans.length}</p>
        </Card>
      </div>

      <Card padding="md">
        <div className="mb-4">
          <h3 className="font-display text-base font-bold text-ink-900">Loans Requiring Review</h3>
          <p className="text-sm text-ink-500">Applications pending your assessment</p>
        </div>
        <div className="space-y-3">
          {pendingLoans.map((loan) => (
            <div key={loan.id} className="rounded-xl border border-ink-100 p-4 hover:bg-ink-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-ink-900">{loan.applicant}</h4>
                    <Badge variant={loan.riskGrade === 'A' ? 'success' : loan.riskGrade === 'B' ? 'warning' : 'error'}>
                      {loan.riskGrade}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{loan.type} Loan - {loan.purpose}</p>
                  <div className="mt-2 flex gap-4 text-xs text-ink-500">
                    <span>Amount: {formatINRShort(loan.amount)}</span>
                    <span>Score: {loan.creditScore}</span>
                    <span>DTI: {loan.dti}%</span>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate('loan-approval')}>Review</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function AdminDashboard() {
  const { navigate } = useNav();
  const { user } = useAuth();

  const systemStats = [
    { label: 'Active Users', value: 1250, trend: 'up', icon: <Users className="h-5 w-5" /> },
    { label: 'Total Customers', value: 12500, trend: 'up', icon: <TrendingUp className="h-5 w-5" /> },
    { label: 'Active Loans', value: 342, trend: 'up', icon: <Banknote className="h-5 w-5" /> },
    { label: 'System Uptime', value: '99.99%', trend: 'up', icon: <Zap className="h-5 w-5" /> },
  ];

  const adminActions = [
    { label: 'User Management', icon: <Users className="h-5 w-5" />, color: 'bg-brand-50 text-brand-600', route: 'admin' as const },
    { label: 'Approval Matrix', icon: <CheckCircle className="h-5 w-5" />, color: 'bg-accent-100 text-accent-700', route: 'admin' as const },
    { label: 'Interest Rates', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-success-100 text-success-600', route: 'admin' as const },
    { label: 'System Config', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-warning-100 text-warning-700', route: 'admin' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-ink-400">System Administration</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{user?.fullName}</h1>
        <p className="mt-1 text-xs text-ink-400">System Administrator</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {stat.icon}
              </div>
              {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-success-600" />}
            </div>
            <p className="mt-4 text-sm font-medium text-ink-500">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card padding="md">
        <h3 className="font-display text-base font-bold text-ink-900">Administration Tools</h3>
        <p className="mb-4 text-sm text-ink-500">Quick access to system configuration</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              className="flex flex-col items-center gap-3 rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-300 hover:shadow-soft"
            >
              <div className={classNames('flex h-12 w-12 items-center justify-center rounded-lg', action.color)}>
                {action.icon}
              </div>
              <span className="text-sm font-semibold text-ink-700">{action.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD - ROLE ROUTER
// ============================================
export function DashboardPage() {
  const { user } = useAuth();

  // Route to appropriate dashboard based on primary role
  if (user?.roles.includes('SYSTEM_ADMIN')) {
    return <AdminPage />;
  }

  if (user?.roles.includes('BRANCH_MANAGER')) {
    return <BranchManagerDashboard />;
  }

  if (user?.roles.includes('LOAN_OFFICER')) {
    return <LoanOfficerDashboard />;
  }

  // Default to customer dashboard
  return <CustomerDashboard />;
}
