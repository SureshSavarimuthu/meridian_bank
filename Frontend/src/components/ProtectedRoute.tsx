import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}) => {
  const { isAuthenticated, loading, user, hasRole, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.some((role) => hasRole(role))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !requiredPermissions.every((perm) => hasPermission(perm as any))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Insufficient Permissions</h1>
          <p className="text-gray-600">You do not have the required permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
