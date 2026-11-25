---
id: ict-quick
module: ACSD
kind: guide
title: ACSD ICT quick sheet
compact: true
---

# ACSD ICT · Quick sheet

The last read before the test. Rules are one line each, and the code is **plain JavaScript/JSX**. The box at the end shows where types go if a question asks for TypeScript.

**Paper:** 90 min, 100 marks. A = MCQ, B = true/false, C = short answers, D = code + explain, E = security. Logic earns the marks; a missing semicolon costs nothing. A missing `await`, `key` or `0` in `reduce` can cost marks.

**Pick the verb:** "single value" = `reduce` · "navigate from code" = `useNavigate` · "read /x/42" = `useParams` · "named areas" = `grid-template-areas` · "preferred with limits" = `clamp` · "child route renders" = `<Outlet />` · "cache fresh for" = `staleTime` · "refresh after update" = `invalidateQueries`.

## 1. JavaScript

| Need | Use |
|---|---|
| one total / single value | `reduce((sum, x) => sum + x.price, 0)` (always the `0`) |
| every match | `filter`. `find` gives the **first** match or `undefined` |
| transform each item | `map` (same length) |
| any / all pass | `some` / `every` |
| copy part | `slice` (no change). `sort` and `splice` **mutate** |
| sort numbers | `[...arr].sort((a, b) => a - b)` (default sort compares strings) |

- An `async` function **always returns a Promise**. `await` pauses only that function, not the UI.
- `Promise.all` runs in parallel, returns results in order, and **rejects on the first failure**. `allSettled` waits for all and reports each one.
- **`fetch` does not reject on 404/500.** Check `res.ok`. `res.json()` is a Promise too, so `await` it. Sequential = `for...of` + `await`. Cancel = `AbortController`.

## 2. React core

```jsx
import { useState } from 'react';

function Greeting({ name, isAdmin = false }) {           // props: read-only inputs
  return <h2>Hello {name}{isAdmin && ' (admin)'}</h2>;
}

function TodoList() {
  const [items, setItems] = useState([]);                // state: owned, changed by setter
  const [tab, setTab] = useState('all');

  const add = (text) => setItems([...items, { id: Date.now(), text, done: false }]);
  const remove = (id) => setItems(items.filter((i) => i.id !== id));
  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  return (
    <>
      <button onClick={() => setTab('done')}>Done</button>
      {items.length > 0 ? (
        <ul>
          {items.map((i) => (
            <li key={i.id} onClick={() => toggle(i.id)}>{i.text}</li>
          ))}
        </ul>
      ) : (
        <p>Nothing yet</p>
      )}
    </>
  );
}
```

- Never mutate state. Spread a new array or object, and every set causes a re-render.
- `onClick={() => remove(id)}`, not `onClick={remove(id)}` (that one runs during render).
- `key` = a unique, stable id, not the index.
- `{items.length && ...}` prints `0` on an empty list. Use `> 0`.
- **Rules of Hooks:** top level only (no `if`, loops or nested functions), and only in components or custom Hooks. A custom Hook is a `use...` function that calls Hooks and reuses logic; each caller gets its own state.

## 3. Routing (D1, C3)

```jsx
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, useNavigate } from 'react-router-dom';

function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> <Link to="/students">Students</Link> <Link to="/settings">Settings</Link>
      </nav>
      <main><Outlet /></main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:studentId" element={<StudentDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function StudentDetails() {
  const { studentId } = useParams();                      // name matches :studentId; it's a string
  return <h1>Student ID: {studentId}</h1>;
}

function PreferencesForm() {
  const navigate = useNavigate();                         // top of the component
  async function handleSave() {
    await savePreferences();                              // save first
    navigate('/settings');                                // then go
  }
  return <button onClick={handleSave}>Save</button>;
}
```

- `<Outlet />` is where the matched child renders, so the nav stays and only the content changes.
- `useParams` reads `/products/42`. `useSearchParams` reads `?page=2`. `useLocation` gives `pathname`.
- `<Link>` changes the URL with **no reload**. `<a href>` reloads and loses state.
- Each route group can have its own layout route.

## 4. Fetching (D2)

```jsx
import { useEffect, useState } from 'react';

export function CourseCount() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {                               // effect itself can't be async
      try {
        const res = await fetch('https://example.com/api/courses', { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setCourses(await res.json());
      } catch (err) {
        if (controller.signal.aborted) return;            // unmounted: touch no state
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();                      // cleanup on unmount
  }, []);                                                 // [] = run once after mount

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>There are {courses.length} courses.</p>;
}
```

- **Why async (D2a):** a request takes unknown time, and JS runs the UI on one thread. A Promise lets the page keep rendering ("Loading...") while waiting.
- **Why not `async` on the effect:** the effect must return a cleanup function, not a Promise.
- **Four UI states:** loading, error, empty, success.
- `[id]` reruns the effect when `id` changes. No array reruns it after every render. Fetching in the body loops forever.
- **Service module (D2c):** put `getCourses()` in `services/courseService.js`. URL, headers and errors live in one place, get reused, and are easy to test. Components only display.

```js
const BASE_URL = 'https://example.com/api';
export async function getCourses(signal) {
  const res = await fetch(`${BASE_URL}/courses`, { signal });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
```

## 5. Forms + HTTP (D3, C5)

