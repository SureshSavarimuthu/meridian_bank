import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { classNames } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary: 'bg-ink-100 text-ink-800 hover:bg-ink-200 active:bg-ink-300',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-700 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-700 shadow-sm',
  outline: 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 hover:border-ink-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leftIcon, rightIcon, loading, fullWidth, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:shadow-glow disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {leftIcon && !loading && leftIcon}
      {children}
      {rightIcon && !loading && rightIcon}
    </button>
  );
});
