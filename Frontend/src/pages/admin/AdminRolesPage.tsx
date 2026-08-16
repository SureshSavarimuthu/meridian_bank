// @/pages/admin/AdminRolesPage.tsx
import { useState } from 'react';
import { KeyRound, Plus, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { classNames } from '@/lib/format';

export function AdminRolesPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const roles = [
    { id: 1, name: 'Branch Manager', perms: 24, desc: 'Full branch operations' },
    { id: 2, name: 'Loan Officer', perms: 12, desc: 'Loan processing and approvals' },
    { id: 3, name: 'Regional Manager', perms: 18, desc: 'Multi-branch oversight' },
    { id: 4, name: 'Teller', perms: 6, desc: 'Counter operations' },
  ];

  const allPermissions = [
    'ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'ACCOUNT_UPDATE',
    'FD_CREATE', 'FD_VIEW', 'FD_RENEW',
    'RD_CREATE', 'RD_VIEW', 'RD_PAY',
    'LOAN_APPLY', 'LOAN_APPROVE', 'LOAN_REJECT',
    'TRANSACTION_INITIATE', 'TRANSACTION_APPROVE',
    'DOCUMENT_VERIFY', 'RISK_ASSESS', 'DISBURSE',
    'ADMIN_CONFIG', 'USER_MANAGE', 'REPORT_VIEW',
  ];

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [permissions, setPermissions] = useState<string[]>(['ACCOUNT_VIEW', 'ACCOUNT_CREATE', 'LOAN_APPROVE', 'DOCUMENT_VERIFY', 'RISK_ASSESS', 'DISBURSE']);

  const togglePermission = (perm: string) => {
    setPermissions(permissions.includes(perm) ? permissions.filter(p => p !== perm) : [...permissions, perm]);
  };

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="Role Management"
        subtitle="Configure roles and permissions"
        icon={<KeyRound className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card padding="md" className="lg:col-span-1 h-fit">
          <h3 className="mb-3 font-display text-sm font-bold text-ink-900">Roles</h3>
          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={classNames('w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  selectedRole.id === r.id ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
                )}
              >
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-ink-400">{r.perms} permissions</div>
              </button>
            ))}
          </div>
          <Button fullWidth variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} className="mt-4" onClick={() => showToast('Add role form opening...', 'info')}>
            New Role
          </Button>
        </Card>

        <Card padding="lg" className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-bold text-ink-900">{selectedRole.name}</h3>
            <p className="text-sm text-ink-500">{selectedRole.desc}</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {allPermissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2 rounded-lg border border-ink-100 p-3 cursor-pointer hover:bg-ink-50 transition-colors">
                  <Checkbox
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  <span className="text-sm font-medium text-ink-700">{perm.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={() => showToast('Role permissions saved', 'success')} leftIcon={<Save className="h-4 w-4" />}>
              Save Permissions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}