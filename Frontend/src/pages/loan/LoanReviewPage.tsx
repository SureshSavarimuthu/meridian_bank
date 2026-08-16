import { useState } from 'react';
import { Banknote, ChevronLeft, Check, X, RotateCcw, Printer, Download, ShieldCheck, FileCheck, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RadioGroup, Textarea } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { loans } from '@/lib/mockData';
import { formatINR, formatDate, classNames } from '@/lib/format';

export function LoanReviewPage() {
  const { navigate, params } = useNav();
  const { toast, showToast } = useToast();
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');

  const loan = loans.find((l) => l.id === params.id) || loans[0];

  const riskColor = loan.riskGrade === 'A' ? 'success' : loan.riskGrade === 'B' ? 'info' : 'warning';
  const recommended = loan.riskGrade === 'A' || loan.riskGrade === 'B';

  const submitDecision = () => {
    if (!decision) { showToast('Please select a decision', 'error'); return; }
    showToast(`Decision submitted: ${decision}`);
    setTimeout(() => navigate('loan-approval'), 1500);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Loan Review"
        subtitle={`Application ${loan.applicationNumber}`}
        icon={<Banknote className="h-5 w-5" />}
        action={
          <>
            <Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('loan-approval')}>Back</Button>
            <Button variant="outline" size="sm" leftIcon={<Printer className="h-4 w-4" />} onClick={() => showToast('Printing…', 'info')}>Print</Button>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => showToast('PDF downloaded', 'info')}>PDF</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="md">
            <CardHeader title="Application Summary" icon={<FileCheck className="h-5 w-5" />} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <DetailItem label="Application No." value={loan.applicationNumber} />
              <DetailItem label="Applicant" value={loan.applicant} />
              <DetailItem label="Loan Type" value={loan.type.charAt(0) + loan.type.slice(1).toLowerCase()} />
              <DetailItem label="Amount" value={formatINR(loan.amount)} />
              <DetailItem label="Tenure" value={`${loan.tenureMonths} months`} />
              <DetailItem label="Interest Rate" value={`${loan.rate}% p.a.`} />
              <DetailItem label="EMI" value={`${formatINR(loan.emi)}/mo`} />
              <DetailItem label="Purpose" value={loan.purpose} />
              <DetailItem label="Submitted" value={formatDate(loan.submittedAt)} />
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Document Verification" icon={<ShieldCheck className="h-5 w-5" />} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {['Aadhaar Verified', 'PAN Verified', 'Salary Slips', 'Bank Statements', 'Employment', 'Address Proof'].map((doc) => (
                <div key={doc} className="flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2.5">
                  <Check className="h-4 w-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">{doc}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Risk Assessment" icon={<TrendingUp className="h-5 w-5" />} />
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-ink-500">Credit Score</span>
                  <span className="font-semibold text-ink-900">{loan.creditScore} / 900</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className={classNames('h-full rounded-full', loan.creditScore >= 750 ? 'bg-success-500' : 'bg-warning-500')} style={{ width: `${(loan.creditScore / 900) * 100}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">Risk Grade</p>
                  <Badge variant={riskColor} className="mt-1">{loan.riskGrade}</Badge>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">DTI Ratio</p>
                  <p className="mt-1 text-sm font-bold text-ink-900">{loan.dti}%</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-3 text-center">
                  <p className="text-xs text-ink-400">Recommendation</p>
                  <p className={classNames('mt-1 text-sm font-bold', recommended ? 'text-success-600' : 'text-warning-600')}>{recommended ? 'APPROVE' : 'REVIEW'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Approval Timeline" icon={<FileCheck className="h-5 w-5" />} />
            <div className="space-y-3">
              {loan.approvalTimeline.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={classNames('flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    step.status === 'APPROVED' ? 'bg-success-600 text-white' : step.status === 'REJECTED' ? 'bg-error-600 text-white' : 'bg-ink-100 text-ink-400')}>
                    {step.level}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{step.role.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-ink-400">{step.status === 'PENDING' ? 'Awaiting decision' : `${step.status} by ${step.approver}`}</p>
                  </div>
                  <Badge variant={step.status === 'APPROVED' ? 'success' : step.status === 'REJECTED' ? 'error' : 'neutral'} dot>
                    {step.status.charAt(0) + step.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Decision</h3>
            <div className="space-y-4">
              <RadioGroup name="decision" value={decision} onChange={setDecision}
                options={[
                  { value: 'APPROVED', label: 'Approve' },
                  { value: 'REJECTED', label: 'Reject' },
                  { value: 'RETURNED', label: 'Return for more info' },
                ]} />
              <Textarea label="Comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Enter your review comments…" rows={4} />
            </div>
            <div className="mt-4 space-y-2">
              <Button fullWidth onClick={submitDecision} leftIcon={<Check className="h-4 w-4" />}>Submit decision</Button>
              <Button fullWidth variant="outline" onClick={() => showToast('Saved for later', 'info')}>Save for later</Button>
              <Button fullWidth variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => showToast('Escalated', 'warning')}>Escalate</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
