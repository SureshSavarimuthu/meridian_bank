import { AuthProvider, useAuth } from '@/lib/auth';
import { NavProvider, useNav } from '@/lib/nav';
import { AppLayout } from '@/components/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomerRegistrationPage } from '@/pages/CustomerRegistrationPage';
import { AccountOpeningPage } from '@/pages/AccountOpeningPage';
import { OpenFdPage } from '@/pages/fd/OpenFdPage';
import { FdListPage } from '@/pages/fd/FdListPage';
import { OpenRdPage } from '@/pages/rd/OpenRdPage';
import { RdTrackerPage } from '@/pages/rd/RdTrackerPage';
import { LoanApplicationPage } from '@/pages/loan/LoanApplicationPage';
import { LoanApprovalPage } from '@/pages/loan/LoanApprovalPage';
import { LoanReviewPage } from '@/pages/loan/LoanReviewPage';
import { TransferPage } from '@/pages/transfer/TransferPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage';
import { AdminApprovalMatrixPage } from '@/pages/admin/AdminApprovalMatrixPage';
import { AdminInterestRatesPage } from '@/pages/admin/AdminInterestRatesPage';
import { AdminSecurityPage } from '@/pages/admin/AdminSecurityPage';
import { AdminSystemConfigPage } from '@/pages/admin/AdminSystemConfigPage';

function Router() {
  const { route } = useNav();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  let page: React.ReactNode;
  switch (route) {
    case 'dashboard': page = <DashboardPage />; break;
    case 'customer-registration': page = <CustomerRegistrationPage />; break;
    case 'account-opening': page = <AccountOpeningPage />; break;
    case 'fd-open': page = <OpenFdPage />; break;
    case 'fd-list': page = <FdListPage />; break;
    case 'rd-open': page = <OpenRdPage />; break;
    case 'rd-tracker': page = <RdTrackerPage />; break;
    case 'loan-application': page = <LoanApplicationPage />; break;
    case 'loan-approval': page = <LoanApprovalPage />; break;
    case 'loan-review': page = <LoanReviewPage />; break;
    case 'transfer': page = <TransferPage />; break;
    case 'admin': page = <AdminPage />; break;
    case 'admin-users': page = <AdminUsersPage />; break;
    case 'admin-roles': page = <AdminRolesPage />; break;
    case 'admin-approval-matrix': page = <AdminApprovalMatrixPage />; break;
    case 'admin-interest-rates': page = <AdminInterestRatesPage />; break;
    case 'admin-security': page = <AdminSecurityPage />; break;
    case 'admin-system-config': page = <AdminSystemConfigPage />; break;
    default: page = <DashboardPage />;
  }

  return <AppLayout>{page}</AppLayout>;
}

function App() {
  return (
    <AuthProvider>
      <NavProvider>
        <Router />
      </NavProvider>
    </AuthProvider>
  );
}

export default App;
