import { createContext, useContext, useState, type ReactNode } from 'react';

export type Route =
  | 'dashboard'
  | 'account-opening'
  | 'fd-open'
  | 'fd-list'
  | 'rd-open'
  | 'rd-tracker'
  | 'loan-application'
  | 'loan-approval'
  | 'loan-review'
  | 'transfer'
  | 'customer-registration'
  | 'admin'
  | 'admin-users'
  | 'admin-roles'
  | 'admin-approval-matrix'
  | 'admin-interest-rates'
  | 'admin-security'
  | 'admin-system-config'
  | 'login'
  | 'register';

interface NavState {
  route: Route;
  params: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
}

const NavContext = createContext<NavState | null>(null);

const VALID_ROUTES: Set<string> = new Set([
  'dashboard', 'account-opening', 'fd-open', 'fd-list', 'rd-open', 'rd-tracker',
  'loan-application', 'loan-approval', 'loan-review', 'transfer',
  'customer-registration', 'admin', 'admin-users', 'admin-roles',
  'admin-approval-matrix', 'admin-interest-rates', 'admin-security',
  'admin-system-config', 'login', 'register',
]);

function getInitialRoute(): Route {
  try {
    const saved = localStorage.getItem('currentRoute');
    if (saved && VALID_ROUTES.has(saved) && saved !== 'login') {
      return saved as Route;
    }
  } catch { /* ignore */ }
  return 'login';
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [params, setParams] = useState<Record<string, string>>({});
  const navigate = (r: Route, p: Record<string, string> = {}) => {
    setRoute(r);
    setParams(p);
    try {
      if (r === 'login') localStorage.removeItem('currentRoute');
      else localStorage.setItem('currentRoute', r);
    } catch { /* ignore */ }
    window.scrollTo({ top: 0 });
  };
  return (
    <NavContext.Provider value={{ route, params, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
