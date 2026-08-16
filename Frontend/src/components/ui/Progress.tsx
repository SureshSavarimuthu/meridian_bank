import { classNames } from '@/lib/format';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  color?: 'brand' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export function Progress({ value, max, className, color = 'brand', size = 'md' }: ProgressProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorClasses = {
    brand: 'bg-brand-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  return (
    <div className={classNames('w-full overflow-hidden rounded-full bg-ink-100', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}>
      <div
        className={classNames('h-full rounded-full transition-all duration-500', colorClasses[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
