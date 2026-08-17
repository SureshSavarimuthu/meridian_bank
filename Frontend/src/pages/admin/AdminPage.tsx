import {
  ShieldCheck, Users, KeyRound, FileCheck, Percent, Lock, Settings,
  Building2, ChevronRight
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNav } from '@/lib/nav';

export function AdminPage() {
  const { navigate } = useNav();

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage system users and their roles',
      icon: <Users className="h-6 w-6" />,
      route: 'admin-users' as const,
      stats: '12 Active Users',
      color: 'bg-brand-50 text-brand-600'
    },
    {
      title: 'Role Management',
      description: 'Configure roles and permissions',
      icon: <KeyRound className="h-6 w-6" />,
      route: 'admin-roles' as const,
      stats: '4 Roles Defined',
      color: 'bg-accent-100 text-accent-700'
    },
    {
      title: 'Approval Matrix',
      description: 'Set approval workflows for loans',
      icon: <FileCheck className="h-6 w-6" />,
      route: 'admin-approval-matrix' as const,
      stats: '4 Approval Rules',
      color: 'bg-warning-100 text-warning-700'
    },
    {
      title: 'Interest Rates',
      description: 'Manage deposit and loan rates',
      icon: <Percent className="h-6 w-6" />,
      route: 'admin-interest-rates' as const,
      stats: '8 Rate Configs',
      color: 'bg-success-100 text-success-600'
    },
    {
      title: 'Security',
      description: 'Security policies and audit trails',
      icon: <Lock className="h-6 w-6" />,
      route: 'admin-security' as const,
      stats: '2FA Enabled',
      color: 'bg-error-100 text-error-600'
    },
    {
      title: 'System Configuration',
      description: 'Configure system-wide settings',
      icon: <Settings className="h-6 w-6" />,
      route: 'admin-system-config' as const,
      stats: '8 Settings',
      color: 'bg-ink-100 text-ink-600'
    },
  ];

  return (
    <div>
      <PageHeader
        title="System Administration"
        subtitle="Manage users, roles, approvals, and system configurations"
        icon={<ShieldCheck className="h-5 w-5" />}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: 'Total Customers', value: '12,847', icon: <Users className="h-5 w-5" />, color: 'bg-brand-50 text-brand-600' },
          { label: 'Active Loans', value: '3,421', icon: <Building2 className="h-5 w-5" />, color: 'bg-accent-100 text-accent-700' },
          { label: 'Pending Approvals', value: '5', icon: <FileCheck className="h-5 w-5" />, color: 'bg-warning-100 text-warning-700' },
          { label: 'Total Deposits', value: '₹4.8T', icon: <Percent className="h-5 w-5" />, color: 'bg-success-100 text-success-600' },
        ].map((s) => (
          <Card key={s.label} padding="md">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="font-display text-2xl font-extrabold text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
          <Card key={module.title} padding="lg" className="group cursor-pointer hover:shadow-soft-lg transition-shadow" onClick={() => navigate(module.route)}>
            <div className="flex items-start justify-between">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${module.color}`}>
                {module.icon}
              </div>
              <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900">{module.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{module.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-ink-400">{module.stats}</span>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(module.route); }}>
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
