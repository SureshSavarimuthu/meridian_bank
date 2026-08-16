import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, subtitle, action, icon }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </div>
  );
}
