import { useState, useEffect } from 'react';
import { PiggyBank, Plus, Eye, RefreshCw, ArrowDownToLine, Receipt, ChevronLeft, Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { useToast, Toast } from '@/components/ui/Feedback';
import { useNav } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { fdService, type FdResponse } from '@/services/fdRdService';
import { formatINR, formatDate, classNames } from '@/lib/format';

export function FdListPage() {
  const { navigate } = useNav();
  const { toast, showToast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FdResponse | null>(null);
  const [fds, setFds] = useState<FdResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fdService.getByCustomer(user.id)
      .then(setFds)
      .catch(() => showToast('Failed to load FDs', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = fds.filter((f) => {
    if (filter !== 'ALL' && f.status !== filter) return false;
    if (search && !f.fdNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPrincipal = filtered.reduce((s, f) => s + f.principal, 0);
  const totalInterest = filtered.reduce((s, f) => s + f.interestEarned, 0);

  const columns: Column<FdResponse>[] = [
    { key: 'fdNumber', header: 'FD No.', render: (f) => <span className="font-mono text-sm font-semibold text-ink-900">{f.fdNumber}</span> },
    { key: 'principal', header: 'Amount', align: 'right', render: (f) => <span className="font-semibold text-ink-900">{formatINR(f.principal)}</span> },
    { key: 'interestRate', header: 'Rate', render: (f) => <Badge variant="info">{f.interestRate}% p.a.</Badge> },
    { key: 'tenureDays', header: 'Tenure', render: (f) => <span className="text-ink-600">{f.tenureDays} days</span> },
    { key: 'maturityDate', header: 'Maturity', render: (f) => <span className="text-ink-600">{formatDate(f.maturityDate)}</span> },
    { key: 'maturityAmount', header: 'Maturity Amt', align: 'right', render: (f) => <span className="font-semibold text-accent-700">{formatINR(f.maturityAmount)}</span> },
    {
      key: 'status', header: 'Status',
      render: (f) => <Badge variant={f.status === 'ACTIVE' ? 'success' : f.status === 'MATURED' ? 'info' : 'neutral'} dot>{f.status.charAt(0) + f.status.slice(1).toLowerCase()}</Badge>,
    },
    {
      key: 'actions', header: '', align: 'right',
      render: (f) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => setSelected(f)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" title="View"><Eye className="h-4 w-4" /></button>
          {f.status === 'ACTIVE' && (
            <>
              <button onClick={async () => { try { await fdService.renew(f.id); showToast('FD renewed successfully'); const updated = await fdService.getByCustomer(user!.id); setFds(updated); } catch { showToast('Renewal failed', 'error'); } }} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" title="Renew"><RefreshCw className="h-4 w-4" /></button>
              <button onClick={async () => { try { await fdService.withdraw(f.id); showToast('FD withdrawn'); const updated = await fdService.getByCustomer(user!.id); setFds(updated); } catch { showToast('Withdrawal failed', 'error'); } }} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" title="Withdraw"><ArrowDownToLine className="h-4 w-4" /></button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Toast toast={toast} />
      <PageHeader
        title="My Fixed Deposits"
        subtitle="View and manage all your fixed deposits"
        icon={<PiggyBank className="h-5 w-5" />}
        action={
          <>
            <Button variant="ghost" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={() => navigate('dashboard')}>Back</Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('fd-open')}>Open New FD</Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md">
          <p className="text-sm text-ink-500">Total FD Value</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">{formatINR(totalPrincipal)}</p>
          <p className="mt-0.5 text-xs text-ink-400">{filtered.length} deposits</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-ink-500">Interest Earned</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-accent-600">+{formatINR(totalInterest)}</p>
          <p className="mt-0.5 text-xs text-ink-400">Across all FDs</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-ink-500">Maturity Value</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink-900">{formatINR(totalPrincipal + totalInterest)}</p>
          <p className="mt-0.5 text-xs text-ink-400">At maturity</p>
        </Card>
      </div>

      <Card padding="md">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'ACTIVE', 'MATURED', 'WITHDRAWN'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={classNames(
                  'rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                  filter === s ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200',
                )}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FD number…"
              className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:shadow-glow sm:w-64"
            />
          </div>
        </div>
        {loading ? (
          <div className="py-12 text-center text-ink-400">Loading FDs…</div>
        ) : (
          <DataTable columns={columns} data={filtered} rowKey={(f) => f.id} onRowClick={setSelected} />
        )}
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`FD Details · ${selected?.fdNumber}`}
        subtitle="Fixed deposit summary"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button variant="outline" leftIcon={<Receipt className="h-4 w-4" />} onClick={() => showToast('Statement downloaded', 'info')}>Statement</Button>
            {selected?.status === 'ACTIVE' && <Button onClick={async () => { if (!selected) return; await fdService.renew(selected.id); setSelected(null); showToast('Renewal initiated'); const updated = await fdService.getByCustomer(user!.id); setFds(updated); }}>Renew FD</Button>}
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Type" value={selected.fdType.replace('_', ' ')} />
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="Principal" value={formatINR(selected.principal)} />
              <DetailRow label="Interest rate" value={`${selected.interestRate}% p.a.`} />
              <DetailRow label="Tenure" value={`${selected.tenureDays} days`} />
              <DetailRow label="Auto-renew" value={selected.autoRenew ? 'Yes' : 'No'} />
              <DetailRow label="Start date" value={formatDate(selected.openedDate)} />
              <DetailRow label="Maturity date" value={formatDate(selected.maturityDate)} />
            </div>
            <div className="rounded-xl bg-accent-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-accent-800">Maturity amount</span>
                <span className="font-display text-xl font-extrabold text-accent-700">{formatINR(selected.maturityAmount)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-accent-700">Interest earned</span>
                <span className="font-semibold text-accent-700">+{formatINR(selected.interestEarned)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}
