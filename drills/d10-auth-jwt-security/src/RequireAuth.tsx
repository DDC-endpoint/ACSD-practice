// d10: a route guard, like the module's components/RequireAuth.tsx.
// Use it as a layout route:  { element: <RequireAuth token={token} role="ADMIN" />, children: [...] }
// or wrap one page:          <RequireAuth token={token}><MyBookings /></RequireAuth>
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasRole, isTokenExpired } from "./jwt";

interface RequireAuthProps {
  token: string | null;
  role?: string;
  children?: ReactNode;
}

export default function RequireAuth({ token, role, children }: RequireAuthProps) {
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (role && !hasRole(token, role)) {
    return <p role="alert">403 Not authorised</p>;
  }
  return children ? <>{children}</> : <Outlet />;
}
