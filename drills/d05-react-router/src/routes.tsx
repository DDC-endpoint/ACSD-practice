import { Route, Routes, type RouteObject } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { BookList } from "./pages/BookList";
import { BookDetails } from "./pages/BookDetails";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFound } from "./pages/NotFound";

// TODO d05-2: the route configuration, JSX form (what the module's App.tsx uses).
//   One parent <Route element={<Layout />}> (no path: a "layout route") with children:
//     index -> <HomePage />, "books" -> <BookList />, "books/:bookId" -> <BookDetails />,
//     "settings" -> <SettingsPage />, and a catch-all "*" -> <NotFound />.
//   The <BrowserRouter> is NOT here: main.tsx (or the test's MemoryRouter) wraps it.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/:bookId" element={<BookDetails />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

// TODO d05-6: the SAME tree as an object array, the form createBrowserRouter(routes) takes.
//   One object { path: "/", element: <Layout />, children: [...] } whose children are
//   { index: true, element: ... }, { path: "books", element: ... }, and so on, ending
//   with { path: "*", element: <NotFound /> }.
//   In a real app: const router = createBrowserRouter(routes); <RouterProvider router={router} />
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "books", element: <BookList /> },
      { path: "books/:bookId", element: <BookDetails /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
