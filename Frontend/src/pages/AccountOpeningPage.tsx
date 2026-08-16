import { useState } from 'react';
import { Landmark, Wallet, Building2, CreditCard, Briefcase, GraduationCap, Globe, Check, ChevronLeft, FileText } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { classNames, formatINR } from '@/lib/format';

const accountTypes = [
  { value: 'SAVINGS', label: 'Savings Account', icon: <Wallet className="h-5 w-5" />, desc: '3.5% p.a. · Min ₹5,000' },
  { value: 'CURRENT', label: 'Current Account', icon: <Building2 className="h-5 w-5" />, desc: 'For businesses · Min ₹10,000' },
  { value: 'SALARY', label: 'Salary Account', icon: <Briefcase className="h-5 w-5" />, desc: 'Zero balance · Benefits' },
  { value: 'NRI', label: 'NRI Account', icon: <Globe className="h-5 w-5" />, desc: 'For non-residents · FCNR' },
  { value: 'MINOR', label: 'Minor Account', icon: <GraduationCap className="h-5 w-5" />, desc: 'For children · Guardian operated' },
  { value: 'BUSINESS', label: 'Business Account', icon: <CreditCard className="h-5 w-5" />, desc: 'SME banking · Overdraft' },
];

export function AccountOpeningPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [type, setType] = useState('SAVINGS');
  const [deposit, setDeposit] = useState('5000');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRel, setNomineeRel] = useState('');
  const [nomineeDob, setNomineeDob] = useState('');
  const [services, setServices] = useState({ debitCard: true, netBanking: true, mobileBanking: true, chequeBook: true, overdraft: false, smsAlerts: true });
  const [showPreview, setShowPreview] = useState(false);

  const toggleService = (key: keyof typeof services) => setServices((s) => ({ ...s, [key]: !s[key] }));

  const accountInfo: Record<string, { rate: string; minBal: string; mab: string }> = {
    SAVINGS: { rate: '3.5% p.a.', minBal: '₹5,000', mab: '₹10,000' },
    CURRENT: { rate: '0% p.a.', minBal: '₹10,000', mab: '₹25,000' },
    SALARY: { rate: '3.5% p.a.', minBal: '₹0', mab: '₹0' },
    NRI: { rate: '4.0% p.a.', minBal: '₹10,000', mab: '₹25,000' },
    MINOR: { rate: '3.5% p.a.', minBal: '₹1,000', mab: '₹2,500' },
    BUSINESS: { rate: '2.5% p.a.', minBal: '₹25,000', mab: '₹50,000' },
  };

  const submit = () => {
    setShowPreview(false);
    showToast('Account application submitted! Account ID: ACC-2024-001');
    setTimeout(() => navigate('dashboard'), 1500);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Open New Account"
        subtitle="Choose your account type and complete the application"
        icon={<Landmark className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Select account type</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {accountTypes.map((at) => (
                <button
                  key={at.value}
                  onClick={() => setType(at.value)}
                  className={classNames(
                    'relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all',
                    type === at.value ? 'border-brand-500 bg-brand-50 shadow-glow' : 'border-ink-100 hover:border-ink-300 hover:bg-ink-50',
                  )}
                >
                  {type === at.value && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', type === at.value ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500')}>
                    {at.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{at.label}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{at.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Account details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Customer ID" value="CUST-2024-001" readOnly className="opacity-60" />
              <Input label="Account type" value={accountTypes.find((a) => a.value === type)?.label || ''} readOnly className="opacity-60" />
              <Input
                label="Initial deposit"
                required
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                hint="Minimum ₹1,000"
              />
              <Input label="Nominee name" value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} placeholder="Jane Doe" />
              <Select label="Nominee relationship" value={nomineeRel} onChange={(e) => setNomineeRel(e.target.value)} placeholder="Select"
                options={[{ value: 'SPOUSE', label: 'Spouse' }, { value: 'CHILD', label: 'Child' }, { value: 'PARENT', label: 'Parent' }, { value: 'SIBLING', label: 'Sibling' }, { value: 'OTHER', label: 'Other' }]} />
              <Input label="Nominee DOB" type="date" value={nomineeDob} onChange={(e) => setNomineeDob(e.target.value)} />
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Additional services</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { key: 'debitCard', label: 'Debit Card', icon: <CreditCard className="h-4 w-4" /> },
                { key: 'netBanking', label: 'Net Banking', icon: <Globe className="h-4 w-4" /> },
                { key: 'mobileBanking', label: 'Mobile Banking', icon: <Briefcase className="h-4 w-4" /> },
                { key: 'chequeBook', label: 'Cheque Book', icon: <FileText className="h-4 w-4" /> },
                { key: 'overdraft', label: 'Overdraft Facility', icon: <Wallet className="h-4 w-4" /> },
                { key: 'smsAlerts', label: 'SMS Alerts', icon: <Building2 className="h-4 w-4" /> },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => toggleService(s.key as keyof typeof services)}
                  className={classNames(
                    'flex items-center gap-3 rounded-xl border p-3.5 transition-all',
                    services[s.key as keyof typeof services] ? 'border-brand-300 bg-brand-50' : 'border-ink-100 hover:bg-ink-50',
                  )}
                >
                  <span className={classNames('flex h-9 w-9 items-center justify-center rounded-lg', services[s.key as keyof typeof services] ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-400')}>
                    {s.icon}
                  </span>
                  <span className="text-sm font-medium text-ink-700">{s.label}</span>
                  <span className="ml-auto">
                    <span className={classNames('relative inline-flex h-5 w-9 rounded-full transition-colors', services[s.key as keyof typeof services] ? 'bg-brand-600' : 'bg-ink-200')}>
                      <span className={classNames('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', services[s.key as keyof typeof services] ? 'left-4' : 'left-0.5')} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <CardHeader title="Account features" icon={<Landmark className="h-5 w-5" />} />
            <div className="space-y-3">
              {[
                { label: 'Interest rate', value: accountInfo[type].rate },
                { label: 'Minimum balance', value: accountInfo[type].minBal },
                { label: 'Monthly avg balance', value: accountInfo[type].mab },
                { label: 'Initial deposit', value: formatINR(Number(deposit) || 0) },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-ink-50 pb-2.5 last:border-0">
                  <span className="text-sm text-ink-500">{r.label}</span>
                  <span className="text-sm font-semibold text-ink-900">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <CardHeader title="Summary" icon={<FileText className="h-5 w-5" />} />
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Account type</span>
                <span className="text-sm font-semibold text-ink-900">{accountTypes.find((a) => a.value === type)?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Services selected</span>
                <span className="text-sm font-semibold text-ink-900">{Object.values(services).filter(Boolean).length} of 6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Nominee</span>
                <span className="text-sm font-semibold text-ink-900">{nomineeName || 'Not set'}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button fullWidth onClick={() => setShowPreview(true)}>Preview application</Button>
              <Button fullWidth variant="outline" onClick={() => showToast('Draft saved', 'info')}>Save draft</Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Preview application"
        subtitle="Review your details before submitting"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPreview(false)}>Edit</Button>
            <Button onClick={submit} leftIcon={<Check className="h-4 w-4" />}>Submit application</Button>
          </>
        }
      >
        <div className="space-y-4">
          <PreviewRow label="Customer ID" value="CUST-2024-001" />
          <PreviewRow label="Account type" value={accountTypes.find((a) => a.value === type)?.label || ''} />
          <PreviewRow label="Initial deposit" value={formatINR(Number(deposit) || 0)} />
          <PreviewRow label="Nominee" value={nomineeName ? `${nomineeName} (${nomineeRel})` : 'Not specified'} />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-500">Selected services</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(services).filter(([, v]) => v).map(([k]) => (
                <span key={k} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                  {k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-50 pb-2.5">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}
