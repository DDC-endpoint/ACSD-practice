---
id: d05
module: ACSD
kind: drill
title: React Router (layout, params, navigate, search params)
difficulty: 2
timeMinutes: 30
mock: [A2, A6, A10, A18, B1, B8, B11, C3, D1]
tasks:
  - { name: "Layout: nav of NavLinks + <Outlet /> in <main>", tests: [1, 2, 3, 7] }
  - { name: "AppRoutes: JSX route config with a layout route, index, :bookId and *", tests: [1, 2, 3, 7] }
  - { name: "BookDetails: read bookId with useParams and show it", tests: [4] }
  - { name: "SettingsPage: Save, then useNavigate to /", tests: [5] }
  - { name: "BookList: filter by ?q= with useSearchParams", tests: [6] }
  - { name: "routes: the same tree as a createBrowserRouter object array", tests: [8] }
---

# d05 · React Router (layout, params, navigate, search params)

> **Exam link:** React Router is worth about 19 marks on the mock. **D1 (10 marks)** gives a student app with `/`, `/students`, `/students/:studentId` and `/settings`, and asks you to *"(a) write a React Router configuration … use a shared layout"*, *"(b) explain the purpose of the `<Outlet />`"*, *"(c) write a small component that retrieves studentId from the URL and displays it"* and *"(d) … navigate … programmatically after saving … name the appropriate Hook"*. **C3** asks for the Hook and expression for `/orders/:orderId`. **A2, A6, A10, A18** are "which Hook/component" MCQs (`useNavigate`, `<Outlet />`, `useParams`, `useSearchParams`), and **B1, B8, B11** are True/False on client-side routing, dynamic params and per-group layouts. You type the code into a text box, so you need it from memory.

## The idea

### 1. Client-side routing: new page, no reload

