// import { useState, type ReactNode } from 'react';
// import { Landmark, Lock, User, Eye, EyeOff, Fingerprint, ScanFace, Smartphone, ShieldCheck } from 'lucide-react';
// import { useAuth } from '@/lib/auth';
// import { useNav } from '@/lib/nav';
// import { Button } from '@/components/ui/Button';
// import { Input, Checkbox } from '@/components/ui/Field';
// import { TwoFactorPage } from './TwoFactor';

// export function LoginPage() {
//   const { login, loading } = useAuth();
//   const { navigate } = useNav();
//   const [userId, setUserId] = useState('john.doe');
//   const [password, setPassword] = useState('Secure@123');
//   const [showPwd, setShowPwd] = useState(false);
//   const [remember, setRemember] = useState(true);
//   const [loginType, setLoginType] = useState<'CUSTOMER' | 'EMPLOYEE' | 'ADMIN'>('CUSTOMER');
//   const [show2FA, setShow2FA] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await login(userId, password, loginType);
//       navigate('dashboard');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   if (show2FA) {
//     return <TwoFactorPage onComplete={() => navigate('dashboard')} />;
//   }

//   return (
//     <AuthShell title="Welcome back" subtitle="Sign in to your secure banking portal">
//       <div className="mb-4 flex gap-2">
//         {(['CUSTOMER', 'EMPLOYEE', 'ADMIN'] as const).map((type) => (
//           <button
//             key={type}
//             onClick={() => {
//               setLoginType(type);
//               setError('');
//             }}
//             className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${
//               loginType === type
//                 ? 'bg-brand-600 text-white shadow-md'
//                 : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
//             }`}
//           >
//             {type === 'CUSTOMER' ? 'Customer' : type === 'EMPLOYEE' ? 'Employee' : 'Admin'}
//           </button>
//         ))}
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleLogin} className="space-y-5">
//         <Input
//           label="User ID / Customer ID"
//           required
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           leftIcon={<User className="h-4 w-4" />}
//           placeholder="Enter your user ID"
//           disabled={isLoading || loading}
//         />
//         <Input
//           label="Password"
//           required
//           type={showPwd ? 'text' : 'password'}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           leftIcon={<Lock className="h-4 w-4" />}
//           rightIcon={
//             <button
//               type="button"
//               onClick={() => setShowPwd((v) => !v)}
//               className="text-gray-500 hover:text-gray-700"
//               disabled={isLoading || loading}
//             >
//               {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//             </button>
//           }
//           placeholder="Enter your password"
//           disabled={isLoading || loading}
//         />
//         <div className="flex items-center justify-between">
//           <Checkbox checked={remember} onChange={setRemember} disabled={isLoading || loading}>
//             Remember me
//           </Checkbox>
//           <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
//             Forgot password?
//           </button>
//         </div>
//         <Button type="submit" fullWidth size="lg" loading={isLoading || loading} disabled={!userId || !password}>
//           Sign in securely
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           fullWidth
//           onClick={() => navigate('register')}
//           disabled={isLoading || loading}
//         >
//           Create new account
//         </Button>
//       </form>

//       <div className="mt-6">
//         <div className="relative flex items-center gap-3 text-xs text-gray-500">
//           <div className="h-px flex-1 bg-gray-200" />
//           <span className="font-medium">Or sign in with</span>
//           <div className="h-px flex-1 bg-gray-200" />
//         </div>
//         <div className="mt-4 grid grid-cols-3 gap-3">
//           {[
//             { icon: <Fingerprint className="h-5 w-5" />, label: 'Fingerprint' },
//             { icon: <ScanFace className="h-5 w-5" />, label: 'Face ID' },
//             { icon: <Smartphone className="h-5 w-5" />, label: 'OTP' },
//           ].map((m) => (
//             <button
//               key={m.label}
//               onClick={() => setShow2FA(true)}
//               disabled={isLoading || loading}
//               className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-300 bg-white py-3.5 text-xs font-medium text-gray-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
//             >
//               {m.icon}
//               {m.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-brand-50 p-3.5 text-xs text-brand-800">
//         <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
//         <p>Never share your password or OTP with anyone. Meridian Bank will never ask for these.</p>
//       </div>
//     </AuthShell>
//   );
// }

// export function RegisterPage() {
//   const { navigate } = useNav();
//   return (
//     <AuthShell title="Create your account" subtitle="Join Meridian Bank in minutes">
//       <div className="space-y-5">
//         <Input label="Full name" required placeholder="John Doe" leftIcon={<User className="h-4 w-4" />} />
//         <Input label="Email address" required type="email" placeholder="john@email.com" />
//         <Input label="Mobile number" required placeholder="+91 98765 43210" />
//         <Input label="Create password" required type="password" placeholder="Min 8 characters" leftIcon={<Lock className="h-4 w-4" />} />
//         <Checkbox>
//           I agree to the <span className="font-semibold text-brand-600">Terms & Conditions</span> and consent to KYC verification
//         </Checkbox>
//         <Button fullWidth size="lg" onClick={() => navigate('customer-registration')}>
//           Continue to registration
//         </Button>
//         <button onClick={() => navigate('login')} className="w-full text-center text-sm font-medium text-ink-500 hover:text-ink-700">
//           Already have an account? <span className="font-semibold text-brand-600">Sign in</span>
//         </button>
//       </div>
//     </AuthShell>
//   );
// }

