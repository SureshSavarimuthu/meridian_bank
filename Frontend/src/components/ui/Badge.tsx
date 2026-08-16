import type { ReactNode } from 'react';
import { classNames } from '@/lib/format';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
type Size = 'sm' | 'md';

interface BadgeProps {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-ink-100 text-ink-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  info: 'bg-brand-100 text-brand-700',
  neutral: 'bg-ink-50 text-ink-500 border border-ink-200',
  brand: 'bg-brand-600 text-white',
};

const dotColors: Record<Variant, string> = {
  default: 'bg-ink-400',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-brand-500',
  neutral: 'bg-ink-400',
  brand: 'bg-white',
};

export function Badge({ variant = 'default', size = 'sm', dot, children, className }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantClasses[variant],
        className,
      )}
    >
      {dot && <span className={classNames('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
