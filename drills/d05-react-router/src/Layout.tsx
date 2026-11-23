import { NavLink, Outlet } from "react-router-dom";

// TODO d05-1: the shared layout. Render, in this order:
//   - <nav aria-label="Main"> with three <NavLink>s:
//       "Home" -> "/" (add the `end` prop so it is only active on "/" itself),
//       "Books" -> "/books", "Settings" -> "/settings"
//   - <main> containing <Outlet />, the slot where the matched child route renders.
export function Layout() {
  return <p>TODO d05-1</p>;
}
