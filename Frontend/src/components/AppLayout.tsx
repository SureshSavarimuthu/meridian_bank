import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Landmark, PiggyBank, CalendarClock, Banknote,
  ArrowLeftRight, Bell, Search, LogOut, Menu, ChevronRight,
  Users, KeyRound, FileCheck, Percent, Settings, Lock,
} from 'lucide-react';
import { useNav, type Route } from '@/lib/nav';
import { useAuth } from '@/lib/auth';
import { classNames, initials } from '@/lib/format';
import { notifications as mockNotifs } from '@/lib/mockData';

interface NavItem {
  label: string;
  route: Route;
  icon: ReactNode;
  group: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', route: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" />, group: 'Overview' },
  { label: 'Open Account', route: 'account-opening', icon: <Landmark className="h-5 w-5" />, group: 'Accounts', roles: ['CUSTOMER', 'BRANCH_MANAGER', 'CSO'] },
  { label: 'Fixed Deposit', route: 'fd-open', icon: <PiggyBank className="h-5 w-5" />, group: 'Deposits', roles: ['CUSTOMER'] },
  { label: 'My FDs', route: 'fd-list', icon: <PiggyBank className="h-5 w-5" />, group: 'Deposits', roles: ['CUSTOMER'] },
  { label: 'Recurring Deposit', route: 'rd-open', icon: <CalendarClock className="h-5 w-5" />, group: 'Deposits', roles: ['CUSTOMER'] },
  { label: 'RD Tracker', route: 'rd-tracker', icon: <CalendarClock className="h-5 w-5" />, group: 'Deposits', roles: ['CUSTOMER'] },
  { label: 'Apply for Loan', route: 'loan-application', icon: <Banknote className="h-5 w-5" />, group: 'Loans', roles: ['CUSTOMER'] },
  { label: 'Loan Approvals', route: 'loan-approval', icon: <Banknote className="h-5 w-5" />, group: 'Loans', roles: ['BRANCH_MANAGER', 'REGIONAL_MANAGER', 'LOAN_OFFICER'] },
  { label: 'Loan Reviews', route: 'loan-review', icon: <Banknote className="h-5 w-5" />, group: 'Loans', roles: ['BRANCH_MANAGER', 'REGIONAL_MANAGER'] },
  { label: 'Fund Transfer', route: 'transfer', icon: <ArrowLeftRight className="h-5 w-5" />, group: 'Transactions', roles: ['CUSTOMER', 'TELLER', 'BRANCH_MANAGER'] },
  { label: 'Register Customer', route: 'customer-registration', icon: <Landmark className="h-5 w-5" />, group: 'Management', roles: ['CSO', 'BRANCH_MANAGER'] },
   { label: 'User Management', route: 'admin-users', icon: <Users className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
  { label: 'Role Management', route: 'admin-roles', icon: <KeyRound className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
  { label: 'Approval Matrix', route: 'admin-approval-matrix', icon: <FileCheck className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
  { label: 'Interest Rates', route: 'admin-interest-rates', icon: <Percent className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
  { label: 'Security', route: 'admin-security', icon: <Lock className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
    { label: 'System Config', route: 'admin-system-config', icon: <Settings className="h-5 w-5" />, group: 'Admin', roles: ['SYSTEM_ADMIN'] },
];

const groups = ['Overview', 'Accounts', 'Deposits', 'Loans', 'Transactions', 'Management','Admin'];

export function AppLayout({ children }: { children: ReactNode }) {
  const { route, navigate } = useNav();
  const { user, logout, hasAnyRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Filter nav items based on user roles
  const userNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // Show if no role restriction
    return hasAnyRole(item.roles as import('@/lib/auth').UserRole[]);
  });

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-ink-100 bg-white">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-base font-extrabold tracking-tight text-ink-900">VFS Bank</p>
          <p className="-mt-1 text-xs font-medium text-ink-400">Veteran Financial Service Bank</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {groups.map((group) => {
          const groupItems = userNavItems.filter((i) => i.group === group);
          if (groupItems.length === 0) return null;
          
          return (
            <div key={group} className="mb-4">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-300">{group}</p>
              {groupItems.map((item) => (
                <button
                  key={item.route + item.label}
                  onClick={() => { navigate(item.route); setMobileOpen(false); }}
                  className={classNames('nav-link w-full', route === item.route && 'nav-link-active')}
                >
                  <span className={classNames(route === item.route ? 'text-brand-600' : 'text-ink-400')}>{item.icon}</span>
                  {item.label}
                  {route === item.route && <ChevronRight className="ml-auto h-4 w-4 text-brand-500" />}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-ink-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {initials(user?.fullName || 'JD')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{user?.fullName}</p>
            <p className="truncate text-xs text-ink-400">{user?.roles?.[0] || 'User'}</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-50 hover:text-error-600" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen  bg-ink-50">
      <div className="hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-slide-up">{sidebar}</div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ink-100 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search accounts, transactions, loans…"
                className="h-10 w-72 rounded-xl border border-ink-200 bg-ink-50 pl-9 pr-4 text-sm outline-none transition-all focus:border-brand-400 focus:bg-white focus:shadow-glow"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-xl p-2.5 text-ink-500 transition-colors hover:bg-ink-50"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-80 animate-scale-in rounded-2xl border border-ink-100 bg-white p-2 shadow-soft-lg">
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="text-sm font-bold text-ink-900">Notifications</p>
                      <span className="text-xs text-ink-400">{mockNotifs.length} new</span>
                    </div>
                    {mockNotifs.map((n) => (
                      <div key={n.id} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-ink-50">
                        <div className={classNames(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          n.type === 'warning' && 'bg-warning-100 text-warning-600',
                          n.type === 'success' && 'bg-success-100 text-success-600',
                          n.type === 'info' && 'bg-brand-100 text-brand-600',
                        )}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                          <p className="text-xs text-ink-500">{n.body}</p>
                          <p className="mt-0.5 text-xs text-ink-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 hover:bg-ink-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {initials(user?.fullName || 'JD')}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight text-ink-900">{user?.fullName}</p>
                <p className="text-xs leading-tight text-ink-400">{user?.roles?.[0] || 'User'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
