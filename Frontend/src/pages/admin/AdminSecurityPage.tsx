// @/pages/admin/AdminSecurityPage.tsx
import { Lock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNav } from '@/lib/nav';

export function AdminSecurityPage() {
  const { navigate } = useNav();

  return (
    <div>
      <PageHeader
        title="Security"
        subtitle="Security policies and audit trails"
        icon={<Lock className="h-5 w-5" />}
        action={<Button variant="ghost" onClick={() => navigate('admin')}>Back to Admin</Button>}
      />

      <Card padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-ink-900">Security Module</h3>
          <p className="mt-1 text-sm text-ink-500">Advanced security policies and audit trails available in the full version.</p>
          <Button className="mt-4" variant="outline">Learn more</Button>
        </div>
      </Card>
    </div>
  );
}