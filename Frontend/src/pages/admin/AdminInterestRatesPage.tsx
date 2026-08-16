// @/pages/admin/AdminInterestRatesPage.tsx
import { Percent, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';

export function AdminInterestRatesPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Interest Rates"
        subtitle="Manage deposit and loan interest rates"
        icon={<Percent className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />

      <Card padding="lg">
        <CardHeader title="Interest Rate Configuration" subtitle="Update rates for deposit and loan products" />
        <div className="rounded-xl border border-ink-100 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Tenure</th>
                <th className="px-4 py-3 text-right">General</th>
                <th className="px-4 py-3 text-right">Senior</th>
                <th className="px-4 py-3 text-right">NRI</th>
                <th className="px-4 py-3 text-left">Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: 'FD', t: '7–14 days', g: '3.00%', s: '3.50%', n: '2.50%', e: '15 Jan 2024' },
                { p: 'FD', t: '1 year', g: '6.50%', s: '7.00%', n: '6.00%', e: '15 Jan 2024' },
                { p: 'Personal Loan', t: '36 months', g: '10.50%', s: '10.00%', n: '11.00%', e: '15 Jan 2024' },
                { p: 'Home Loan', t: '240 months', g: '8.50%', s: '8.00%', n: '9.00%', e: '15 Jan 2024' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-ink-50 last:border-0 text-sm">
                  <td className="px-4 py-3 font-medium text-ink-800">{row.p}</td>
                  <td className="px-4 py-3 text-ink-600">{row.t}</td>
                  <td className="px-4 py-3 text-right text-ink-600">{row.g}</td>
                  <td className="px-4 py-3 text-right text-ink-600">{row.s}</td>
                  <td className="px-4 py-3 text-right text-ink-600">{row.n}</td>
                  <td className="px-4 py-3 text-ink-600">{row.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Button onClick={() => showToast('Interest rates updated', 'success')} leftIcon={<Save className="h-4 w-4" />}>Update rates</Button>
        </div>
      </Card>
    </div>
  );
}