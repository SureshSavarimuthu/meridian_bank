import { useState } from 'react';
import { UserPlus, User, Phone, IdCard, Briefcase, Check, ChevronLeft, ChevronRight, Upload, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, RadioGroup, Checkbox } from '@/components/ui/Field';
import { Stepper } from '@/components/ui/Feedback';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';

const steps = [
  { title: 'Personal', description: 'Basic details' },
  { title: 'Contact', description: 'Address & phone' },
  { title: 'Identity', description: 'KYC documents' },
  { title: 'Employment', description: 'Income details' },
];

const indianStates = [
  { value: 'MH', label: 'Maharashtra' }, { value: 'DL', label: 'Delhi' }, { value: 'KA', label: 'Karnataka' },
  { value: 'TN', label: 'Tamil Nadu' }, { value: 'WB', label: 'West Bengal' }, { value: 'GJ', label: 'Gujarat' },
  { value: 'RJ', label: 'Rajasthan' }, { value: 'UP', label: 'Uttar Pradesh' }, { value: 'KL', label: 'Kerala' },
];

export function CustomerRegistrationPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: 'MALE', maritalStatus: '', nationality: 'INDIAN',
    mobile: '', email: '', address1: '', address2: '', city: '', state: '', pin: '', residence: 'OWNED',
    idType: 'AADHAAR', idNumber: '', pan: '',
    employment: 'SALARIED', company: '', designation: '', income: '', source: '', pep: 'NO',
    terms: false, kyc: false,
  });

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const canProceed = () => {
    if (step === 0) return form.firstName && form.lastName && form.dob;
    if (step === 1) return form.mobile && form.email && form.address1 && form.city && form.state && form.pin;
    if (step === 2) return form.idNumber && form.pan;
    if (step === 3) return form.company && form.income && form.terms && form.kyc;
    return true;
  };

  const submit = () => {
    showToast('Customer registered successfully! Customer ID: CUST-2024-001');
    setTimeout(() => navigate('dashboard'), 1500);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Customer Registration"
        subtitle="Complete the 4-step KYC process to open your banking relationship"
        icon={<UserPlus className="h-5 w-5" />}
      />

      <Card padding="lg">
        <div className="mb-8">
          <Stepper steps={steps} current={step} onStepClick={(i) => i <= step && setStep(i)} />
        </div>

        <div className="animate-fade-in">
          {step === 0 && (
            <div className="space-y-5">
              <SectionTitle icon={<User className="h-4 w-4" />} title="Personal Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="First name" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="John" />
                <Input label="Middle name" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} placeholder="Optional" />
                <Input label="Last name" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Doe" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Date of birth" required type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                <RadioGroup
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={(v) => set('gender', v)}
                  options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Marital status" value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} placeholder="Select"
                  options={[{ value: 'SINGLE', label: 'Single' }, { value: 'MARRIED', label: 'Married' }, { value: 'DIVORCED', label: 'Divorced' }, { value: 'WIDOWED', label: 'Widowed' }]} />
                <Select label="Nationality" value={form.nationality} onChange={(e) => set('nationality', e.target.value)}
                  options={[{ value: 'INDIAN', label: 'Indian' }, { value: 'NRI', label: 'NRI' }, { value: 'OTHER', label: 'Other' }]} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <SectionTitle icon={<Phone className="h-4 w-4" />} title="Contact Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Mobile number" required value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+91 98765 43210" hint="10-digit mobile number" />
                <Input label="Email address" required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@email.com" />
              </div>
              <Input label="Address line 1" required value={form.address1} onChange={(e) => set('address1', e.target.value)} placeholder="123 Main Street" />
              <Input label="Address line 2" value={form.address2} onChange={(e) => set('address2', e.target.value)} placeholder="Near City Mall" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="City" required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Mumbai" />
                <Select label="State" required value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="Select state" options={indianStates} />
                <Input label="PIN code" required value={form.pin} onChange={(e) => set('pin', e.target.value)} placeholder="400001" maxLength={6} />
              </div>
              <RadioGroup
                label="Residence type"
                name="residence"
                value={form.residence}
                onChange={(v) => set('residence', v)}
                options={[{ value: 'OWNED', label: 'Owned' }, { value: 'RENTED', label: 'Rented' }, { value: 'LEASED', label: 'Leased' }]}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <SectionTitle icon={<IdCard className="h-4 w-4" />} title="Identity Documents" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="ID type" value={form.idType} onChange={(e) => set('idType', e.target.value)}
                  options={[{ value: 'AADHAAR', label: 'Aadhaar' }, { value: 'PAN', label: 'PAN' }, { value: 'PASSPORT', label: 'Passport' }, { value: 'DL', label: 'Driving License' }]} />
                <Input label="ID number" required value={form.idNumber} onChange={(e) => set('idNumber', e.target.value)} placeholder="1234 5678 9012" />
              </div>
              <Input label="PAN number" required value={form.pan} onChange={(e) => set('pan', e.target.value)} placeholder="ABCDE1234F" hint="5 letters + 4 digits + 1 letter" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UploadField label="Profile photo" hint="Max 2MB · JPG/PNG" />
                <UploadField label="ID document" hint="Max 5MB · PDF/JPG" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle icon={<Briefcase className="h-4 w-4" />} title="Employment & Income" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Employment type" value={form.employment} onChange={(e) => set('employment', e.target.value)}
                  options={[{ value: 'SALARIED', label: 'Salaried' }, { value: 'SELF_EMPLOYED', label: 'Self-employed' }, { value: 'BUSINESS', label: 'Business' }, { value: 'OTHER', label: 'Other' }]} />
                <Input label="Annual income" required value={form.income} onChange={(e) => set('income', e.target.value)} placeholder="₹ 15,00,000" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Company name" required value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Tech Corp" />
                <Input label="Designation" value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="Software Engineer" />
              </div>
              <RadioGroup
                label="Politically exposed person?"
                name="pep"
                value={form.pep}
                onChange={(v) => set('pep', v)}
                options={[{ value: 'NO', label: 'No' }, { value: 'YES', label: 'Yes' }]}
              />
              <div className="space-y-3 rounded-xl bg-ink-50 p-4">
                <Checkbox checked={form.terms} onChange={(v) => set('terms', v)}>
                  I agree to the Terms & Conditions and bank's privacy policy
                </Checkbox>
                <Checkbox checked={form.kyc} onChange={(v) => set('kyc', v)}>
                  I consent to KYC verification and credit bureau checks
                </Checkbox>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-5">
          <Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => step > 0 ? setStep(step - 1) : navigate('dashboard')}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => showToast('Draft saved', 'info')}>Save draft</Button>
            {step < 3 ? (
              <Button disabled={!canProceed()} onClick={() => setStep(step + 1)} rightIcon={<ChevronRight className="h-4 w-4" />}>
                Next
              </Button>
            ) : (
              <Button disabled={!canProceed()} onClick={submit} leftIcon={<Check className="h-4 w-4" />}>
                Submit application
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
        <ShieldCheck className="h-4 w-4" />
        Your data is encrypted and stored securely in compliance with RBI guidelines.
      </div>
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

function UploadField({ label, hint }: { label: string; hint: string }) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div>
      <label className="input-label">{label}</label>
      <button
        onClick={() => setUploaded(true)}
        className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${uploaded ? 'border-success-300 bg-success-50' : 'border-ink-200 hover:border-brand-300 hover:bg-brand-50'}`}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${uploaded ? 'bg-success-100 text-success-600' : 'bg-ink-100 text-ink-400'}`}>
          {uploaded ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
        </div>
        <div className="text-left">
          <p className={`text-sm font-semibold ${uploaded ? 'text-success-700' : 'text-ink-700'}`}>
            {uploaded ? 'File uploaded' : 'Choose file'}
          </p>
          <p className="text-xs text-ink-400">{hint}</p>
        </div>
      </button>
    </div>
  );
}
