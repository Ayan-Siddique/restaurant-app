import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  allowedRoles?: ("user" | "staff" | "admin")[];
  redirectTo?: string;
  children?: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  // Determine appropriate fallback redirect path
  const defaultRedirect =
    allowedRoles?.includes("staff") || allowedRoles?.includes("admin")
      ? "/admin/login"
      : "/";

  const targetRedirect = redirectTo || defaultRedirect;

  // Unauthenticated user
  if (!isAuthenticated || !token) {
    return <Navigate to={targetRedirect} replace state={{ from: location }} />;
  }

  // Role validation if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    const isAllowed = userRole && allowedRoles.includes(userRole as "user" | "staff" | "admin");

    if (!isAllowed) {
      return <Navigate to={targetRedirect} replace state={{ from: location }} />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
