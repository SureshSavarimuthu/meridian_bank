import type { ReactNode } from 'react';
import { classNames } from '@/lib/format';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

export function DataTable<T>({ columns, data, rowKey, onRowClick, emptyState }: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div className="py-8">{emptyState}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-ink-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={classNames(
                  'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  (!col.align || col.align === 'left') && 'text-left',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={classNames(
                'border-b border-ink-50 transition-colors last:border-0',
                onRowClick && 'cursor-pointer hover:bg-ink-50',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={classNames(
                    'whitespace-nowrap px-4 py-3.5 text-sm text-ink-700',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className,
                  )}
                >
                  {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
