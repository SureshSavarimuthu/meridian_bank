// @/pages/admin/AdminSystemConfigPage.tsx
import { useState } from 'react';
import { Settings, Lock, Building2, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { classNames } from '@/lib/format';

export function AdminSystemConfigPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const [config, setConfig] = useState({
    maxLoanAmount: '2500000',
    minLoanAmount: '10000',
    defaultSLA: '24',
    sessionTimeout: '30',
    dailyTransactionLimit: '1000000',
    maintenanceMode: false,
    twoFactorAuth: true,
    auditLogging: true,
  });

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="System Configuration"
        subtitle="Configure system-wide settings"
        icon={<Settings className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />

      <div className="space-y-6">
        <Card padding="lg">
          <CardHeader title="Loan Settings" icon={<Building2 className="h-5 w-5" />} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Maximum Loan Amount"
              type="number"
              value={config.maxLoanAmount}
              onChange={(e) => setConfig({ ...config, maxLoanAmount: e.target.value })}
              leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
            />
            <Input
              label="Minimum Loan Amount"
              type="number"
              value={config.minLoanAmount}
              onChange={(e) => setConfig({ ...config, minLoanAmount: e.target.value })}
              leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
            />
            <Input
              label="Default SLA (hours)"
              type="number"
              value={config.defaultSLA}
              onChange={(e) => setConfig({ ...config, defaultSLA: e.target.value })}
            />
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader title="System Settings" icon={<Settings className="h-5 w-5" />} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
            />
            <Input
              label="Daily Transaction Limit"
              type="number"
              value={config.dailyTransactionLimit}
              onChange={(e) => setConfig({ ...config, dailyTransactionLimit: e.target.value })}
              leftIcon={<span className="text-xs font-semibold text-ink-500">₹</span>}
            />
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader title="Security & Features" icon={<Lock className="h-5 w-5" />} />
          <div className="space-y-4">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restrict user access for system maintenance' },
              { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Require 2FA for all users' },
              { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all admin operations' },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between border-b border-ink-100 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-ink-900">{s.label}</p>
                  <p className="text-xs text-ink-500">{s.desc}</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, [s.key]: !config[s.key as keyof typeof config] })}
                  className={classNames('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', config[s.key as keyof typeof config] ? 'bg-success-600' : 'bg-ink-200')}
                >
                  <span className={classNames('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', config[s.key as keyof typeof config] ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => showToast('Changes discarded', 'info')}>Discard</Button>
          <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => showToast('System configuration saved', 'success')}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}