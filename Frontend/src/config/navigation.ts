import { UserRole } from '../types/auth';

export interface RouteConfig {
  path: string;
  name: string;
  label: string;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  icon?: string;
  component?: string;
  menu?: 'main' | 'admin' | 'employee' | 'customer' | 'none';
  order?: number;
}

// Role-based route access matrix
export const roleRouteAccess: Record<UserRole, string[]> = {
  CUSTOMER: [
    '/dashboard',
    '/accounts',
    '/fd',
    '/rd',
    '/transfers',
    '/cards',
    '/transactions',
    '/profile',
    '/settings',
  ],
  LOAN_OFFICER: [
    '/dashboard',
    '/loan-applications',
    '/loan-approvals',
    '/loan-tracking',
    '/customers',
    '/profile',
  ],
  BRANCH_MANAGER: [
    '/dashboard',
    '/loan-applications',
    '/loan-approvals',
    '/loan-tracking',
    '/accounts',
    '/fd',
    '/rd',
    '/transactions',
    '/reports',
    '/customers',
    '/profile',
  ],
  REGIONAL_MANAGER: [
    '/dashboard',
    '/loan-approvals',
    '/loan-tracking',
    '/reports',
    '/branch-performance',
    '/risk-assessment',
    '/profile',
  ],
  ZONAL_MANAGER: [
    '/dashboard',
    '/loan-tracking',
    '/reports',
    '/region-performance',
    '/risk-assessment',
    '/profile',
  ],
  CIRCLE_HEAD: [
    '/dashboard',
    '/reports',
    '/zone-performance',
    '/risk-assessment',
    '/profile',
  ],
  GENERAL_MANAGER: [
    '/dashboard',
    '/reports',
    '/organization-performance',
    '/risk-assessment',
    '/admin',
    '/profile',
  ],
  TELLER: [
    '/dashboard',
    '/accounts',
    '/transactions',
    '/profile',
  ],
  CSO: [
    '/dashboard',
    '/customers',
    '/accounts',
    '/profile',
  ],
  SYSTEM_ADMIN: [
    '/admin',
    '/admin/users',
    '/admin/roles',
    '/admin/permissions',
    '/admin/approval-matrix',
    '/admin/interest-rates',
    '/admin/system-config',
    '/profile',
  ],
};

