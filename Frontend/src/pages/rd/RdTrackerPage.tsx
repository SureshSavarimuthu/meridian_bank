import { useState, useEffect } from 'react';
import { CalendarClock, ChevronLeft, Play, Pause, XCircle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { rdService, type RdResponse } from '@/services/fdRdService';
import { formatINR, formatDate } from '@/lib/format';

export function RdTrackerPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [rds, setRds] = useState<RdResponse[]>([]);
  const [selectedRd, setSelectedRd] = useState<RdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    rdService.getByCustomer(user.id)
      .then((data) => {
        setRds(data);
        if (data.length > 0) setSelectedRd(data[0]);
      })
      .catch(() => showToast('Failed to load RDs', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const rd = selectedRd;

  if (loading) {
    return (
      <div>
        <PageHeader title="RD Installment Tracker" subtitle="Loading..." icon={<CalendarClock className="h-5 w-5" />} />
        <div className="py-12 text-center text-ink-400">Loading RD data…</div>
      </div>
    );
  }

  if (!rd) {
    return (
      <div>
        <PageHeader title="RD Installment Tracker" subtitle="No recurring deposits found" icon={<CalendarClock className="h-5 w-5" />}
          action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>} />
        <Card padding="lg"><p className="text-center text-ink-400">You don't have any recurring deposits yet.</p></Card>
      </div>
    );
  }

  const paid = rd.installments.filter((i) => i.status === 'PAID').length;
  const pct = Math.round((paid / rd.tenureMonths) * 100);

  const statusConfig: Record<string, { variant: 'success' | 'warning' | 'info' | 'error'; icon: React.ReactNode; label: string }> = {
    PAID: { variant: 'success', icon: <CheckCircle2 className="h-4 w-4" />, label: 'Paid' },
    PENDING: { variant: 'warning', icon: <Clock className="h-4 w-4" />, label: 'Pending' },
    SCHEDULED: { variant: 'info', icon: <Calendar className="h-4 w-4" />, label: 'Scheduled' },
    OVERDUE: { variant: 'error', icon: <Clock className="h-4 w-4" />, label: 'Overdue' },
  };

  const handlePayInstallment = async () => {
    try {
      const updated = await rdService.payInstallment(rd.id);
      showToast('Installment paid successfully');
      setSelectedRd(updated);
      const data = await rdService.getByCustomer(user!.id);
      setRds(data);
    } catch {
      showToast('Failed to pay installment', 'error');
    }
  };

  const handleClose = async () => {
    try {
      await rdService.close(rd.id);
      showToast('RD closed');
      const data = await rdService.getByCustomer(user!.id);
      setRds(data);
    } catch {
      showToast('Failed to close RD', 'error');
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="RD Installment Tracker"
        subtitle={`Track your recurring deposit ${rd.rdNumber}`}
        icon={<CalendarClock className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      {rds.length > 1 && (
        <div className="mb-4 flex gap-2">
          {rds.map((r) => (
            <button key={r.id} onClick={() => setSelectedRd(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${r.id === rd.id ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
              {r.rdNumber}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="md">
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-ink-400">Monthly</p>
                <p className="font-display text-lg font-bold text-ink-900">{formatINR(rd.monthlyAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Tenure</p>
                <p className="font-display text-lg font-bold text-ink-900">{rd.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Rate</p>
                <p className="font-display text-lg font-bold text-ink-900">{rd.interestRate}% p.a.</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Maturity</p>
                <p className="font-display text-lg font-bold text-ink-900">{formatINR(rd.maturityAmount)}</p>
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink-700">Progress</span>
              <span className="text-ink-500">{paid} of {rd.tenureMonths} installments ({pct}%)</span>
            </div>
            <Progress value={paid} max={rd.tenureMonths} color="brand" />
          </Card>

          <Card padding="md">
            <CardHeader title="Installment history" icon={<CalendarClock className="h-5 w-5" />} />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <th className="px-3 py-3 text-left">No.</th>
                    <th className="px-3 py-3 text-left">Due Date</th>
                    <th className="px-3 py-3 text-left">Paid Date</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rd.installments.map((inst) => {
                    const cfg = statusConfig[inst.status] || statusConfig.SCHEDULED;
                    return (
                      <tr key={inst.installmentNumber} className="border-b border-ink-50 last:border-0">
                        <td className="px-3 py-3 text-sm font-semibold text-ink-700">#{inst.installmentNumber}</td>
                        <td className="px-3 py-3 text-sm text-ink-600">{formatDate(inst.dueDate)}</td>
                        <td className="px-3 py-3 text-sm text-ink-600">{inst.paidDate ? formatDate(inst.paidDate) : '—'}</td>
                        <td className="px-3 py-3 text-right text-sm font-semibold text-ink-900">{formatINR(inst.amount)}</td>
                        <td className="px-3 py-3 text-center">
                          <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <CardHeader title="RD summary" icon={<CalendarClock className="h-5 w-5" />} />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">RD number</span><span className="font-mono font-semibold text-ink-900">{rd.rdNumber}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Start date</span><span className="font-semibold text-ink-900">{formatDate(rd.openedDate)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Maturity date</span><span className="font-semibold text-ink-900">{formatDate(rd.maturityDate)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Payment mode</span><span className="font-semibold text-ink-900">{rd.paymentMode === 'AUTO_DEBIT' ? 'Auto Debit' : 'Manual'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Debit date</span><span className="font-semibold text-ink-900">{rd.debitDate}th of month</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Total deposited</span><span className="font-semibold text-ink-900">{formatINR(rd.totalDeposited)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Interest earned</span><span className="font-semibold text-accent-600">+{formatINR(rd.interestEarned)}</span></div>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Actions" />
            <div className="space-y-2">
              <Button fullWidth variant="primary" leftIcon={<Play className="h-4 w-4" />} onClick={handlePayInstallment} disabled={rd.status !== 'ACTIVE'}>
                Pay pending installment
              </Button>
              <Button fullWidth variant="ghost" leftIcon={<XCircle className="h-4 w-4" />} onClick={handleClose}>
                Close RD prematurely
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
