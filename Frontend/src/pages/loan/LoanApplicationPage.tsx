import { useState, useMemo } from 'react';
import { Banknote, ChevronLeft, ChevronRight, Check, User, FileText, Upload, ShieldCheck, Home, Car, GraduationCap, Gift } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox, RadioGroup } from '@/components/ui/Field';
import { Stepper, useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { computeEmi, formatINR, classNames } from '@/lib/format';

const steps = [
  { title: 'Loan Selection', description: 'Type & amount' },
  { title: 'Applicant', description: 'Your details' },
  { title: 'Co-Applicant', description: 'Optional' },
  { title: 'Collateral', description: 'Security' },
  { title: 'Documents', description: 'Upload' },
];

const loanTypes = [
  { value: 'PERSONAL', label: 'Personal Loan', icon: <User className="h-5 w-5" />, rate: 10.5, maxTenure: 60 },
  { value: 'HOME', label: 'Home Loan', icon: <Home className="h-5 w-5" />, rate: 8.5, maxTenure: 360 },
  { value: 'AUTO', label: 'Auto Loan', icon: <Car className="h-5 w-5" />, rate: 9.2, maxTenure: 84 },
  { value: 'EDUCATION', label: 'Education Loan', icon: <GraduationCap className="h-5 w-5" />, rate: 9.5, maxTenure: 180 },
  { value: 'GOLD', label: 'Gold Loan', icon: <Gift className="h-5 w-5" />, rate: 12.0, maxTenure: 36 },
];

export function LoanApplicationPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [step, setStep] = useState(0);
  const [loanType, setLoanType] = useState('PERSONAL');
  const [amount, setAmount] = useState('500000');
  const [tenure, setTenure] = useState('36');
  const [addCoApplicant, setAddCoApplicant] = useState(false);
  const [collateralType, setCollateralType] = useState('NONE');
  const [declared, setDeclared] = useState(false);
  const [consent, setConsent] = useState(false);

  const selectedLoan = loanTypes.find((l) => l.value === loanType)!;
  const emi = useMemo(() => computeEmi(Number(amount) || 0, selectedLoan.rate, Number(tenure)), [amount, selectedLoan.rate, tenure]);

  const submit = () => {
    showToast('Loan application submitted! Application No: PL-2024-001234');
    setTimeout(() => navigate('dashboard'), 1500);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Loan Application"
        subtitle="Apply for a loan in 5 simple steps"
        icon={<Banknote className="h-5 w-5" />}
        action={<Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>}
      />

      <Card padding="lg">
        <div className="mb-8">
          <Stepper steps={steps} current={step} onStepClick={(i) => i <= step && setStep(i)} />
        </div>

        <div className="animate-fade-in">
          {step === 0 && (
            <div className="space-y-5">
              <SectionTitle icon={<Banknote className="h-4 w-4" />} title="Loan Selection" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {loanTypes.map((lt) => (
                  <button key={lt.value} onClick={() => setLoanType(lt.value)}
                    className={classNames('flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      loanType === lt.value ? 'border-brand-500 bg-brand-50 shadow-glow' : 'border-ink-100 hover:border-ink-300 hover:bg-ink-50')}>
                    <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', loanType === lt.value ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500')}>{lt.icon}</div>
                    <span className="text-xs font-semibold text-ink-700">{lt.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Loan amount" required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} leftIcon={<span className="text-sm font-semibold text-ink-500">₹</span>} />
                <Select label="Tenure (months)" value={tenure} onChange={(e) => setTenure(e.target.value)}
                  options={Array.from({ length: selectedLoan.maxTenure / 12 }, (_, i) => ({ value: String((i + 1) * 12), label: `${(i + 1) * 12} months (${i + 1} yr)` }))} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select label="Loan category" options={[{ value: 'RETAIL', label: 'Retail' }, { value: 'SME', label: 'SME' }]} />
                <Select label="Purpose" options={[{ value: 'RENOVATION', label: 'Home Renovation' }, { value: 'PURCHASE', label: 'Purchase' }, { value: 'OTHER', label: 'Other' }]} />
                <div className="rounded-xl bg-brand-50 p-4">
                  <p className="text-xs text-brand-600">Estimated EMI</p>
                  <p className="font-display text-xl font-bold text-brand-700">{formatINR(emi)}/mo</p>
                  <p className="text-xs text-brand-600">{selectedLoan.rate}% p.a.</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <SectionTitle icon={<User className="h-4 w-4" />} title="Applicant Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Customer ID" value="CUST-2024-001" readOnly className="opacity-60" />
                <Input label="Full name" value="John Doe" readOnly className="opacity-60" />
                <Input label="Date of birth" value="1985-05-15" readOnly className="opacity-60" />
                <Input label="PAN number" value="ABCDE1234F" readOnly className="opacity-60" />
                <Input label="Annual income" required placeholder="₹ 15,00,000" />
                <Select label="Employment type" options={[{ value: 'SALARIED', label: 'Salaried' }, { value: 'SELF_EMPLOYED', label: 'Self-employed' }, { value: 'BUSINESS', label: 'Business' }]} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <SectionTitle icon={<User className="h-4 w-4" />} title="Co-Applicant (Optional)" />
              <Checkbox checked={addCoApplicant} onChange={setAddCoApplicant}>Add a co-applicant</Checkbox>
              {addCoApplicant && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Co-applicant name" placeholder="Jane Doe" />
                  <Select label="Relationship" options={[{ value: 'SPOUSE', label: 'Spouse' }, { value: 'PARENT', label: 'Parent' }, { value: 'SIBLING', label: 'Sibling' }]} />
                  <Input label="Income" placeholder="₹ 10,00,000" />
                  <Input label="PAN number" placeholder="FGHIJ5678K" />
                </div>
              )}
              {!addCoApplicant && <p className="text-sm text-ink-400">No co-applicant added. You can add one to improve eligibility.</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle icon={<ShieldCheck className="h-4 w-4" />} title="Collateral Details" />
              <RadioGroup label="Collateral type" name="collateral" value={collateralType} onChange={setCollateralType}
                options={[{ value: 'NONE', label: 'None (Unsecured)' }, { value: 'PROPERTY', label: 'Property' }, { value: 'GOLD', label: 'Gold' }, { value: 'VEHICLE', label: 'Vehicle' }, { value: 'FD', label: 'Fixed Deposit' }]} />
              {collateralType !== 'NONE' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Description" placeholder="Property details" />
                  <Input label="Estimated value" placeholder="₹ 50,00,000" leftIcon={<span className="text-sm font-semibold text-ink-500">₹</span>} />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <SectionTitle icon={<FileText className="h-4 w-4" />} title="Document Upload" />
              <div className="space-y-3">
                {['KYC Documents (Required)', 'Income Proof (Required)', 'Bank Statements (Required)', 'Property Documents (If applicable)'].map((doc, i) => (
                  <div key={doc} className="flex items-center justify-between rounded-xl border border-ink-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className={classNames('flex h-9 w-9 items-center justify-center rounded-lg', i < 3 ? 'bg-success-100 text-success-600' : 'bg-ink-100 text-ink-400')}>
                        {i < 3 ? <Check className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                      </div>
                      <span className="text-sm font-medium text-ink-700">{doc}</span>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Upload className="h-3.5 w-3.5" />} onClick={() => showToast('File uploaded', 'success')}>
                      {i < 3 ? 'Uploaded' : 'Upload'}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-3 rounded-xl bg-ink-50 p-4">
                <Checkbox checked={declared} onChange={setDeclared}>I declare all information is correct</Checkbox>
                <Checkbox checked={consent} onChange={setConsent}>I authorize the bank to verify my credit score</Checkbox>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
          <Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => step > 0 ? setStep(step - 1) : navigate('dashboard')}>Back</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => showToast('Draft saved', 'info')}>Save draft</Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} rightIcon={<ChevronRight className="h-4 w-4" />}>Next</Button>
            ) : (
              <Button disabled={!declared || !consent} onClick={submit} leftIcon={<Check className="h-4 w-4" />}>Submit application</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink-100 pb-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</div>
      <h3 className="font-display text-base font-bold text-ink-900">{title}</h3>
    </div>
  );
}