// Route catalog
export const routes: RouteConfig[] = [
  // Dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    label: 'Dashboard',
    menu: 'main',
    order: 1,
  },

  // Customer Routes
  {
    path: '/accounts',
    name: 'accounts',
    label: 'Accounts',
    requiredRoles: ['CUSTOMER', 'BRANCH_MANAGER', 'TELLER', 'CSO'],
    menu: 'customer',
    order: 2,
  },
  {
    path: '/accounts/open',
    name: 'open-account',
    label: 'Open Account',
    requiredRoles: ['CUSTOMER', 'CSO'],
    menu: 'none',
  },
  {
    path: '/fd',
    name: 'fixed-deposits',
    label: 'Fixed Deposits',
    requiredRoles: ['CUSTOMER', 'BRANCH_MANAGER', 'LOAN_OFFICER'],
    menu: 'customer',
    order: 3,
  },
  {
    path: '/fd/open',
    name: 'open-fd',
    label: 'Open FD',
    requiredRoles: ['CUSTOMER'],
    menu: 'none',
  },
  {
    path: '/rd',
    name: 'recurring-deposits',
    label: 'Recurring Deposits',
    requiredRoles: ['CUSTOMER', 'BRANCH_MANAGER'],
    menu: 'customer',
    order: 4,
  },
  {
    path: '/rd/open',
    name: 'open-rd',
    label: 'Open RD',
    requiredRoles: ['CUSTOMER'],
    menu: 'none',
  },
  {
    path: '/transfers',
    name: 'transfers',
    label: 'Transfer Funds',
    requiredRoles: ['CUSTOMER'],
    menu: 'customer',
    order: 5,
  },
  {
    path: '/cards',
    name: 'cards',
    label: 'Cards',
    requiredRoles: ['CUSTOMER'],
    menu: 'customer',
    order: 6,
  },
  {
    path: '/transactions',
    name: 'transactions',
    label: 'Transactions',
    requiredRoles: ['CUSTOMER', 'BRANCH_MANAGER', 'TELLER'],
    menu: 'customer',
    order: 7,
  },

  // Loan Routes
  {
    path: '/loan-applications',
    name: 'loan-applications',
    label: 'Loan Applications',
    requiredRoles: ['LOAN_OFFICER', 'BRANCH_MANAGER'],
    menu: 'employee',
    order: 8,
  },
  {
    path: '/loan-applications/new',
    name: 'new-loan-application',
    label: 'New Loan Application',
    requiredRoles: ['CUSTOMER'],
    menu: 'none',
  },
  {
    path: '/loan-approvals',
    name: 'loan-approvals',
    label: 'Loan Approvals',
    requiredRoles: ['LOAN_OFFICER', 'BRANCH_MANAGER', 'REGIONAL_MANAGER'],
    menu: 'employee',
    order: 9,
  },
  {
    path: '/loan-tracking',
    name: 'loan-tracking',
    label: 'Loan Tracking',
    requiredRoles: ['BRANCH_MANAGER', 'REGIONAL_MANAGER', 'ZONAL_MANAGER'],
    menu: 'employee',
    order: 10,
  },

  // Employee Routes
  {
    path: '/customers',
    name: 'customers',
    label: 'Customers',
    requiredRoles: ['LOAN_OFFICER', 'BRANCH_MANAGER', 'CSO'],
    menu: 'employee',
    order: 11,
  },
  {
    path: '/customers/register',
    name: 'register-customer',
    label: 'Register Customer',
    requiredRoles: ['CSO', 'BRANCH_MANAGER'],
    menu: 'none',
  },
  {
    path: '/reports',
    name: 'reports',
    label: 'Reports',
    requiredRoles: ['BRANCH_MANAGER', 'REGIONAL_MANAGER', 'ZONAL_MANAGER', 'CIRCLE_HEAD', 'GENERAL_MANAGER'],
    menu: 'employee',
    order: 12,
  },

  // Admin Routes
  {
    path: '/admin',
    name: 'admin',
    label: 'Admin Panel',
    requiredRoles: ['SYSTEM_ADMIN', 'GENERAL_MANAGER'],
    menu: 'admin',
    order: 1,
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    label: 'User Management',
    requiredRoles: ['SYSTEM_ADMIN'],
    menu: 'admin',
    order: 2,
  },
  {
    path: '/admin/roles',
    name: 'admin-roles',
    label: 'Role Management',
    requiredRoles: ['SYSTEM_ADMIN'],
    menu: 'admin',
    order: 3,
  },
  {
    path: '/admin/permissions',
    name: 'admin-permissions',
    label: 'Permission Management',
    requiredRoles: ['SYSTEM_ADMIN'],
    menu: 'admin',
    order: 4,
  },
  {
    path: '/admin/approval-matrix',
    name: 'approval-matrix',
    label: 'Approval Matrix',
    requiredRoles: ['SYSTEM_ADMIN', 'GENERAL_MANAGER'],
    menu: 'admin',
    order: 5,
  },
  {
    path: '/admin/interest-rates',
    name: 'interest-rates',
    label: 'Interest Rates',
    requiredRoles: ['SYSTEM_ADMIN', 'GENERAL_MANAGER'],
    menu: 'admin',
    order: 6,
  },
  {
    path: '/admin/system-config',
    name: 'system-config',
    label: 'System Configuration',
    requiredRoles: ['SYSTEM_ADMIN'],
    menu: 'admin',
    order: 7,
  },

  // User Routes
  {
    path: '/profile',
    name: 'profile',
    label: 'My Profile',
    menu: 'main',
    order: 99,
  },
  {
    path: '/settings',
    name: 'settings',
    label: 'Settings',
    requiredRoles: ['CUSTOMER'],
    menu: 'customer',
    order: 100,
  },
];

export const getAccessibleRoutes = (userRoles: UserRole[]): RouteConfig[] => {
  const accessiblePaths = new Set<string>();
  
  userRoles.forEach((role) => {
    roleRouteAccess[role].forEach((path) => {
      accessiblePaths.add(path);
    });
  });

  return routes.filter((route) => accessiblePaths.has(route.path));
};

export const getMainMenuRoutes = (userRoles: UserRole[]): RouteConfig[] => {
  return getAccessibleRoutes(userRoles)
    .filter((route) => route.menu === 'main')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getCustomerMenuRoutes = (userRoles: UserRole[]): RouteConfig[] => {
  return getAccessibleRoutes(userRoles)
    .filter((route) => route.menu === 'customer')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getEmployeeMenuRoutes = (userRoles: UserRole[]): RouteConfig[] => {
  return getAccessibleRoutes(userRoles)
    .filter((route) => route.menu === 'employee')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getAdminMenuRoutes = (userRoles: UserRole[]): RouteConfig[] => {
  return getAccessibleRoutes(userRoles)
    .filter((route) => route.menu === 'admin')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const hasAccessToRoute = (userRoles: UserRole[], path: string): boolean => {
  return getAccessibleRoutes(userRoles).some((route) => route.path === path);
};
