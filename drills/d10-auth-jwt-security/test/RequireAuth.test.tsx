import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter, useLocation } from "react-router-dom";
import RequireAuth from "../src/RequireAuth";

function b64url(json: unknown): string {
  return btoa(JSON.stringify(json)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function makeToken(payload: Record<string, unknown>): string {
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.fake-signature`;
}
const nowSec = () => Math.floor(Date.now() / 1000);

function LoginPage() {
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
  return <h1>Login page (from: {from ?? "none"})</h1>;
}

function renderAt(path: string, token: string | null, role?: string) {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <LoginPage /> },
      {
        element: <RequireAuth token={token} role={role} />,
        children: [{ path: "/admin", element: <h1>Admin dashboard</h1> }],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test("9. no token: redirects to /login and remembers where the user was going", async () => {
  renderAt("/admin", null);
  expect(await screen.findByText("Login page (from: /admin)")).toBeInTheDocument();
  expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument();
});

test("10. expired token: redirects to /login (re-authenticate)", async () => {
  renderAt("/admin", makeToken({ exp: nowSec() - 60, role: "ADMIN" }));
  expect(await screen.findByText(/Login page/)).toBeInTheDocument();
  expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument();
});

test("11. valid token without the required role: shows '403 Not authorised'", async () => {
  renderAt("/admin", makeToken({ exp: nowSec() + 3600, role: "USER" }), "ADMIN");
  expect(await screen.findByText(/403 Not authorised/i)).toBeInTheDocument();
  expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument();
  expect(screen.queryByText(/Login page/)).not.toBeInTheDocument();
});

test("12. valid token with the role renders the child route (Outlet) or children", async () => {
  renderAt("/admin", makeToken({ exp: nowSec() + 3600, role: ["USER", "ADMIN"] }), "ADMIN");
  expect(await screen.findByText("Admin dashboard")).toBeInTheDocument();

  const router = createMemoryRouter(
    [
      {
        path: "/bookings",
        element: (
          <RequireAuth token={makeToken({ exp: nowSec() + 3600 })}>
            <p>My bookings</p>
          </RequireAuth>
        ),
      },
    ],
    { initialEntries: ["/bookings"] },
  );
  render(<RouterProvider router={router} />);
  expect(await screen.findByText("My bookings")).toBeInTheDocument();
});
