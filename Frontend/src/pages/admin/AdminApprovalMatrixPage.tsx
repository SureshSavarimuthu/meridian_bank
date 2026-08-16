// @/pages/admin/AdminApprovalMatrixPage.tsx
import { FileCheck, Plus, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';

export function AdminApprovalMatrixPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Approval Matrix"
        subtitle="Configure approval workflows for loan types"
        icon={<FileCheck className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />

      <Card padding="lg">
        <CardHeader 
          title="Approval Matrix Configuration" 
          subtitle="Define approval levels for loan types and amounts" 
          action={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => showToast('Add approval rule')}>Add row</Button>} 
        />
        <div className="space-y-4">
          <div className="rounded-xl border border-ink-100 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3 text-left">Loan Type</th>
                  <th className="px-4 py-3 text-right">Min-Max Amount</th>
                  <th className="px-4 py-3 text-center">Approval Levels</th>
                  <th className="px-4 py-3 text-left">Required Roles</th>
                  <th className="px-4 py-3 text-center">SLA Hours</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Personal', range: '₹0 – ₹200K', levels: '1', role: 'Branch Manager', sla: '24' },
                  { type: 'Personal', range: '₹200K – ₹500K', levels: '2', role: 'BM → RM', sla: '48' },
                  { type: 'Home', range: '₹500K – ₹50L', levels: '3', role: 'BM → RM → CC', sla: '72' },
                  { type: 'Auto', range: '₹0 – ₹30L', levels: '2', role: 'LO → BM', sla: '48' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-ink-50 last:border-0 text-sm">
                    <td className="px-4 py-3 font-medium text-ink-800">{row.type}</td>
                    <td className="px-4 py-3 text-right text-ink-600">{row.range}</td>
                    <td className="px-4 py-3 text-center text-ink-600">{row.levels}</td>
                    <td className="px-4 py-3 text-ink-600">{row.role}</td>
                    <td className="px-4 py-3 text-center text-ink-600">{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={() => showToast('Approval matrix saved', 'success')} leftIcon={<Save className="h-4 w-4" />}>Save matrix</Button>
        </div>
      </Card>
    </div>
  );
}