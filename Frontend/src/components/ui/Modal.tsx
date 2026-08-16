import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { classNames } from '@/lib/format';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={classNames(
        'relative w-full rounded-t-3xl bg-white shadow-soft-lg animate-slide-up sm:rounded-2xl',
        sizeClasses[size],
      )}>
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
            <div>
              {title && <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
