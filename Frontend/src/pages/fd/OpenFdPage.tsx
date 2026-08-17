import { useState, useMemo } from 'react';
import { PiggyBank, ChevronLeft, Check, Calculator, TrendingUp, Calendar, Percent } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { fdService } from '@/services/fdRdService';
import { formatINR, formatDate, computeFdMaturity, classNames } from '@/lib/format';
import type { FdType, PayoutFrequency } from '@/lib/types';

const fdTypes: { value: FdType; label: string; desc: string }[] = [
  { value: 'CUMULATIVE', label: 'Cumulative', desc: 'Interest compounded & paid at maturity' },
  { value: 'NON_CUMULATIVE', label: 'Non-Cumulative', desc: 'Regular interest payouts' },
  { value: 'FLEXI', label: 'Flexi FD', desc: 'Sweep-in facility with savings' },
  { value: 'TAX_SAVER', label: 'Tax Saver', desc: '5-year lock-in · 80C benefit' },
];

const tenureOptions = [
  { value: '7', label: '7 Days' }, { value: '30', label: '1 Month' }, { value: '90', label: '3 Months' },
  { value: '180', label: '6 Months' }, { value: '365', label: '1 Year' }, { value: '730', label: '2 Years' },
  { value: '1095', label: '3 Years' }, { value: '1825', label: '5 Years' }, { value: '3650', label: '10 Years' },
];

export function OpenFdPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [fdType, setFdType] = useState<FdType>('CUMULATIVE');
  const [amount, setAmount] = useState('100000');
  const [tenure, setTenure] = useState('365');
  const [payout, setPayout] = useState<PayoutFrequency>('AT_MATURITY');
  const [autoRenew, setAutoRenew] = useState(true);
  const [nominee, setNominee] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const rate = useMemo(() => {
    const days = Number(tenure);
    if (days <= 14) return 3.0;
    if (days <= 30) return 3.5;
    if (days <= 90) return 4.5;
    if (days <= 180) return 5.5;
    if (days <= 365) return 6.5;
    if (days <= 730) return 7.0;
    if (days <= 1095) return 7.25;
    return 7.5;
  }, [tenure]);

  const calc = useMemo(() => computeFdMaturity(Number(amount) || 0, rate, Math.floor(Number(tenure) / 30) || 12), [amount, rate, tenure]);
  const maturityDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + Number(tenure));
    return d.toISOString().slice(0, 10);
  }, [tenure]);

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const result = await fdService.create({
        customerId: user.id,
        linkedAccountNumber: '0000000001',
        fdType,
        principal: Number(amount),
        tenureDays: Number(tenure),
        payoutFrequency: payout,
        autoRenew,
        nomineeName: nominee || undefined,
      });
      showToast(`FD opened successfully! FD No: ${result.fdNumber}`);
      setTimeout(() => navigate('fd-list'), 1500);
    } catch {
      showToast('Failed to open FD', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Open Fixed Deposit"
        subtitle="Grow your savings with guaranteed returns"
        icon={<PiggyBank className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card padding="md">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">FD details</h3>
            <div className="space-y-4">
              <div>
                <label className="input-label">FD type</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {fdTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setFdType(t.value)}
                      className={classNames(
                        'flex flex-col items-start gap-1 rounded-xl border-2 p-3.5 text-left transition-all',
                        fdType === t.value ? 'border-brand-500 bg-brand-50' : 'border-ink-100 hover:border-ink-300 hover:bg-ink-50',
                      )}
                    >
                      <span className="text-sm font-bold text-ink-900">{t.label}</span>
                      <span className="text-xs text-ink-400">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Deposit amount" required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} hint="Min ₹1,000 · No maximum" leftIcon={<span className="text-sm font-semibold text-ink-500">₹</span>} />
                <Select label="Tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} options={tenureOptions} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="input-label">Interest rate</label>
                  <div className="flex h-11 items-center gap-2 rounded-xl bg-accent-50 px-4 text-accent-700">
                    <Percent className="h-4 w-4" />
                    <span className="font-display text-base font-bold">{rate}% p.a.</span>
                  </div>
                </div>
                {fdType === 'NON_CUMULATIVE' && (
                  <Select label="Payout frequency" value={payout} onChange={(e) => setPayout(e.target.value as PayoutFrequency)}
                    options={[{ value: 'MONTHLY', label: 'Monthly' }, { value: 'QUARTERLY', label: 'Quarterly' }, { value: 'ANNUAL', label: 'Annual' }, { value: 'AT_MATURITY', label: 'At Maturity' }]} />
                )}
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Additional options</h3>
            <div className="space-y-3">
              <Checkbox checked={autoRenew} onChange={setAutoRenew}>
                Auto-renew on maturity (same period)
              </Checkbox>
              <Input label="Nominee name" value={nominee} onChange={(e) => setNominee(e.target.value)} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card padding="md" className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <div className="flex items-center gap-2 text-brand-200">
              <Calculator className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Calculation summary</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Principal</span>
                <span className="font-display text-lg font-bold">{formatINR(Number(amount) || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Interest rate</span>
                <span className="font-display text-lg font-bold">{rate}% p.a.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-200">Tenure</span>
                <span className="font-display text-lg font-bold">{tenureOptions.find((t) => t.value === tenure)?.label}</span>
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
            <CardHeader title="Quick stats" icon={<TrendingUp className="h-5 w-5" />} />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">TDS applicable</span><span className="font-semibold text-ink-900">Yes (10% if interest &gt; ₹40K)</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Premature withdrawal</span><span className="font-semibold text-ink-900">Allowed (1% penalty)</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Loan against FD</span><span className="font-semibold text-ink-900">Up to 90% of deposit</span></div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button fullWidth size="lg" onClick={submit} disabled={submitting} leftIcon={<Check className="h-4 w-4" />}>
              {submitting ? 'Opening FD…' : 'Confirm & open FD'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
