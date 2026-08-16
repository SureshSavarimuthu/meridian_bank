import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { classNames } from '@/lib/format';

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

function wrapField<T extends FieldProps>(Comp: React.ComponentType<T>) {
  return function FieldWrapper({ label, hint, error, required, ...rest }: T) {
    return (
      <div className="w-full">
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="ml-0.5 text-error-500">*</span>}
          </label>
        )}
        <Comp {...(rest as T)} />
        {error ? (
          <p className="mt-1 text-xs font-medium text-error-600">{error}</p>
        ) : hint ? (
          <p className="input-hint">{hint}</p>
        ) : null}
      </div>
    );
  };
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, leftIcon, rightIcon, className, inputClassName, ...rest },
  ref,
) {
  const input = (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={classNames(
          'input-base',
          leftIcon ? 'pl-10' : '',
          rightIcon ? 'pr-10' : '',
          error && 'border-error-300 focus:border-error-500 focus:shadow-none',
          inputClassName,
        )}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400">
          {rightIcon}
        </span>
      )}
    </div>
  );
  return (
    <div className={className}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      {input}
      {error ? (
        <p className="mt-1 text-xs font-medium text-error-600">{error}</p>
      ) : hint ? (
        <p className="input-hint">{hint}</p>
      ) : null}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, options, placeholder, className, ...rest },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            'input-base appearance-none pr-10',
            error && 'border-error-300 focus:border-error-500 focus:shadow-none',
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" viewBox="0 0 20 20" fill="none">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-error-600">{error}</p>
      ) : hint ? (
        <p className="input-hint">{hint}</p>
      ) : null}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className, ...rest },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={classNames('input-base resize-none', error && 'border-error-300')}
        rows={3}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-xs font-medium text-error-600">{error}</p>
      ) : hint ? (
        <p className="input-hint">{hint}</p>
      ) : null}
    </div>
  );
});

interface RadioGroupProps extends FieldProps {
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({ label, name, value, options, onChange, hint, error, className }: RadioGroupProps) {
  return (
    <div className={className}>
      {label && <label className="input-label">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange?.(o.value)}
            className={classNames(
              'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
              value === o.value
                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-glow'
                : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-error-600">{error}</p> : hint ? <p className="input-hint">{hint}</p> : null}
    </div>
  );
}

interface CheckboxProps extends FieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children: ReactNode;
}

export function Checkbox({ label, checked, onChange, children, hint, error }: CheckboxProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <span
          className={classNames(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
            checked ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white',
          )}
        >
          {checked && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm text-ink-700">
          {children || label}
        </span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className="sr-only" />
      </label>
      {error ? <p className="mt-1 text-xs font-medium text-error-600">{error}</p> : hint ? <p className="input-hint">{hint}</p> : null}
    </div>
  );
}