In a normal website every link asks the server for a new HTML page. With React Router, the app is loaded **once**. When the URL changes, the router picks which component to show and React swaps it in. There is **no full page reload**, so state survives and it feels instant (that's **B1: True**).

You change the URL with `<Link>` (or `<NavLink>`, which also marks the active link), never a plain `<a href>`. A plain `<a>` makes the browser do a full reload, which throws away the app's state.

```tsx
<Link to="/books">Books</Link>           // client-side, no reload
<NavLink to="/books">Books</NavLink>     // same, plus an "active" class when the URL matches
<a href="/books">Books</a>               // ✘ full page reload
```

Docs: [React Router: routing](https://reactrouter.com/start/library/routing) · [Link](https://reactrouter.com/api/components/Link) · [NavLink](https://reactrouter.com/api/components/NavLink).

### 2. A shared layout and `<Outlet />`

A **layout route** is a parent `<Route>` whose `element` is the layout (nav, header, footer). Its child routes are the pages. `<Outlet />` is the **slot inside the layout where the matched child route renders**. The nav is written once and stays on screen; only the Outlet part changes.

```tsx
function Layout() {
  return (
    <>
      <nav>…links…</nav>
      <main>
        <Outlet />   {/* /books → <BookList /> appears here; /settings → <SettingsPage /> */}
      </main>
    </>
  );
}
```

Forget the `<Outlet />` and the layout shows, but **no page ever appears** inside it. You can have **several** layout routes (for example a public layout and an `AdminLayout` for `/admin/*`), so different groups of routes get different layouts (that's **B11: True**). Docs: [Outlet](https://reactrouter.com/api/components/Outlet).

### 3. Two ways to write the route config

**JSX form** (`<Routes>` + `<Route>`). This is what the module's CampusEvents `App.tsx` uses. `<BrowserRouter>` wraps the app once, in `main.tsx`.

```tsx
<Routes>
  <Route element={<Layout />}>                       {/* layout route: no path needed */}
    <Route index element={<HomePage />} />           {/* index = the parent's own URL, "/" */}
    <Route path="books" element={<BookList />} />
    <Route path="books/:bookId" element={<BookDetails />} />   {/* :bookId is a URL parameter */}
    <Route path="*" element={<NotFound />} />        {/* catch-all: anything not matched above */}
  </Route>
</Routes>
```

**Object form** (`createBrowserRouter`). The same tree as plain objects. Nesting uses `children`.

```tsx
const router = createBrowserRouter([
  { path: "/", element: <Layout />, children: [
      { index: true, element: <HomePage /> },
      { path: "books/:bookId", element: <BookDetails /> },
      { path: "*", element: <NotFound /> },
  ]},
]);
// in main.tsx:  <RouterProvider router={router} />
```

Either form earns the marks. Child paths have **no leading slash** (`"books"`, not `"/books"`), because they are relative to the parent. Docs: [createBrowserRouter](https://reactrouter.com/api/data-routers/createBrowserRouter).

### 4. The four Hooks the MCQs mix up

| Hook | What it gives you | Example | Mock |
|---|---|---|---|
| `useParams()` | The **dynamic path segments** (`:name` in the route) as an object of **strings** | `/orders/42` → `const { orderId } = useParams();` → `"42"` | A10, C3, D1c |
| `useSearchParams()` | The **query string** after `?`, as a `URLSearchParams`, plus a setter | `/books?q=dune` → `searchParams.get("q")` → `"dune"` | A18 |
| `useLocation()` | The **whole current location** object: `pathname`, `search`, `hash`, `state` | `location.pathname` → `"/books"` | distractor |
| `useNavigate()` | A **function** that navigates from code (after a save, a login, a delete) | `navigate("/dashboard")` | A2, D1d |

Quick way to choose: *"part of the path"* → `useParams`; *"after the `?`"* → `useSearchParams`; *"go somewhere from code"* → `useNavigate`; *"where am I right now"* → `useLocation`. Docs: [useParams](https://reactrouter.com/api/hooks/useParams) · [useSearchParams](https://reactrouter.com/api/hooks/useSearchParams) · [useLocation](https://reactrouter.com/api/hooks/useLocation) · [useNavigate](https://reactrouter.com/api/hooks/useNavigate) · [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

### 5. `useParams`: read the ID from the URL

```tsx
const { bookId } = useParams();          // "/books/42" → bookId === "42" (a string!)
const book = BOOKS.find((b) => b.id === Number(bookId));
```

A dynamic route uses a parameter to say **which record** to show (**B8: True**). The value is **always a string** (or `undefined`), so convert it before you compare it with a number id.

### 6. `useNavigate`: go somewhere from code

Use it when there is no link to click, for example **after** a save finishes:

```tsx
const navigate = useNavigate();          // call the Hook at the top of the component
function handleSave() {
  saveSettings({ darkMode });
  navigate("/");                         // then send the user home
}
```

`navigate(-1)` goes back one page. `navigate("/login", { replace: true })` replaces the history entry, so Back doesn't return to the old page.

### 7. `useSearchParams`: the `?q=` part

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";   // get() returns null when ?q is missing
setSearchParams({ q: "emma" });          // URL becomes ?q=emma, the component re-renders
```

It works like `useState`, except the value lives in the URL, so a filtered list can be bookmarked or shared.

## Worked example

This is **the mock's D1 itself** (the student app), because that exact question could come up. Your task uses a library app instead, so you still have to write it yourself.

**(a) Route configuration with a shared layout (4 marks).** One mark each, roughly: the layout route, the list and settings routes, the `:studentId` dynamic route, and correct nesting under the layout.

```tsx
// main.tsx
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// App.tsx
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>            {/* shared layout for every page */}
        <Route index element={<Home />} />               {/* "/" */}
        <Route path="students" element={<StudentList />} />            {/* "/students" */}
        <Route path="students/:studentId" element={<StudentDetails />} /> {/* "/students/7" */}
        <Route path="settings" element={<Settings />} />               {/* "/settings" */}
      </Route>
    </Routes>
  );
}

// Layout.tsx
import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> <Link to="/students">Students</Link> <Link to="/settings">Settings</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

Line by line: `<BrowserRouter>` turns on routing for the whole app. The outer `<Route path="/" element={<Layout />}>` is the shared layout, and every route nested inside it renders *inside* that layout. `index` means "the parent's own path", so `/`. `:studentId` is a placeholder: `/students/7` matches with `studentId = "7"`. The same config in object form is `createBrowserRouter([{ path: "/", element: <Layout />, children: [{ index: true, element: <Home /> }, { path: "students", element: <StudentList /> }, { path: "students/:studentId", element: <StudentDetails /> }, { path: "settings", element: <Settings /> }] }])` with `<RouterProvider router={router} />`.

**(b) Purpose of `<Outlet />` (2 marks).**

> `<Outlet />` is a placeholder in the parent layout component that marks where the matched child route's component is rendered. The layout (for example the navigation menu) stays on screen on every page, and only the content in the Outlet changes when the URL changes, so the nav is written once and shared.

**(c) Component that reads `studentId` (2 marks).**

```tsx
import { useParams } from "react-router-dom";

export function StudentDetails() {
  const { studentId } = useParams();
  return <h2>Student ID: {studentId}</h2>;
}
```

**(d) Navigate programmatically after saving (2 marks).**

> Use the `useNavigate` Hook. Call it at the top of the component, `const navigate = useNavigate();`, and after the save succeeds call `navigate("/settings")` (or whichever page you need). It changes the route from code, without a link click and without a full page reload.

```tsx
const navigate = useNavigate();
async function handleSave() {
  await savePreferences(prefs);
  navigate("/settings");
}
```

**C3 (3 marks)** is the same skill in one line: the Hook is `useParams`, and the expression is `const { orderId } = useParams();`.

## Your task

A small **library app**: `/` (home), `/books` (list, filterable with `?q=`), `/books/:bookId` (details), `/settings`, and a Not Found page for anything else. `books.ts`, `settings.ts`, `HomePage` and `NotFound` are given.

1. Open `drills/d05-react-router/src/`. Do the TODOs in this order:
   - **TODO d05-1** `Layout.tsx`: `<nav aria-label="Main">` with three `<NavLink>`s (Home `/` with `end`, Books, Settings), then `<main><Outlet /></main>`.
   - **TODO d05-2** `routes.tsx` → `AppRoutes`: the JSX config. A layout route with `index`, `books`, `books/:bookId`, `settings` and `*` children.
   - **TODO d05-3** `pages/BookDetails.tsx`: `useParams` → show `Book ID: {bookId}`, then the book's title and author, or "No book with that ID."
   - **TODO d05-4** `pages/SettingsPage.tsx`: a "Dark mode" checkbox and a Save button. Save calls `saveSettings(...)`, then `navigate("/")`.
   - **TODO d05-5** `pages/BookList.tsx`: read `q` with `useSearchParams`, show a search box bound to it, and list only the matching titles as `<Link>`s.
   - **TODO d05-6** `routes.tsx` → `routes`: the same tree as an object array for `createBrowserRouter`.
2. Run `npm test -- d05` until all 8 tests are green. Tests 1–3 and 7 need d05-1 **and** d05-2. Test 8 needs d05-1 and d05-6.
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and, on paper, write the full D1 answer for the **student** app: the route config with a layout, the `Layout` with `<Outlet />`, `StudentDetails` with `useParams`, and a save handler with `useNavigate`. Then write C3's one line. Check it against the worked example.

## Hints

<details><summary>Hint 1: where do I start?</summary>

Do d05-1 and d05-2 together: tests 1–3 need both. Write `Layout` first (copy the shape from "The idea" §2), then put `<Route element={<Layout />}>` in `AppRoutes` with just the `index` route. Run the tests. Test 1 should go green. Then add the other children.
</details>

<details><summary>Hint 2: the layout shows, but no page appears inside it</summary>

You forgot `<Outlet />` in `Layout`, or your page routes are **siblings** of the layout route instead of **nested inside** it. The pages must be between `<Route element={<Layout />}>` and its `</Route>`.
</details>

<details><summary>Hint 3: BookDetails always says "No book with that ID."</summary>

`useParams()` returns **strings**. `b.id === bookId` compares `2` with `"2"`, which is `false`. Use `b.id === Number(bookId)`.
</details>

<details><summary>Hint 4: useNavigate errors, or Save does nothing</summary>

Call `const navigate = useNavigate();` at the **top** of the component, not inside `handleSave` (Hooks can't be called inside event handlers). Then call `navigate("/")` inside `handleSave`, **after** `saveSettings(...)`.
</details>

<details><summary>Hint 5: the search box (nearly the answer)</summary>

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";
const shown = BOOKS.filter((b) => b.title.toLowerCase().includes(q.toLowerCase()));
// <input type="search" aria-label="Search books" value={q}
//        onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})} />
```
</details>

<details><summary>Hint 6: the object form (nearly the answer)</summary>

```tsx
export const routes: RouteObject[] = [
  { path: "/", element: <Layout />, children: [
      { index: true, element: <HomePage /> },
      { path: "books", element: <BookList /> },
      { path: "books/:bookId", element: <BookDetails /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFound /> },
  ]},
];
```
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Explain the purpose of the <code>&lt;Outlet /&gt;</code> component in a shared layout.</summary>

`<Outlet />` marks the place inside the parent (layout) route's component where the matched child route renders. The layout, such as the nav menu, is shown on every page, and only the Outlet content changes as the URL changes. Without it, child pages never appear.
</details>

<details><summary>A route is <code>/orders/:orderId</code>. Name the Hook and write the expression that gets <code>orderId</code>.</summary>

`useParams`. `const { orderId } = useParams();` The value is a string (for `/orders/42` it's `"42"`), so use `Number(orderId)` if you need a number.
</details>

<details><summary>After a user signs in, you want to go to <code>/dashboard</code>. Which Hook? (Trap: <code>useLocation</code>.)</summary>

`useNavigate`. `const navigate = useNavigate();` at the top of the component, then `navigate("/dashboard")` after the sign-in succeeds. `useLocation` only **reads** the current URL; it can't change it. `useParams` and `useSearchParams` read parts of the URL.
</details>

<details><summary>What is the difference between <code>useParams</code> and <code>useSearchParams</code>?</summary>

`useParams` reads the dynamic **path** segments defined in the route, like `:studentId` in `/students/:studentId`. `useSearchParams` reads the **query string** after `?`, like `q` in `/books?q=dune`, with `searchParams.get("q")`, and it also gives a setter to change it. Path params identify *which* record; query params usually filter, sort or page a list.
</details>

<details><summary>True or false: React Router shows different pages without a full page reload. Why does <code>&lt;Link&gt;</code> matter here?</summary>

True. React Router changes the URL with the History API and renders the matching component itself, so the page isn't reloaded from the server. `<Link>`/`<NavLink>` do this. A plain `<a href>` would make the browser reload the whole page and lose the app's state.
</details>

<details><summary>True or false: an app can use different layouts for different groups of routes. How?</summary>

True. Nest each group under its own layout route, for example `<Route element={<PublicLayout />}>` for the public pages and `<Route path="admin" element={<AdminLayout />}>` for the admin pages. Each layout has its own `<Outlet />`.
</details>
