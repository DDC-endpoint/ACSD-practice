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
  // TODO d10-5:
  //  - no token, or isTokenExpired(token) -> <Navigate to="/login" replace state={{ from: location }} />
  //    (get `location` from useLocation(), so the login page knows where to send the user back)
  //  - `role` given but hasRole(token, role) is false -> a message containing "403 Not authorised"
  //  - otherwise render `children` if given, else <Outlet /> (the matched child route)
  return <p>TODO d10-5</p>;
}
