import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Smartphone, Mail, MessageSquare, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthShell } from './LoginPage';
import { classNames } from '@/lib/format';

export function TwoFactorPage({ onComplete }: { onComplete: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(299);
  const [verifying, setVerifying] = useState(false);
  const [method, setMethod] = useState<'SMS' | 'EMAIL' | 'APP'>('SMS');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length) {
      const next = [...otp];
      digits.forEach((d, i) => { next[i] = d; });
      setOtp(next);
      refs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const verify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onComplete();
    }, 1000);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const methodLabel = {
    SMS: { icon: <Smartphone className="h-4 w-4" />, text: '+91 98XXX XX210' },
    EMAIL: { icon: <Mail className="h-4 w-4" />, text: 'joh***@email.com' },
    APP: { icon: <MessageSquare className="h-4 w-4" />, text: 'Authenticator app' },
  };

  return (
    <AuthShell title="Two-factor authentication" subtitle="Enter the 6-digit code to continue">
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
            {methodLabel[method].icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">Code sent via {method === 'SMS' ? 'SMS' : method === 'EMAIL' ? 'Email' : 'App'}</p>
            <p className="text-sm text-ink-500">{methodLabel[method].text}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink-700">Enter verification code</p>
          <div className="flex gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                className={classNames(
                  'h-14 w-12 rounded-xl border-2 bg-white text-center font-mono text-xl font-bold text-ink-900 outline-none transition-all',
                  digit ? 'border-brand-500 shadow-glow' : 'border-ink-200 focus:border-brand-400',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-ink-500">
            <span className={classNames('h-2 w-2 rounded-full', seconds > 0 ? 'bg-success-500' : 'bg-error-500')} />
            {seconds > 0 ? `Code expires in ${mm}:${ss}` : 'Code expired'}
          </div>
          <button
            disabled={seconds > 0}
            onClick={() => setSeconds(299)}
            className="flex items-center gap-1.5 font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:text-ink-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Resend code
          </button>
        </div>

        <Button fullWidth size="lg" loading={verifying} onClick={verify} rightIcon={<ChevronRight className="h-4 w-4" />}>
          Verify & continue
        </Button>

        <div>
          <p className="mb-2.5 text-center text-xs font-medium text-ink-400">Try another method</p>
          <div className="grid grid-cols-3 gap-2">
            {(['SMS', 'EMAIL', 'APP'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={classNames(
                  'flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all',
                  method === m
                    ? 'border-brand-300 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300 hover:bg-ink-50',
                )}
              >
                {methodLabel[m].icon}
                {m === 'SMS' ? 'SMS' : m === 'EMAIL' ? 'Email' : 'App'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-ink-50 p-3.5 text-xs text-ink-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
          <p>For your security, this code is valid for 5 minutes. Never share it with anyone.</p>
        </div>
      </div>
    </AuthShell>
  );
}
