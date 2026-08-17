import { useState, useMemo } from 'react';
import { CalendarClock, ChevronLeft, Check, Calendar, Percent, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, RadioGroup, Checkbox } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { rdService } from '@/services/fdRdService';
import { formatINR, formatDate, computeRdMaturity } from '@/lib/format';

const tenureOptions = [
  { value: '6', label: '6 Months' }, { value: '12', label: '12 Months' },
  { value: '24', label: '24 Months' }, { value: '36', label: '36 Months' },
  { value: '48', label: '48 Months' }, { value: '60', label: '60 Months' },
  { value: '120', label: '120 Months' },
];

export function OpenRdPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [monthly, setMonthly] = useState('1000');
  const [tenure, setTenure] = useState('12');
  const [debitDate, setDebitDate] = useState('15');
  const [paymentMode, setPaymentMode] = useState('AUTO_DEBIT');
  const [nominee, setNominee] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const rate = useMemo(() => {
    const m = Number(tenure);
    if (m <= 6) return 5.5;
    if (m <= 12) return 6.75;
    if (m <= 24) return 7.0;
    if (m <= 60) return 7.25;
    return 7.5;
  }, [tenure]);

  const calc = useMemo(() => computeRdMaturity(Number(monthly) || 0, rate, Number(tenure)), [monthly, rate, tenure]);
  const maturityDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + Number(tenure));
    return d.toISOString().slice(0, 10);
  }, [tenure]);

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const result = await rdService.create({
        customerId: user.id,
        linkedAccountNumber: '0000000001',
        monthlyAmount: Number(monthly),
        tenureMonths: Number(tenure),
        debitDate: Number(debitDate),
        paymentMode,
        nomineeName: nominee || undefined,
      });
      showToast(`RD opened successfully! RD No: ${result.rdNumber}`);
      setTimeout(() => navigate('rd-tracker'), 1500);
    } catch {
      showToast('Failed to open RD', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Open Recurring Deposit"
        subtitle="Save regularly, earn guaranteed returns"
        icon={<CalendarClock className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">RD details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Monthly installment" required type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} hint="Min ₹500 · No maximum" leftIcon={<span className="text-sm font-semibold text-ink-500">₹</span>} />
              <Select label="Tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} options={tenureOptions} />
              <div>
                <label className="input-label">Interest rate</label>
                <div className="flex h-11 items-center gap-2 rounded-xl bg-accent-50 px-4 text-accent-700">
                  <Percent className="h-4 w-4" />
                  <span className="font-display text-base font-bold">{rate}% p.a.</span>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Installment details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Debit date (day of month)" value={debitDate} onChange={(e) => setDebitDate(e.target.value)}
                options={Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}` }))} />
              <RadioGroup label="Payment mode" name="paymentMode" value={paymentMode} onChange={setPaymentMode}
                options={[{ value: 'AUTO_DEBIT', label: 'Auto Debit' }, { value: 'MANUAL', label: 'Manual Payment' }]} />
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Nominee details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nominee name" value={nominee} onChange={(e) => setNominee(e.target.value)} />
              <Select label="Relationship" options={[{ value: 'SPOUSE', label: 'Spouse' }, { value: 'CHILD', label: 'Child' }, { value: 'PARENT', label: 'Parent' }]} />
            </div>
            <div className="mt-4">
              <Checkbox checked={acknowledged} onChange={setAcknowledged}>
                I understand that missing 3 consecutive installments will lead to RD closure
              </Checkbox>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md" className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <div className="flex items-center gap-2 text-brand-200">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Maturity calculation</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Monthly installment</span>
                <span className="font-display text-lg font-bold">{formatINR(Number(monthly) || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Total installments</span>
                <span className="font-display text-lg font-bold">{tenure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Total deposits</span>
                <span className="font-display text-lg font-bold">{formatINR(calc.totalDeposits)}</span>
              </div>
              <div className="my-3 h-px bg-brand-700" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Interest earned</span>
                <span className="font-display text-lg font-bold text-accent-300">+{formatINR(calc.interestEarned)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Maturity amount</span>
                <span className="font-display text-2xl font-extrabold text-white">{formatINR(calc.maturityAmount)}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-xs text-brand-300">
                <Calendar className="h-3.5 w-3.5" />
                Matures on {formatDate(maturityDate)}
              </div>
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="RD features" icon={<Wallet className="h-5 w-5" />} />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Min installment</span><span className="font-semibold text-ink-900">₹500</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Max tenure</span><span className="font-semibold text-ink-900">120 months</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Premature closure</span><span className="font-semibold text-ink-900">Allowed</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Loan against RD</span><span className="font-semibold text-ink-900">Up to 80%</span></div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button fullWidth size="lg" disabled={!acknowledged || submitting} onClick={submit} leftIcon={<Check className="h-4 w-4" />}>
              {submitting ? 'Opening RD…' : 'Confirm & open RD'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
