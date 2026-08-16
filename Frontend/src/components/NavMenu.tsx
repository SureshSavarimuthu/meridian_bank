import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getMainMenuRoutes, 
  getCustomerMenuRoutes, 
  getEmployeeMenuRoutes, 
  getAdminMenuRoutes 
} from '../config/navigation';
import { Link } from 'react-router-dom';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavMenu: React.FC<NavMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const mainMenuRoutes = getMainMenuRoutes(user.roles);
  const customerMenuRoutes = getCustomerMenuRoutes(user.roles);
  const employeeMenuRoutes = getEmployeeMenuRoutes(user.roles);
  const adminMenuRoutes = getAdminMenuRoutes(user.roles);

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary">Banking App</h2>
        <p className="text-sm text-gray-600 mt-1">{user.fullName}</p>
        <p className="text-xs text-gray-500">{user.roles.join(', ')}</p>
      </div>

      <div className="overflow-y-auto h-screen pb-20">
        {/* Main Menu */}
        {mainMenuRoutes.length > 0 && (
          <div>
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </div>
            <ul className="space-y-1">
              {mainMenuRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={onClose}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Customer Menu */}
        {customerMenuRoutes.length > 0 && (
          <div className="border-t mt-4">
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Banking Services
            </div>
            <ul className="space-y-1">
              {customerMenuRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={onClose}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Employee Menu */}
        {employeeMenuRoutes.length > 0 && (
          <div className="border-t mt-4">
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Employee Services
            </div>
            <ul className="space-y-1">
              {employeeMenuRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={onClose}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Admin Menu */}
        {adminMenuRoutes.length > 0 && (
          <div className="border-t mt-4">
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </div>
            <ul className="space-y-1">
              {adminMenuRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={onClose}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-gray-50 p-4 space-y-2">
        <Link
          to="/profile"
          onClick={onClose}
          className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm"
        >
          My Profile
        </Link>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
