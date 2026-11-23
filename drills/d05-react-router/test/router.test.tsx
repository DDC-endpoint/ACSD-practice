import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
  createMemoryRouter,
  useLocation,
} from "react-router-dom";
import { AppRoutes, routes } from "../src/routes";
import { BookDetails } from "../src/pages/BookDetails";
import { SettingsPage } from "../src/pages/SettingsPage";
import { BookList } from "../src/pages/BookList";
import { SETTINGS_KEY } from "../src/settings";

// Test helper: prints the current URL so tests can see where the router is.
function LocationDisplay() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname + location.search}</output>;
}

function renderApp(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AppRoutes />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

function mainNav() {
  return screen.getByRole("navigation", { name: "Main" });
}

beforeEach(() => localStorage.clear());

test("1. '/' renders the Home page (index route) inside the Layout nav", () => {
  renderApp("/");
  const nav = mainNav();
  expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  expect(within(nav).getByRole("link", { name: "Books" })).toHaveAttribute("href", "/books");
  expect(within(nav).getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
  expect(within(screen.getByRole("main")).getByRole("heading", { name: "Library" })).toBeInTheDocument();
});

test("2. the shared nav stays on every page; only the <Outlet /> part changes", () => {
  for (const url of ["/books", "/books/2", "/settings"]) {
    const { unmount } = renderApp(url);
    expect(mainNav()).toBeInTheDocument();
    expect(screen.getByRole("main")).not.toBeEmptyDOMElement();
    expect(screen.queryByRole("heading", { name: "Library" })).not.toBeInTheDocument();
    unmount();
  }
});

test("3. clicking a nav link changes the page client-side, keeping the layout", async () => {
  const user = userEvent.setup();
  renderApp("/");
  await user.click(within(mainNav()).getByRole("link", { name: "Books" }));
  expect(screen.getByTestId("location")).toHaveTextContent("/books");
  expect(screen.queryByRole("heading", { name: "Library" })).not.toBeInTheDocument();
  expect(mainNav()).toBeInTheDocument();
});

test("4. BookDetails reads :bookId with useParams and displays it", () => {
  const renderAt = (url: string) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/books/:bookId" element={<BookDetails />} />
        </Routes>
      </MemoryRouter>,
    );

  const first = renderAt("/books/2");
  expect(screen.getByText("Book ID: 2")).toBeInTheDocument();
  expect(screen.getByText("Emma by Jane Austen")).toBeInTheDocument();
  first.unmount();

  renderAt("/books/99");
  expect(screen.getByText("Book ID: 99")).toBeInTheDocument();
  expect(screen.getByText("No book with that ID.")).toBeInTheDocument();
});

test("5. Save stores the settings, then useNavigate sends the user to '/'", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/settings"]}>
      <Routes>
        <Route path="/" element={<h1>Home page</h1>} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("checkbox", { name: /dark mode/i }));
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ darkMode: true });
  expect(screen.getByRole("heading", { name: "Home page" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
});

test("6. BookList filters by the ?q= query string with useSearchParams", async () => {
  const user = userEvent.setup();
  const titles = () => screen.queryAllByRole("listitem").map((li) => li.textContent);

  const first = render(
    <MemoryRouter initialEntries={["/books?q=dun"]}>
      <BookList />
    </MemoryRouter>,
  );
  expect(titles()).toEqual(["Dune"]);
  expect(screen.getByRole("link", { name: "Dune" })).toHaveAttribute("href", "/books/1");
  first.unmount();

  render(
    <MemoryRouter initialEntries={["/books"]}>
      <BookList />
      <LocationDisplay />
    </MemoryRouter>,
  );
  expect(titles()).toEqual(["Dune", "Emma", "Persuasion", "Ivanhoe"]);
  await user.type(screen.getByRole("searchbox", { name: "Search books" }), "EMMA");
  expect(screen.getByTestId("location")).toHaveTextContent("/books?q=EMMA");
  expect(titles()).toEqual(["Emma"]);
});

test("7. an unknown URL hits the catch-all '*' route (Not Found, nav still shown)", () => {
  renderApp("/no/such/page");
  expect(mainNav()).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Not Found" })).toBeInTheDocument();
});

test("8. the routes object array works with createMemoryRouter + RouterProvider", async () => {
  const first = render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/"] })} />);
  expect(await screen.findByRole("heading", { name: "Library" })).toBeInTheDocument();
  expect(mainNav()).toBeInTheDocument();
  first.unmount();

  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/missing"] })} />);
  expect(await screen.findByRole("heading", { name: "Not Found" })).toBeInTheDocument();
  expect(mainNav()).toBeInTheDocument();
});
