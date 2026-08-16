import { useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { classNames } from '@/lib/format';

export interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, current, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const isComplete = i < current;
          const isCurrent = i === current;
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className={classNames('flex items-center', !isLast && 'flex-1')}>
              <button
                type="button"
                disabled={!onStepClick || i > current}
                onClick={() => onStepClick?.(i)}
                className="flex items-center gap-3"
              >
                <span
                  className={classNames(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all',
                    isComplete && 'bg-brand-600 text-white',
                    isCurrent && 'bg-brand-600 text-white ring-4 ring-brand-100',
                    !isComplete && !isCurrent && 'bg-ink-100 text-ink-400',
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <div className="hidden text-left sm:block">
                  <p className={classNames(
                    'text-xs font-semibold',
                    (isComplete || isCurrent) ? 'text-ink-900' : 'text-ink-400',
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-ink-400">{step.description}</p>
                  )}
                </div>
              </button>
              {!isLast && (
                <div className={classNames('mx-3 h-0.5 flex-1 rounded-full transition-colors', isComplete ? 'bg-brand-600' : 'bg-ink-200')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, showToast };
}

export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  const colors = {
    success: 'bg-success-600',
    error: 'bg-error-600',
    info: 'bg-brand-600',
    warning: 'bg-warning-600',
  };
  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-slide-up">
      <div className={classNames('flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-medium text-white shadow-soft-lg', colors[toast.type])}>
        {toast.message}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        {icon}
      </div>
      <h3 className="font-display text-base font-bold text-ink-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
