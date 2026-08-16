import { useState } from 'react';
import { Banknote, ChevronLeft, Eye, Clock, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/Table';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { loans } from '@/lib/mockData';
import { formatINR, formatDate, classNames } from '@/lib/format';
import type { Loan } from '@/lib/types';

// ============================================
// APPROVAL CHAIN VISUALIZATION
// ============================================
function ApprovalChain({ loan }: { loan: Loan }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {loan.approvalTimeline.map((step, idx) => (
        <div key={step.level} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className={classNames(
              'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white',
              step.status === 'APPROVED' && 'bg-success-600',
              step.status === 'PENDING' && 'bg-ink-300',
              step.status === 'REJECTED' && 'bg-error-600'
            )}>
              {step.status === 'APPROVED' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <span className="text-xs font-medium text-ink-700">{step.role.replace('_', ' ')}</span>
            {step.status === 'APPROVED' && step.approvedAt && (
              <span className="text-xs text-success-600">✓ {formatDate(step.approvedAt)}</span>
            )}
          </div>
          {idx < loan.approvalTimeline.length - 1 && (
            <div className="mx-2 h-0.5 w-8 bg-ink-200 sm:mx-0 sm:h-8 sm:w-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN LOAN APPROVAL PAGE
// ============================================
export function LoanApprovalPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [filter, setFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const pending = loans.filter((l) => l.status === 'UNDER_REVIEW').length;
  const approved = 3;
  const rejected = 1;
  const slaBreach = loans.filter((l) => l.submittedHoursAgo > l.slaHours).length;

  const filtered = loans.filter((l) => filter === 'ALL' || l.type === filter);

  const getSlaStatus = (l: Loan) => {
    const remaining = l.slaHours - l.submittedHoursAgo;
    if (remaining < 0) return { variant: 'error' as const, label: 'SLA Breached', icon: <XCircle className="h-3.5 w-3.5" /> };
    if (remaining < 6) return { variant: 'warning' as const, label: `${remaining}h left`, icon: <AlertTriangle className="h-3.5 w-3.5" /> };
    return { variant: 'success' as const, label: `${remaining}h left`, icon: <Clock className="h-3.5 w-3.5" /> };
  };

  const columns: Column<Loan>[] = [
    { key: 'applicationNumber', header: 'App No.', render: (l) => <span className="font-mono text-sm font-semibold text-ink-900">{l.applicationNumber}</span> },
    { key: 'applicant', header: 'Customer', render: (l) => <span className="font-medium text-ink-800">{l.applicant}</span> },
    { key: 'type', header: 'Type', render: (l) => <Badge variant="neutral">{l.type.charAt(0) + l.type.slice(1).toLowerCase()}</Badge> },
    { key: 'amount', header: 'Amount', align: 'right', render: (l) => <span className="font-semibold text-ink-900">{formatINR(l.amount)}</span> },
    {
      key: 'approvalChain', header: 'Approval Status', width: '300px',
      render: (l) => {
        const pendingStep = l.approvalTimeline.find((s) => s.status === 'PENDING');
        return (
          <div>
            <div className="flex items-center gap-2">
              {l.approvalTimeline.map((s, i) => (
                <div key={i} className={classNames('h-1.5 flex-1 rounded-full',
                  s.status === 'APPROVED' && 'bg-success-500',
                  s.status === 'PENDING' && 'bg-warning-500',
                  s.status === 'REJECTED' && 'bg-error-500'
                )} />
              ))}
            </div>
            <p className="mt-1 text-xs text-ink-500">Pending: {pendingStep?.role.replace('_', ' ')}</p>
          </div>
        );
      },
    },
    {
      key: 'sla', header: 'SLA',
      render: (l) => {
        const sla = getSlaStatus(l);
        return <Badge variant={sla.variant} dot>{sla.label}</Badge>;
      },
    },
    {
      key: 'action', header: '', align: 'right',
      render: (l) => (
        <Button size="sm" variant="outline" leftIcon={<Eye className="h-3.5 w-3.5" />} 
          onClick={() => {
            setSelectedLoan(l);
            setViewMode('detail');
          }}>
          Details
        </Button>
      ),
    },
  ];

  const stats = [
    { label: 'Pending', value: pending, color: 'text-brand-600 bg-brand-50', icon: <Clock className="h-5 w-5" /> },
    { label: 'Approved Today', value: approved, color: 'text-success-600 bg-success-50', icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: 'Rejected', value: rejected, color: 'text-error-600 bg-error-50', icon: <XCircle className="h-5 w-5" /> },
    { label: 'SLA Breach', value: slaBreach, color: 'text-warning-600 bg-warning-50', icon: <AlertTriangle className="h-5 w-5" /> },
  ];

  if (viewMode === 'detail' && selectedLoan) {
    return (
      <div>
        <Toast toast={toast} />
        <PageHeader
          title="Approval Details"
          subtitle={`Application ${selectedLoan.applicationNumber}`}
          icon={<Banknote className="h-5 w-5" />}
          action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => setViewMode('list')}>Back</Button>}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Applicant Info */}
            <Card padding="md">
              <h3 className="mb-4 font-display text-base font-bold text-ink-900">Applicant Information</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-ink-400">Name</p>
                  <p className="mt-1 font-semibold text-ink-900">{selectedLoan.applicant}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Application #</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink-900">{selectedLoan.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Loan Type</p>
                  <p className="mt-1 font-semibold text-ink-900">{selectedLoan.type}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Loan Amount</p>
                  <p className="mt-1 font-display text-lg font-bold text-brand-600">{formatINR(selectedLoan.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Purpose</p>
                  <p className="mt-1 font-semibold text-ink-900">{selectedLoan.purpose}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Submitted</p>
                  <p className="mt-1 font-semibold text-ink-900">{formatDate(selectedLoan.submittedAt)}</p>
                </div>
              </div>
            </Card>

            {/* Approval Chain */}
            <Card padding="md">
              <h3 className="mb-6 font-display text-base font-bold text-ink-900">Approval Workflow</h3>
              <div className="space-y-4">
                {selectedLoan.approvalTimeline.map((step, idx) => (
                  <div key={step.level} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={classNames(
                        'flex h-10 w-10 items-center justify-center rounded-full font-bold text-white',
                        step.status === 'APPROVED' && 'bg-success-600',
                        step.status === 'PENDING' && 'bg-brand-600',
                        step.status === 'REJECTED' && 'bg-error-600'
                      )}>
                        {step.status === 'APPROVED' ? <CheckCircle2 className="h-5 w-5" /> : step.status === 'REJECTED' ? <XCircle className="h-5 w-5" /> : step.level}
                      </div>
                      {idx < selectedLoan.approvalTimeline.length - 1 && (
                        <div className="my-2 h-8 w-0.5 bg-ink-200" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-ink-900">{step.role.replace('_', ' ')}</p>
                          <p className="text-sm text-ink-500">
                            {step.status === 'APPROVED' ? `Approved by ${step.approver}` : step.status === 'REJECTED' ? `Rejected by ${step.approver}` : 'Awaiting approval'}
                          </p>
                        </div>
                        <Badge variant={step.status === 'APPROVED' ? 'success' : step.status === 'REJECTED' ? 'error' : 'warning'}>
                          {step.status}
                        </Badge>
                      </div>
                      {step.approvedAt && (
                        <p className="mt-2 text-xs text-ink-400">{formatDate(step.approvedAt)}</p>
                      )}
                      {step.comments && (
                        <div className="mt-2 rounded-lg bg-ink-50 p-2.5">
                          <p className="text-xs text-ink-600">{step.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risk Assessment */}
            <Card padding="md">
              <h3 className="mb-4 font-display text-base font-bold text-ink-900">Risk Assessment</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">Credit Score</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-900">{selectedLoan.creditScore}</p>
                  <p className="text-xs text-ink-400">/ 900</p>
                </div>
                <div className="rounded-lg bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">Risk Grade</p>
                  <Badge variant={selectedLoan.riskGrade === 'A' ? 'success' : 'warning'} className="mt-1">{selectedLoan.riskGrade}</Badge>
                </div>
                <div className="rounded-lg bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">DTI Ratio</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-900">{selectedLoan.dti}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - SLA & Actions */}
          <div className="space-y-4">
            <Card padding="md" className="border-l-4 border-l-warning-600">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink-400">SLA Deadline</p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-900">{getSlaStatus(selectedLoan).label}</p>
                </div>
                <Calendar className="h-5 w-5 text-warning-600" />
              </div>
              <p className="mt-2 text-xs text-ink-500">Total: {selectedLoan.slaHours}h | Used: {selectedLoan.submittedHoursAgo}h</p>
            </Card>

            <Card padding="md">
              <h3 className="mb-4 font-display text-sm font-bold text-ink-900">Quick Actions</h3>
              <div className="space-y-2">
                <Button fullWidth variant="primary" onClick={() => {
                  showToast('Application approved', 'success');
                  setTimeout(() => setViewMode('list'), 1500);
                }}>
                  Approve
                </Button>
                <Button fullWidth variant="outline" onClick={() => {
                  showToast('Application rejected', 'error');
                  setTimeout(() => setViewMode('list'), 1500);
                }}>
                  Reject
                </Button>
                <Button fullWidth variant="ghost" onClick={() => navigate('loan-review', { id: selectedLoan.id })}>
                  Detailed Review
                </Button>
              </div>
            </Card>

            <Card padding="md">
              <h3 className="mb-3 font-display text-sm font-bold text-ink-900">Loan Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-500">Tenure</span>
                  <span className="font-semibold text-ink-900">{selectedLoan.tenureMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">Interest Rate</span>
                  <span className="font-semibold text-ink-900">{selectedLoan.rate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500">EMI</span>
                  <span className="font-semibold text-ink-900">{formatINR(selectedLoan.emi)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Pending Approvals"
        subtitle="Multi-level loan approval workflow with SLA tracking"
        icon={<Banknote className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} padding="md">
            <div className="flex items-center gap-3">
              <div className={classNames('flex h-11 w-11 items-center justify-center rounded-xl', s.color)}>{s.icon}</div>
              <div>
                <p className="font-display text-2xl font-extrabold text-ink-900">{s.value}</p>
                <p className="text-sm text-ink-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="md">
        <div className="mb-4 flex flex-wrap gap-2">
          {['ALL', 'PERSONAL', 'HOME', 'AUTO', 'GOLD'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={classNames('rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                filter === f ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200')}>
              {f === 'ALL' ? 'All Types' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <DataTable columns={columns} data={filtered} rowKey={(l) => l.id} onRowClick={(l) => {
          setSelectedLoan(l);
          setViewMode('detail');
        }} />
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success-500" /> Within SLA (24+ hrs)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning-500" /> Approaching SLA (&lt;6 hrs)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-error-500" /> SLA Breached</span>
      </div>
    </div>
  );
}