```jsx
const [form, setForm] = useState({ name: '', location: '', maxAttendees: '' });
const [errors, setErrors] = useState({});

<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

function validateEvent(form) {
  const errors = {};
  if (form.name.trim() === '') errors.name = 'Event name is required.';
  if (form.location.trim() === '') errors.location = 'Location is required.';
  const max = Number(form.maxAttendees);                  // inputs are strings
  if (!Number.isInteger(max) || max <= 0) errors.maxAttendees = 'Must be a positive whole number.';
  return errors;                                          // {} = valid
}

async function handleSubmit(e) {
  e.preventDefault();                                     // stop the full-page submit
  const found = validateEvent(form);
  if (Object.keys(found).length > 0) return setErrors(found);
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },     // + Authorization: `Bearer ${token}`
    body: JSON.stringify({ ...form, maxAttendees: Number(form.maxAttendees) }),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
}
```

| Method | Does | Idempotent? |
|---|---|---|
| GET | read | yes (safe) |
| POST | create at `/api/events`, usually replies 201 | **no**: twice creates two |
| PUT | replace the whole record at `/api/events/7` | yes |
| PATCH | change some fields | usually |
| DELETE | remove | yes |

**Codes:** 200 OK · 201 Created · **204 success, no body** · 400 bad data · **401 not authenticated** (clear session, go to login) · **403 authenticated but not allowed** (show access denied; re-login won't help) · 404 not found · 409 conflict · 500 server error · 301 moved permanently.

- Client validation is for the user (instant feedback). It **guarantees nothing**, so the server validates again.

## 6. TanStack Query + Zustand (D4, C4)

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products'],                               // cache name; put variables in: ['product', id]
    queryFn: () => getProducts(),                         // must throw on failure
    staleTime: 60_000,                                    // fresh for 60 s = no refetch
  });
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return <ul>{data.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}

function EditPrice({ product }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (changes) => updateProduct(product.id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
  return <button disabled={mutation.isPending} onClick={() => mutation.mutate({ price: 9.99 })}>Save</button>;
}
```

```js
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));

// in a component: subscribe to one slice with a selector
const theme = useThemeStore((s) => s.theme);
```

- **TanStack = server state** (a cached copy of API data: fetching, caching, refetching, dedupe). **Zustand = client state** (theme, basket, open menu). They are not interchangeable and are often used together.
- **Caching (D4b):** results are stored by query key, so the same key gives instant data, duplicate requests merge, and there is no refetch while fresh.
- **`invalidateQueries` (C4/D4c):** marks matching keys stale and refetches the ones on screen, so the UI shows the updated data.
- **Selector (D4d):** the component re-renders only when its slice changes. Without one it gets the whole store and re-renders on any change (allowed, but slower).
- v5 names: `gcTime` (was `cacheTime`), `isPending` (was `isLoading`), object syntax only.

## 7. CSS + HTML

- `grid-template-areas: "header header" "sidebar main";` + `grid-area: main;` gives named regions. Each string is a row.
- `repeat(auto-fit, minmax(200px, 1fr))` = as many columns as fit. `minmax` works **only on grid tracks**.
- `clamp(1rem, 2.5vw, 2rem)` = preferred value between a min and max. `calc` = arithmetic. `var(--x)` = a CSS variable.
- `@media (max-width: 700px) { ... }` adapts the layout. Mobile-first uses `min-width`.
- `:focus-visible` shows the focus ring for keyboard users. Never `outline: none` with no replacement.
- **HTML5 semantics:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` give meaning, accessibility and SEO.
- **Bootstrap:** 12-column grid, `.container` > `.row` > `.col-md-6`. Breakpoints are `sm 576`, `md 768`, `lg 992`, `xl 1200` px. Classes: `btn btn-primary`, `d-flex`, `mt-3`.

## 8. Web basics + security (E)

- **DNS** turns a name into an IP. **IP** addresses machines. **TCP** gives reliable, ordered delivery. **HTTP** is the request/response on top, and **HTTPS** = HTTP over TLS.
- **MVC:** Model = data, View = UI, Controller = handles input. **DTO** = a plain object shaped for transfer between layers or over the API.
- **CORS:** the browser blocks cross-origin responses unless the **server** sends `Access-Control-Allow-Origin`. Fix it on the server, not in React.
- **AuthN** = who are you (401). **AuthZ** = what may you do (403). AuthN comes first.
- **JWT** = `header.payload.signature`. The payload is **encoded, not encrypted**. `exp` is in **seconds** (`exp * 1000 < Date.now()`). Only the server verifies it.
- **Expired token (E1):** clear the token, send to login (or refresh). Never keep treating the user as logged in.
- **Hiding routes (E3)** is UX only. Users can edit the JS or call the API directly, so the server checks every request.
- **HTTPS (E4):** protects data **in transit**. It does not stop XSS.
- **API data (E5):** a 200 doesn't make it safe. Validate it, rely on React's `{}` escaping, avoid `dangerouslySetInnerHTML`, and check `javascript:` URLs. Types vanish at runtime.
- **Token storage:** `localStorage` survives reloads but XSS can read it. An `httpOnly` `Secure` `SameSite` cookie can't be read by JS. Memory is lost on refresh. **Logout** = clear the token and user from state and storage, then `navigate('/login', { replace: true })`.

## If they ask for TypeScript

The JS above plus these additions. Types are erased at runtime.

```ts
interface Product { id: number; name: string; price: number; description?: string }  // ? = optional
type Theme = 'light' | 'dark';   let v: string | number;   // alias + literal union; | = either, & = both (string & number = never)

function Greeting({ name }: { name: string }) { ... }
const [items, setItems] = useState<Product[]>([]);   const [error, setError] = useState<string | null>(null);
const { orderId } = useParams<{ orderId: string }>();
async function getCourses(): Promise<Course[]> { ... }
function handleSubmit(e: React.FormEvent<HTMLFormElement>) { ... }
const useThemeStore = create<ThemeState>()((set) => ({ ... }));   // two sets of brackets in v5
catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }   // err is unknown
```
