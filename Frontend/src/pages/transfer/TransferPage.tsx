import { useState } from 'react';
import { ArrowLeftRight, ChevronLeft, Check, ShieldCheck, Plus, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { accounts, beneficiaries } from '@/lib/mockData';
import { formatINR, classNames } from '@/lib/format';
import type { TransferType } from '@/lib/types';

const transferTypes: { value: TransferType; label: string; desc: string }[] = [
  { value: 'NEFT', label: 'NEFT', desc: 'Free · 30 min settlement' },
  { value: 'RTGS', label: 'RTGS', desc: '₹5 + GST · Real-time · Min ₹2L' },
  { value: 'IMPS', label: 'IMPS', desc: '₹5 + GST · Instant 24/7' },
  { value: 'UPI', label: 'UPI', desc: 'Free · Instant · 24/7' },
  { value: 'INTERNAL', label: 'Internal', desc: 'Free · Instant within bank' },
];

export function TransferPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [type, setType] = useState<TransferType>('NEFT');
  const [fromAccount, setFromAccount] = useState(accounts[0].id);
  const [useBeneficiary, setUseBeneficiary] = useState(true);
  const [beneficiary, setBeneficiary] = useState(beneficiaries[0].id);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const fromAcc = accounts.find((a) => a.id === fromAccount)!;
  const selectedBeneficiary = beneficiaries.find((b) => b.id === beneficiary);
  const transferFee = type === 'NEFT' || type === 'UPI' || type === 'INTERNAL' ? 0 : 5;
  const gst = transferFee * 0.18;
  const total = (Number(amount) || 0) + transferFee + gst;

  const confirm = () => {
    setShowConfirm(false);
    showToast('Transfer successful! UTR: UTR123456789');
    setTimeout(() => navigate('dashboard'), 1800);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Fund Transfer"
        subtitle="Send money securely to any account"
        icon={<ArrowLeftRight className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Transfer type</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {transferTypes.map((t) => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={classNames('flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all',
                    type === t.value ? 'border-brand-500 bg-brand-50 shadow-glow' : 'border-ink-100 hover:border-ink-300 hover:bg-ink-50')}>
                  <span className="text-sm font-bold text-ink-900">{t.label}</span>
                  <span className="text-xs text-ink-400">{t.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">From account</h3>
            <Select label="Select account" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}
              options={accounts.map((a) => ({ value: a.id, label: `${a.type.charAt(0)}${a.type.slice(1).toLowerCase()} · XXXX${a.accountNumber.slice(-4)} · ${formatINR(a.balance)}` }))} />
            <div className="mt-3 rounded-xl bg-brand-50 p-3.5 text-sm">
              <span className="text-brand-700">Available balance: </span>
              <span className="font-bold text-brand-800">{formatINR(fromAcc.balance, { decimals: true })}</span>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Beneficiary details</h3>
            <div className="mb-4 flex gap-2">
              <button onClick={() => setUseBeneficiary(true)}
                className={classNames('flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all',
                  useBeneficiary ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500 hover:bg-ink-50')}>
                Saved beneficiaries
              </button>
              <button onClick={() => setUseBeneficiary(false)}
                className={classNames('flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all',
                  !useBeneficiary ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-100 text-ink-500 hover:bg-ink-50')}>
                New beneficiary
              </button>
            </div>

            {useBeneficiary ? (
              <div className="space-y-3">
                <Select label="Select beneficiary" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)}
                  options={beneficiaries.map((b) => ({ value: b.id, label: `${b.name} · ${b.bankName}` }))} />
                {selectedBeneficiary && (
                  <div className="rounded-xl border border-ink-100 p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-ink-400">Account number</p><p className="font-mono font-semibold text-ink-900">{selectedBeneficiary.accountNumber}</p></div>
                      <div><p className="text-xs text-ink-400">IFSC</p><p className="font-mono font-semibold text-ink-900">{selectedBeneficiary.ifsc}</p></div>
                      <div><p className="text-xs text-ink-400">Bank</p><p className="font-semibold text-ink-900">{selectedBeneficiary.bankName}</p></div>
                      <div><p className="text-xs text-ink-400">Name</p><p className="font-semibold text-ink-900">{selectedBeneficiary.name}</p></div>
                    </div>
                  </div>
                )}
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setUseBeneficiary(false)}>Add new beneficiary</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Account number" required placeholder="98765432109" />
                <Input label="Confirm account number" required placeholder="98765432109" />
                <Input label="Account holder name" required placeholder="Jane Smith" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select label="Bank name" options={[{ value: 'XYZ', label: 'XYZ Bank' }, { value: 'SBI', label: 'State Bank of India' }, { value: 'HDFC', label: 'HDFC Bank' }]} />
                  <Input label="IFSC code" required placeholder="XYZW0123456" rightIcon={<button className="text-xs font-semibold text-brand-600 hover:text-brand-700">Verify</button>} />
                </div>
              </div>
            )}
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 font-display text-base font-bold text-ink-900">Transaction details</h3>
            <div className="space-y-4">
              <Input label="Amount" required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" leftIcon={<span className="text-sm font-semibold text-ink-500">₹</span>} />
              <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Rent payment" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <CardHeader title="Charges summary" icon={<Building2 className="h-5 w-5" />} />
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Transfer amount</span><span className="font-semibold text-ink-900">{formatINR(Number(amount) || 0, { decimals: true })}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Transfer fee</span><span className="font-semibold text-ink-900">{transferFee === 0 ? 'Free' : formatINR(transferFee)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">GST</span><span className="font-semibold text-ink-900">{gst === 0 ? '—' : formatINR(gst, { decimals: true })}</span></div>
              <div className="my-2 h-px bg-ink-100" />
              <div className="flex justify-between"><span className="font-semibold text-ink-700">Total debit</span><span className="font-display text-lg font-bold text-ink-900">{formatINR(total, { decimals: true })}</span></div>
            </div>
          </Card>

          <div className="space-y-2">
            <Button fullWidth size="lg" disabled={!amount} onClick={() => setShowConfirm(true)} leftIcon={<Check className="h-4 w-4" />}>Confirm transfer</Button>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-ink-50 p-3.5 text-xs text-ink-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <p>You will receive an OTP on your registered mobile to confirm this transaction.</p>
          </div>
        </div>
      </div>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm transfer" subtitle="Review your transfer details" size="md"
        footer={<><Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button><Button onClick={confirm} leftIcon={<Check className="h-4 w-4" />}>Confirm & send OTP</Button></>}>
        <div className="space-y-3">
          <PreviewRow label="Transfer type" value={type} />
          <PreviewRow label="From" value={`XXXX${fromAcc.accountNumber.slice(-4)}`} />
          <PreviewRow label="To" value={useBeneficiary ? selectedBeneficiary?.name || '' : 'New beneficiary'} />
          <PreviewRow label="Amount" value={formatINR(Number(amount) || 0, { decimals: true })} />
          <PreviewRow label="Charges" value={transferFee === 0 ? 'Free' : formatINR(transferFee + gst, { decimals: true })} />
          <PreviewRow label="Total" value={formatINR(total, { decimals: true })} />
        </div>
      </Modal>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-50 pb-2.5 last:border-0">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}