// export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
//   return (
//     <div className="flex min-h-screen">
//       <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex">
//         <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
//         <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
//         <div className="relative flex items-center gap-3 text-white">
//           <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
//             <Landmark className="h-6 w-6" />
//           </div>
//           <div>
//             <p className="font-display text-xl font-extrabold tracking-tight">Meridian Bank</p>
//             <p className="-mt-1 text-sm text-brand-200">Secure Digital Banking</p>
//           </div>
//         </div>
//         <div className="relative">
//           <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
//             Banking that moves<br />at the speed of life.
//           </h2>
//           <p className="mt-4 max-w-md text-lg text-brand-200">
//             Manage your accounts, deposits, loans, and transfers — all in one beautifully simple, secure portal.
//           </p>
//           <div className="mt-8 flex gap-6">
//             {[
//               { stat: '₹4.8T+', label: 'Assets managed' },
//               { stat: '12M+', label: 'Active customers' },
//               { stat: '99.99%', label: 'Uptime SLA' },
//             ].map((s) => (
//               <div key={s.label}>
//                 <p className="font-display text-2xl font-bold text-white">{s.stat}</p>
//                 <p className="text-sm text-brand-300">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="relative flex items-center gap-2 text-sm text-brand-300">
//           <ShieldCheck className="h-4 w-4" />
//           256-bit encrypted · RBI compliant · ISO 27001 certified
//         </div>
//       </div>
//       <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
//         <div className="w-full max-w-md">
//           <div className="mb-8 lg:hidden">
//             <div className="flex items-center gap-2.5">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
//                 <Landmark className="h-5 w-5" />
//               </div>
//               <p className="font-display text-lg font-extrabold text-ink-900">Meridian Bank</p>
//             </div>
//           </div>
//           <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
//           <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
//           <div className="mt-8">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, type ReactNode } from 'react';
import { Landmark, Lock, User, Eye, EyeOff, Fingerprint, ScanFace, Smartphone, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNav } from '@/lib/nav';
import { Button } from '@/components/ui/Button';
import { Input, Checkbox } from '@/components/ui/Field';
import { TwoFactorPage } from './TwoFactor';

export function LoginPage() {
  const { login, loading } = useAuth();
  const { navigate } = useNav();
  const [userId, setUserId] = useState('john.doe');
  const [password, setPassword] = useState('Secure@123');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loginType, setLoginType] = useState<'CUSTOMER' | 'EMPLOYEE' | 'ADMIN'>('CUSTOMER');
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(userId, password, loginType);
      navigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (show2FA) {
    return <TwoFactorPage onComplete={() => navigate('dashboard')} />;
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your secure banking portal">
      {/* Demo credentials note */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-700 font-medium">Customer:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-800">john.doe / Secure@123</code>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-700 font-medium">Loan Officer:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-800">loan.officer / Secure@123</code>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-700 font-medium">Branch Manager:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-800">branch.manager / Secure@123</code>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-700 font-medium">Admin:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-800">admin.user / Secure@123</code>
          </div>
        </div>
        <p className="mt-2 text-xs text-blue-600">Use any of the above credentials to login with the corresponding role.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="User ID / Customer ID"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          placeholder="Enter your user ID"
          disabled={isLoading || loading}
        />
        <Input
          label="Password"
          required
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading || loading}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          placeholder="Enter your password"
          disabled={isLoading || loading}
        />
        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember} disabled={isLoading || loading}>
            Remember me
          </Checkbox>
          <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </button>
        </div>
        <Button type="submit" fullWidth size="lg" loading={isLoading || loading} disabled={!userId || !password}>
          Sign in securely
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => navigate('register')}
          disabled={isLoading || loading}
        >
          Create new account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center gap-3 text-xs text-gray-500">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="font-medium">Or sign in with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: <Fingerprint className="h-5 w-5" />, label: 'Fingerprint' },
            { icon: <ScanFace className="h-5 w-5" />, label: 'Face ID' },
            { icon: <Smartphone className="h-5 w-5" />, label: 'OTP' },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => setShow2FA(true)}
              disabled={isLoading || loading}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-300 bg-white py-3.5 text-xs font-medium text-gray-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-brand-50 p-3.5 text-xs text-brand-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p>Never share your password or OTP with anyone. Meridian Bank will never ask for these.</p>
      </div>
    </AuthShell>
  );
}
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">Meridian Bank</p>
            <p className="-mt-1 text-sm text-brand-200">Secure Digital Banking</p>
          </div>
        </div>
        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
            Banking that moves<br />at the speed of life.
          </h2>
          <p className="mt-4 max-w-md text-lg text-brand-200">
            Manage your accounts, deposits, loans, and transfers — all in one beautifully simple, secure portal.
          </p>
          <div className="mt-8 flex gap-6">
            {[
              { stat: '₹4.8T+', label: 'Assets managed' },
              { stat: '12M+', label: 'Active customers' },
              { stat: '99.99%', label: 'Uptime SLA' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white">{s.stat}</p>
                <p className="text-sm text-brand-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-brand-300">
          <ShieldCheck className="h-4 w-4" />
          256-bit encrypted · RBI compliant · ISO 27001 certified
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Landmark className="h-5 w-5" />
              </div>
              <p className="font-display text-lg font-extrabold text-ink-900">Meridian Bank</p>
            </div>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}