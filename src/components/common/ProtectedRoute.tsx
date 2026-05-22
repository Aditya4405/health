import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const { user, isAuthenticated, isLoading, getDefaultRoute } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export const RoleHomeRedirect = () => {
  const { user, getDefaultRoute } = useAuth();
  return <Navigate to={getDefaultRoute(user?.role)} replace />;
};

