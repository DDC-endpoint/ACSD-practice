---
id: refresher
module: ACSD
kind: guide
title: ACSD ICT concept refresher
---

# ACSD ICT · Concept refresher

Read this on the morning of the test (Wed 25 Nov 2026). It covers every concept the mock paper tests, in the order of the stack: plain JavaScript, then TypeScript, React, routing, data, state, CSS and security. The last section lists the traps the multiple-choice options set.

How to use it:

- Each concept ends with a bold **In the exam:** line. That one sentence is the answer that gets the marks. If you only have ten minutes, read just those lines and the code blocks.
- The code is short on purpose. In the real test you type into a Blackboard text box with no editor and no autocomplete, so learn the shape of each snippet: imports, Hook call, `return`.
- "Logically correct solutions receive credit." A missing semicolon will not cost you marks, but a missing `await`, a missing `key` or a missing `0` in `reduce` can.

Versions this guide uses: React 19, TypeScript, react-router-dom v7, @tanstack/react-query v5, zustand v5, and the browser Fetch API.

## 1. JS array methods and Promises

### The array methods you need

| Method | Returns | Changes the original? |
|---|---|---|
| `map(fn)` | a new array, same length, each item transformed | no |
| `filter(fn)` | a new array of every item where `fn` is true (can be `[]`) | no |
| `find(fn)` | the **first** matching item, or `undefined` | no |
| `findIndex(fn)` | the index of the first match, or `-1` | no |
| `some(fn)` | `true` if **at least one** item passes | no |
| `every(fn)` | `true` if **all** items pass (`true` for `[]`) | no |
| `reduce(fn, start)` | **one** accumulated value (a total, an object, anything) | no |
| `slice(start, end)` | a copy of part of the array (`end` not included) | no |
| `sort(compareFn)` | the same array, sorted | **yes, it mutates** |
| `splice(...)` | the removed items | **yes, it mutates** |
| `forEach(fn)` | `undefined` (it's only for side effects) | no |

```js
const products = [
  { id: 1, name: 'Pen', price: 2, inStock: true },
  { id: 2, name: 'Book', price: 12, inStock: false },
  { id: 3, name: 'Bag', price: 30, inStock: true },
];

const names    = products.map((p) => p.name);          // ['Pen', 'Book', 'Bag']
const inStock  = products.filter((p) => p.inStock);    // Pen and Bag
const book     = products.find((p) => p.id === 2);     // the Book object (first match only)
const anyCheap = products.some((p) => p.price < 5);    // true
const allCheap = products.every((p) => p.price < 5);   // false
const firstTwo = products.slice(0, 2);                 // Pen, Book (copy)
```

**In the exam:** `find` returns only the first match (or `undefined`); to get every match, use `filter`.

### reduce: one accumulated value (A1, C1)

`reduce` walks the array and carries a running value (the "accumulator") from one item to the next. Always give the start value as the second argument.

```js
const prices = [15, 25, 10, 30];
const total = prices.reduce((sum, price) => sum + price, 0);   // 80
```

```js
// basket total with quantities
const basketTotal = basket.reduce((sum, item) => sum + item.price * item.qty, 0);
```

- Without the `0`, `reduce` on an empty array throws a `TypeError`.
- With objects, forgetting the `0` makes the first `sum` the whole first object, so the result is wrong.

**In the exam:** `const total = prices.reduce((sum, price) => sum + price, 0);` gives one accumulated value (80), and the `0` is the starting value.

### sort mutates; slice copies

```js
const nums = [10, 9, 1];
nums.sort();                                  // [1, 10, 9]: the default sort compares as strings!
nums.sort((a, b) => a - b);                   // [1, 9, 10]: ascending numbers
const sorted = [...nums].sort((a, b) => b - a); // copy first, then sort: nums is untouched
const sorted2 = nums.toSorted((a, b) => a - b); // ES2023 non-mutating version
```

In React, never `sort` state in place. Copy it first (`[...items]`) or use `toSorted`, because mutating state does not trigger a re-render.

**In the exam:** `sort` mutates the original array (and sorts as strings unless you pass `(a, b) => a - b`), while `slice` returns a copy and changes nothing.

### Promises and async/await

A **Promise** is an object for a value that will arrive later. It is *pending*, then either *fulfilled* (with a value) or *rejected* (with an error). "Settled" means it is no longer pending, either way.

`async`/`await` is a nicer way to write Promise code:

- An `async` function **always returns a Promise**.
- `await` pauses **that function only** until the Promise settles. The rest of the page keeps running.
- Use `try/catch` around `await` to handle a rejection.

```ts
async function loadUser(id: number) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();          // res.json() is a Promise too
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

**In the exam:** an `async` function always returns a Promise, and `await` pauses only that function until the Promise settles, without blocking the UI.

### Promise.all vs Promise.allSettled (A7)

```ts
// Run both requests at the same time and wait for both
const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);

// Wait for every result, even the failures
const results = await Promise.allSettled([getUser(id), getOrders(id)]);
results.forEach((r) => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.log('failed:', r.reason);
});
```

| | `Promise.all` | `Promise.allSettled` |
|---|---|---|
| Waits for | all to **fulfil** | all to **settle** (fulfil or reject) |
| If one fails | rejects at once with that error ("fail fast") | never rejects; that entry is `{ status: 'rejected', reason }` |
| Result | array of values, in the same order as the input | array of `{ status, value }` / `{ status, reason }` objects |
| Use when | you need every result to continue | you want whatever succeeded |

The other options in A7 are traps:

- Cancelling requests is `AbortController`'s job (see section 5), not `Promise.all`'s.
- Running things one after another is a `for...of` loop with `await` inside. `Promise.all` waits for them in parallel.

**In the exam:** `Promise.all` waits for several async operations at once and gives you all their results in order, but it rejects as soon as any one of them fails. `allSettled` waits for every one and reports each success or failure.

Docs: [MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [MDN Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled), [MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

## 2. TypeScript

TypeScript is JavaScript with types that are checked **while you write and build**. The types are erased when the code runs, which matters for security (section 11).

### interface: the shape of an object (A8, B2, C2)

An `interface` describes which properties an object must have and their types. It is ideal for API data: "the server sends products that look like this".

This is the C2 answer. Learn it exactly:

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}
```

- `description?: string` is an **optional** property: it may be missing. Its type is `string | undefined`, so read it safely with `product.description ?? 'No description'` or `product.description?.length`.
- Use it for typing API data: `const products: Product[] = await res.json();` and `useState<Product[]>([])`.
- Use it for props: `interface ProductCardProps { product: Product; onSelect?: (id: number) => void }`.
- Extend it: `interface DigitalProduct extends Product { downloadUrl: string }`.

**In the exam:** an interface defines the expected structure of an object (its property names and types), and `?` marks a property as optional.

### type: a type alias (A3)

The `type` keyword gives a name to **any** type: an object, a union, a primitive, a tuple or a function.

```ts
type ID = number | string;
type Theme = 'light' | 'dark';
type Point = { x: number; y: number };
type NewProduct = Omit<Product, 'id'>;   // everything except id (for a POST body)
```

| | `interface` | `type` |
|---|---|---|
| Object shapes | yes | yes |
| Unions, literals, primitives, tuples | no | yes |
| Combine | `extends` | `&` (intersection) |
| Can be reopened and merged | yes | no |

**In the exam:** the `type` keyword defines a custom type alias. `interface` only describes object shapes, while `type` can also name unions and primitives.

### Union | vs intersection & (A14, B13)

```ts
let value: string | number;    // union: EITHER a string OR a number
value = 'abc';                 // ok
value = 42;                    // ok

type User = { name: string };
type Admin = User & { permissions: string[] };   // intersection: BOTH at once
const a: Admin = { name: 'Sam', permissions: ['delete'] };

type Impossible = string & number;   // never: nothing is both a string and a number
```

**In the exam:** a union `A | B` means "one of these types", and an intersection `A & B` means "all of these at once". So `string | number` is the answer for "a string or a number", and `string & number` is `never`.

### Literal unions

A union of exact values. TypeScript then rejects anything else, which catches typos.

```ts
type Theme = 'light' | 'dark';
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
let theme: Theme = 'light';
theme = 'blue';   // compile error
```

**In the exam:** a literal union such as `'light' | 'dark'` restricts a value to a fixed set of exact strings.

### Narrowing

When a value has a union type, you check it first, and TypeScript then "narrows" it to the specific type inside that branch.

```ts
function format(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase();   // string here
  return value.toFixed(2);                                     // number here
}

type Result =
  | { status: 'success'; data: Product[] }
  | { status: 'error'; message: string };

function show(r: Result) {
  if (r.status === 'success') return r.data.length;   // data exists here
  return r.message;                                   // message exists here
}
```

Ways to narrow: `typeof x === 'string'`, `x instanceof Error`, `'prop' in x`, `x === null`, `Array.isArray(x)`, and checking a shared "tag" field like `status`.

In a `catch (err)`, `err` is `unknown`, so narrow it before use: `err instanceof Error ? err.message : 'Unknown error'`.

**In the exam:** narrowing means using a runtime check like `typeof` or `instanceof` so that TypeScript knows the exact type inside that branch.

### Handy extras

| Thing | Meaning |
|---|---|
| `any` | switches type checking off (avoid) |
| `unknown` | "could be anything": you must narrow before using it |
| `Partial<T>` | every property optional (good for PATCH bodies and error objects) |
| `Omit<T, 'id'>` | `T` without `id` (good for "create" data) |
| `Record<K, V>` | an object with keys `K` and values `V` |
| `Promise<Product[]>` | the return type of an async function that gives products |

Docs: [TypeScript handbook: everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [object types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

## 3. React basics

### Components and props

A component is a function that returns JSX. **Props** are the inputs a parent passes in. They are read-only, so never change them.

```tsx
interface GreetingProps {
  name: string;
  isAdmin?: boolean;
}

function Greeting({ name, isAdmin = false }: GreetingProps) {
  return <h2>Hello {name}{isAdmin && ' (admin)'}</h2>;
}

// used as: <Greeting name="Damian" isAdmin />
```

**In the exam:** props are read-only inputs passed from parent to child, and state is data a component owns and changes itself.

### State with useState

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>;
}
```

- Calling the setter makes React **re-render** the component with the new value.
- Use the updater form `setCount((c) => c + 1)` when the new value depends on the old one.
- **Never mutate** state. Make a new array or object:
  - add: `setItems([...items, newItem])`
  - remove: `setItems(items.filter((i) => i.id !== id))`
  - update: `setItems(items.map((i) => (i.id === id ? { ...i, done: true } : i)))`
- Pass a function to `onClick`: `onClick={() => remove(id)}`. Writing `onClick={remove(id)}` calls it during render.

**In the exam:** state is updated with its setter function and a new value (never by mutating it), and every update causes a re-render.

### Conditional rendering (A4)

Show different JSX depending on a condition, for example which tab is selected.

```tsx
function Tabs() {
  const [tab, setTab] = useState<'info' | 'reviews'>('info');
  return (
    <>
      <button onClick={() => setTab('info')}>Info</button>
      <button onClick={() => setTab('reviews')}>Reviews</button>
      {tab === 'info' ? <ProductInfo /> : <Reviews />}
      {tab === 'reviews' && <p>Showing reviews</p>}
    </>
  );
}
```

There are three forms: the ternary `cond ? <A /> : <B />`, the `cond && <A />` form, and an early `if (...) return ...`.

Trap: `{items.length && <List />}` prints `0` when the list is empty. Use `{items.length > 0 && <List />}`.

**In the exam:** conditional rendering uses a ternary, `&&` or an early return to show different JSX depending on state, such as the selected tab.

### Lists and keys

```tsx
<ul>
  {products.map((p) => (
    <li key={p.id}>{p.name}: £{p.price}</li>
  ))}
</ul>
```

- `key` must be **unique among siblings** and **stable**, so use the record's `id`.
- Avoid the array index as the key if the list can be reordered, filtered or added to.

**In the exam:** render lists with `map` and give each item a unique, stable `key` (usually its id) so React can track which item changed.

### Custom Hooks

A custom Hook is a function whose name starts with `use` and that calls other Hooks. It lets several components **reuse logic**, while each component gets **its own copy of the state**.

```ts
import { useState } from 'react';

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle] as const;
}

// in a component:
const [isOpen, toggleOpen] = useToggle();
```

The D2 fetching code (section 5) can be turned into a `useCourses()` custom Hook in exactly this way.

**In the exam:** a custom Hook is a `use...` function that calls other Hooks to share stateful logic between components, and it must follow the Rules of Hooks.

### The Rules of Hooks (B4)

1. **Only call Hooks at the top level**: never inside `if`, loops, nested functions, or after an early `return`. React matches Hooks by their call order, so the order must be the same on every render.
2. **Only call Hooks from React function components or from custom Hooks**, never from ordinary functions or classes.

```tsx
// WRONG
if (isLoggedIn) { const [x, setX] = useState(0); }

// RIGHT
const [x, setX] = useState(0);
if (isLoggedIn) { /* use x here */ }
```

(React 19's `use()` is the one exception that may be called inside a condition. Every other Hook follows rule 1.)

**In the exam:** Hooks must be called at the top level, in the same order on every render, and only from components or custom Hooks.

Docs: [react.dev: conditional rendering](https://react.dev/learn/conditional-rendering), [rendering lists](https://react.dev/learn/rendering-lists), [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

## 4. React Router

React Router v7 maps URLs to components inside a single-page app. A `<Link>` changes the URL using the browser History API, and React swaps the page component **without a full page reload** (B1). A plain `<a href>` reloads the whole app and loses your state.

### The Hooks and components

| API | What it does | Mock |
|---|---|---|
| `useParams()` | reads dynamic segments: `/students/:studentId` gives `{ studentId: '42' }` | A10, C3, D1c |
| `useNavigate()` | returns `navigate(...)` to change page from code | A2, D1d |
| `useSearchParams()` | reads and sets the query string `?q=pen&page=2` | A18 |
| `useLocation()` | the current location: `pathname`, `search`, `state` | |
| `<Outlet />` | where a parent layout renders the matched child route | A6, D1b |
| `<Link to="/x">` | a navigation link with no reload | |
| `<Navigate to="/login" replace />` | redirects as soon as it renders | |

All of these import from `'react-router-dom'` (in v7 it re-exports everything from `react-router`).

### D1a: config with a shared layout (data router form)

```tsx
import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/students">Students</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'students', element: <StudentList /> },
      { path: 'students/:studentId', element: <StudentDetails /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

- `index: true` is the child shown at the parent's own path (`/`), so it is the home page.
- Child paths are **relative** (no leading `/`), so `students` becomes `/students`.
- `:studentId` is a **dynamic segment**. It matches `/students/1`, `/students/42` and so on (B8).

### D1a: the same config in JSX form

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
```

Either form gets the 4 marks. Pick one and learn it. The JSX form is shorter to type.

**In the exam:** wrap the routes in a parent route whose element is the layout, nest the four pages as children (use `index` for `/` and `students/:studentId` for the details page), and render `<Outlet />` inside the layout.

### D1b: the purpose of Outlet

**In the exam:** `<Outlet />` is a placeholder in the parent layout where the matched child route's component renders, so the shared navigation menu stays on screen and only the page content inside it changes.

### D1c and C3: reading the parameter with useParams

```tsx
import { useParams } from 'react-router-dom';

function StudentDetails() {
  const { studentId } = useParams();
  return <h1>Student ID: {studentId}</h1>;
}
```

C3, for the route `/orders/:orderId`:

```tsx
const { orderId } = useParams();
// or, typed:
const { orderId } = useParams<{ orderId: string }>();
```

- The name in the destructuring must match the name after `:` in the route.
- Params are always **strings** (or `undefined`). Use `Number(orderId)` if you need a number.

**In the exam (C3):** the Hook is `useParams()`, and the expression is `const { orderId } = useParams();`.

### D1d: navigating after save with useNavigate

```tsx
import { useNavigate } from 'react-router-dom';

function PreferencesForm() {
  const navigate = useNavigate();

  async function handleSave() {
    await savePreferences(prefs);   // wait until the save succeeds
    navigate('/settings');          // then change page
  }

  return <button onClick={handleSave}>Save</button>;
}
```

- Call `useNavigate()` at the top of the component (Rules of Hooks), and call `navigate(...)` inside the event handler, after the save succeeds.
- Other forms: `navigate(-1)` goes back, and `navigate('/login', { replace: true })` replaces the history entry.
- To redirect **while rendering** (not in a handler), return `<Navigate to="/settings" />` instead.

**In the exam:** use `useNavigate()`: call `const navigate = useNavigate()` at the top of the component, then call `navigate('/settings')` in the save handler once the save has succeeded. The URL changes without a page reload.

### useSearchParams and useLocation (A18)

```tsx
// URL: /products?category=books&page=2
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category');        // 'books' (string or null)
const page = Number(searchParams.get('page') ?? 1);   // 2
setSearchParams({ category: 'toys' });                // URL becomes ?category=toys

const location = useLocation();
location.pathname;   // '/products'
location.search;     // '?category=books&page=2'
```

**In the exam:** `useParams` reads path segments (`/products/42`), while `useSearchParams` reads the query string (`?page=2`).

### Different layouts for different route groups (B11)

A parent route with no `path` (a "layout route") wraps a group of pages in its own layout.

```tsx
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
]);
```

**In the exam:** yes, each group of routes can be nested under its own parent layout route, and each layout renders its own `<Outlet />`.

Docs: [reactrouter.com](https://reactrouter.com/home), [routing (data mode)](https://reactrouter.com/start/data/routing), [routing (declarative mode)](https://reactrouter.com/start/declarative/routing).

## 5. Fetching data

### D2a: why the request must be asynchronous

**In the exam:** a network request takes an unknown amount of time, and JavaScript runs the UI on a single main thread, so waiting synchronously would freeze the page. `fetch` returns a Promise instead, which lets the UI keep rendering (and show "Loading...") while the request is in progress, and the code continues when the response arrives.

### D2b: the full component (useEffect + AbortController)

Learn this one exactly. It covers all five requirements: load on mount, loading message, error message, the count, and no state updates after unmount.

```tsx
import { useEffect, useState } from 'react';

interface Course {
  id: number;
  title: string;
}

export function CourseCount() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('https://example.com/api/courses', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        if (controller.signal.aborted) return;   // unmounted: touch no state
        setError(err instanceof Error ? err.message : 'Request failed');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();   // cleanup runs on unmount
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>There are {courses.length} courses.</p>;
}
```

How each requirement is met (say this in your answer):

| Requirement | Code |
|---|---|
| Load when the component loads | `useEffect(..., [])`: the empty array means "run once after the first render" |
| Loading message | `loading` starts as `true`, and the component returns `<p>Loading...</p>` |
| Error message | `catch` stores the message, and the component returns the error `<p>` |
| Number of courses | `courses.length` |
| No update after unmount | the cleanup calls `controller.abort()`, the fetch rejects, and the code skips `setState` when `signal.aborted` |

Points that win marks:

- **`fetch` does not reject on 404 or 500.** It only rejects on network failure or abort. You must check `res.ok` yourself.
- `res.json()` also returns a Promise, so `await` it.
- The effect callback cannot itself be `async` (it must return a cleanup function, not a Promise), so you define `async function load()` inside it and call it.
- React 19 in Strict Mode runs effects twice in development (mount, clean up, mount). The abort makes that harmless.

**In the exam:** fetch inside `useEffect` with an empty dependency array, track `loading`, `error` and the data in state, check `res.ok`, and return a cleanup that calls `controller.abort()` so no state is set after unmount.

### useEffect dependency array

| You write | Effect runs |
|---|---|
| `useEffect(fn, [])` | once, after the first render |
| `useEffect(fn, [id])` | after the first render and whenever `id` changes |
| `useEffect(fn)` | after every render (rarely what you want) |
| `return () => {...}` inside `fn` | the cleanup runs before the next run and on unmount |

Never fetch directly in the component body. Setting state causes a re-render, which fetches again, in an endless loop.

**In the exam:** an effect with `[]` runs once after mount, and its returned cleanup function runs when the component unmounts.

### D2c and A19: an API service module

```ts
// src/services/courseService.ts
const BASE_URL = 'https://example.com/api';

export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses`, { signal });
  if (!res.ok) throw new Error(`Failed to load courses: ${res.status}`);
  return res.json();
}

// in any component:  const data = await getCourses(controller.signal);
```

The benefits:

- **One place** holds the URL, the headers, the auth token and the error handling. A change happens once, not in every component.
- **Reuse**: several components call `getCourses()` instead of copying the `fetch` code.
- **Separation of concerns**: components handle display, and the service handles data access.
- It is easier to test or mock, and it plugs straight into TanStack Query as the `queryFn`.

**In the exam:** a service module separates data-access logic from presentation components, so when several components use the same endpoint the URL, headers and error handling are written once, reused and changed in one place.

Docs: [react.dev: useEffect](https://react.dev/reference/react/useEffect), [MDN Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

## 6. HTTP

### Methods

| Method | CRUD | Typical URL | Body? | Same request twice gives |
|---|---|---|---|---|
| GET | Read | `/api/events` or `/api/events/7` | no | the same result (safe, no change) |
| POST | Create | `/api/events` (the collection) | yes | **two** new records (not idempotent) |
| PUT | Update: replace the whole record | `/api/events/7` | yes, the full object | the same result (idempotent) |
| PATCH | Update: change some fields | `/api/events/7` | yes, only the changed fields | usually the same result |
| DELETE | Delete | `/api/events/7` | no | the record stays deleted (idempotent) |

**In the exam:** GET reads, POST creates, PUT replaces an existing resource, PATCH partially updates it, and DELETE removes it.

### Status codes

| Code | Name | Meaning | What the frontend does |
|---|---|---|---|
| 200 | OK | success, with a body | show the data |
| 201 | Created | a POST created a resource | show success, maybe navigate to the new item |
| 204 | No Content | success, **no body** (common after DELETE or PUT) | don't call `res.json()`; just update the UI |
| 400 | Bad Request | invalid data sent | show the validation errors from the server |
| 401 | Unauthorized | **not authenticated**: no, invalid or expired token | clear the session, send to login (or refresh the token) |
| 403 | Forbidden | authenticated, but **no permission** | show "You don't have access"; logging in again won't help |
| 404 | Not Found | no such resource or route | show "not found" |
| 409 | Conflict | clashes with current state (duplicate email, edit conflict) | tell the user, and let them change it or reload |
| 500 | Internal Server Error | the server failed | show a generic error and offer a retry |

2xx means success, 4xx means the client sent something wrong, and 5xx means the server failed. A 301 means "moved permanently" (a distractor in A13).

**In the exam (A13):** 204 means the request succeeded but there is no response body to return.

### C5: 401 vs 403 from the frontend's view

**In the exam:** a 401 means the server doesn't know who the user is (no token, or an invalid or expired one), so the frontend should clear the session and send the user to log in or renew the token. A 403 means the server knows who the user is but that user lacks permission, so the frontend should show an "access denied" message, because logging in again won't help.

Docs: [MDN HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods), [MDN HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

## 7. Forms, validation and CRUD

### A controlled form

The input's `value` comes from state, and `onChange` writes back to state. Form values are always **strings**, even from `type="number"`.

```tsx
const [form, setForm] = useState({ name: '', location: '', maxAttendees: '' });

<input
  value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })}
/>
```

Submit handler:

```tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();                       // stop the browser's full-page submit
  const errors = validateEvent(form);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);                      // show the messages, don't submit
    return;
  }
  await createEvent({ name: form.name.trim(), location: form.location.trim(), maxAttendees: Number(form.maxAttendees) });
}
```

**In the exam:** a controlled input takes its `value` from state and updates it in `onChange`, and the submit handler calls `e.preventDefault()`, validates, and only submits when there are no errors.

### D3a: the validation function

```ts
interface EventForm {
  name: string;
  location: string;
  maxAttendees: string;
}

type EventErrors = Partial<Record<keyof EventForm, string>>;

function validateEvent(form: EventForm): EventErrors {
  const errors: EventErrors = {};

  if (form.name.trim() === '') {
    errors.name = 'Event name is required.';
  }
  if (form.location.trim() === '') {
    errors.location = 'Location is required.';
  }
  const max = Number(form.maxAttendees);
  if (!Number.isInteger(max) || max <= 0) {
    errors.maxAttendees = 'Maximum attendees must be a positive whole number.';
  }

  return errors;   // {} means valid
}
```

Why it is correct:

- `.trim()` makes `"   "` count as empty.
- `Number('')` is `0`, so an empty field fails `max <= 0`.
- `Number('abc')` is `NaN`, and `Number('2.5')` is `2.5`. `Number.isInteger` rejects both.
- "Positive" excludes `0`, so the check is `<= 0`.
- It returns one message per field, so the form can show each message next to its input.

If you're short on time, `const errors: Record<string, string> = {}` is fine too.

**In the exam:** check each field and collect a message per failing field in an `errors` object (`trim()` for empty strings, `Number.isInteger(n) && n > 0` for a positive integer), and return the object, where empty means valid.

### D3b: POST with headers and JSON.stringify

```ts
interface NewEvent {
  name: string;
  location: string;
  maxAttendees: number;
}

async function createEvent(event: NewEvent) {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  return res.json();   // usually the created event (201 Created)
}
```

- `Content-Type: application/json` tells the server the body is JSON.
- `JSON.stringify` turns the object into a JSON string. `fetch` cannot send a plain object.
- If the API needs a login, add ``Authorization: `Bearer ${token}` `` to the headers.
- Check `res.ok`, because a 400 or 409 does not throw by itself.

**In the exam:** call `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })`, then check `res.ok`.

### D3c: POST vs PUT

**In the exam:** POST sends a new record to the collection URL (`/api/events`) and the server creates it, assigns its id and usually replies 201, so sending it twice creates two events. PUT sends the full updated record to that record's own URL (`/api/events/7`) and replaces it, so it is idempotent: sending it twice gives the same result. A frontend uses POST for "create" forms and PUT (or PATCH, for a partial change) for "edit" forms.

### Client validation never replaces server validation (A17, B9)

- **Client-side validation** is for the user: instant feedback and fewer wasted requests. That's why it is the A17 answer for stopping a badly formatted email being submitted.
- It guarantees **nothing**. A user can turn off JavaScript, edit the code in DevTools, or send the request directly with `curl` or Postman. **The server must validate everything again.**

**In the exam:** client-side validation improves the user experience, but it does not guarantee that invalid data can't reach the server (B9 is **False**), so the server must always validate too.

Docs: [react.dev: input](https://react.dev/reference/react-dom/components/input), [MDN Using Fetch: supplying a body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [MDN client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation).

## 8. TanStack Query

### Server state vs client state

| Server state | Client (UI) state |
|---|---|
| lives on the server; you hold a **copy** | lives only in the browser |
| can go out of date (stale) | always current |
| needs fetching, caching, refetching, deduping | needs plain storing and sharing |
| products, orders, a user profile | theme, an open menu, the selected tab, form input |
| **TanStack Query** | **useState / Zustand** |

**In the exam:** TanStack Query manages asynchronous server data, including fetching, caching, background refetching and keeping it in sync with the server (B6 is **True**).

### Setup and useQuery (v5: object syntax only)

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

```tsx
import { useQuery } from '@tanstack/react-query';

function ProductList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(), // from the service module
    staleTime: 60_000,            // fresh for 60 seconds
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return <ul>{data.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

- `queryFn` must return a Promise and **throw on failure** (that's why the service checks `res.ok`).
- TanStack calls `queryFn` with a context object (`{ queryKey, signal, ... }`). So write `queryFn: () => getProducts()`, or `queryFn: ({ signal }) => getProducts(signal)` to get cancellation for free. Don't write `queryFn: getProducts` if `getProducts` takes a parameter, because it would receive the context object instead.
- You get no `useEffect`, no `loading` state and no AbortController boilerplate. The library does it.

### Query keys

The key is an **array** that uniquely names the data in the cache. Put every variable the query depends on in the key.

```ts
useQuery({ queryKey: ['products'], queryFn: getProducts });
useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) });  // one cache entry per id
```

When `id` changes, the key changes, so TanStack fetches (or reuses) a different cache entry.

**In the exam:** the query key is an array that identifies a query's data in the cache. Components using the same key share one cache entry, and the variables go in the key (`['product', id]`).

### staleTime, gcTime and the status flags (A11)

| Option or flag | Meaning | Default |
|---|---|---|
| `staleTime` | how long fetched data counts as **fresh**. Fresh data is served from the cache with no refetch | `0` (stale at once) |
| `gcTime` | how long **unused** cache data is kept in memory before it is garbage-collected (was `cacheTime` in v4) | 5 minutes |
| `isPending` | no data yet (the first load). Was `isLoading` in v4 | |
| `isFetching` | any request in flight, including background refetches | |
| `isLoading` | in v5, means `isPending && isFetching` | |
| `isError` / `error` | the `queryFn` threw | |

Stale data is still shown. TanStack just refetches it in the background when a component mounts, the window regains focus, or the network reconnects.

**In the exam (A11):** `staleTime` controls how long cached query data is considered fresh. While it is fresh, TanStack serves it from the cache without making a new request.

### D4b: what query caching means

**In the exam:** TanStack stores each query's result in a cache under its query key, so any component asking for the same key gets the data instantly from memory, and identical requests made at the same time are merged into one. With `staleTime` it doesn't refetch while the data is fresh. This means fewer API requests, faster screens, and the same data everywhere.

### useMutation and invalidateQueries (A15, C4, D4c)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function EditProduct({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (changes: Partial<Product>) => updateProduct(product.id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <button disabled={mutation.isPending} onClick={() => mutation.mutate({ price: 9.99 })}>
      Save
    </button>
  );
}
```

- `invalidateQueries({ queryKey: ['products'] })` marks every query whose key **starts with** `['products']` as stale (so `['products', 7]` too), and immediately refetches those currently on screen.
- Add `exact: true` to match only that exact key.
- Mutations also use `isPending` in v5.

**In the exam (C4):** call `queryClient.invalidateQueries({ queryKey: ['customer'] })` in the mutation's `onSuccess`. It marks the matching cached queries as stale (invalid) and refetches the active ones, so the UI shows the updated customer data instead of the old cached copy.

**In the exam (D4c):** run the update with `useMutation`, and in `onSuccess` call `queryClient.invalidateQueries({ queryKey: ['products'] })` so TanStack refetches the product queries from the server.

### v4 to v5 changes (don't write v4 code)

| v4 (old, wrong now) | v5 (correct) |
|---|---|
| `useQuery(['products'], fetchProducts)` | `useQuery({ queryKey: ['products'], queryFn: fetchProducts })` |
| `cacheTime` | `gcTime` |
| `isLoading` (no data yet) | `isPending` |
| `invalidateQueries(['products'])` | `invalidateQueries({ queryKey: ['products'] })` |
| `onSuccess` / `onError` on `useQuery` | removed from `useQuery` (still on `useMutation`) |
| `keepPreviousData: true` | `placeholderData: keepPreviousData` |

Docs: [TanStack Query overview](https://tanstack.com/query/latest/docs/framework/react/overview), [query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching), [query invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation), [migrating to v5](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5).

## 9. Zustand

Zustand is a small library for **client state** that many components share, such as the theme or a basket. It needs no Provider.

### A store (v5)

```ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
```

- `create<ThemeState>()(...)` has **two** sets of brackets in TypeScript. That's the v5 typed form.
- `create` returns a **Hook** (`useThemeStore`). That is the "store's generated Hook" in A12.
- `set` **merges** the object you return into the state, so you only return the fields that change.
- Actions (functions) live in the store next to the data.

### Selectors

```tsx
function ThemeButton() {
  const theme = useThemeStore((s) => s.theme);              // selector: only `theme`
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}
```

- A **selector** is the function `(s) => s.theme`. The component subscribes only to what it returns.
- Without a selector, `useThemeStore()` returns the whole store, and the component re-renders on **any** change. That's allowed, but slower. Zustand doesn't force it (B7 is **False**).
- In v5, a selector that builds a new object each time (`(s) => ({ a: s.a, b: s.b })`) causes endless re-renders. Select single values, or wrap it in `useShallow` from `'zustand/react/shallow'`.
- Outside React: `useThemeStore.getState().theme`.

**In the exam (D4d):** a selector makes the component subscribe only to the slice it needs (for example `useThemeStore((s) => s.theme)`), so it re-renders only when that value changes, not on every store update. That gives fewer re-renders and better performance.

### Persisting the theme (optional extra)

```ts
import { persist } from 'zustand/middleware';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme' },   // localStorage key
  ),
);
```

### Zustand vs TanStack Query (D4a)

| | Zustand | TanStack Query |
|---|---|---|
| Kind of state | client/UI state you own | server state, a copy of the API's data |
| Where the data comes from | set by your code | fetched by a `queryFn` |
| Caching, stale data, refetching | none built in | built in |
| Example | theme, basket, sidebar open | products, orders, profile |

They are **not** interchangeable. They solve different problems and are often used together (B14 is **False**).

**In the exam (D4a), requirement by requirement:**

- **Selected theme available across components → Zustand.** It is client-side UI state that doesn't come from the server, and a global store with a selector shares it with no prop drilling.
- **Product info from an external API → TanStack Query** (`useQuery` with a `queryFn` that calls the API).
- **Product info cached → TanStack Query.** Its cache is keyed by `queryKey`.
- **Refresh after an update → TanStack Query**: `useMutation` with `invalidateQueries` in `onSuccess`.
- **Avoid unnecessary requests → TanStack Query**: `staleTime`, the shared cache and deduplication.
- In one line: Zustand holds what the browser owns, and TanStack Query holds the browser's copy of what the server owns.

Docs: [Zustand introduction](https://zustand.docs.pmnd.rs/getting-started/introduction), [Zustand on GitHub](https://github.com/pmndrs/zustand), [TanStack: does this replace client state?](https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state).

## 10. CSS

### grid-template-areas: a named layout (A9)

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  gap: 1rem;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

- Each string is one row, and each word is one column. Repeating a name makes that area span.
- Every row must have the same number of cells, and each area must be a rectangle. Use `.` for an empty cell.

**In the exam:** `grid-template-areas` names regions of the grid as strings, and each child is placed into one with `grid-area: name`.

### A media query: collapse to one column

```css
@media (max-width: 700px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
```

"Mobile first" is the reverse: write the one-column layout as the default, then add `@media (min-width: 700px) { ... }` for wider screens.

**In the exam:** a media query applies CSS only when a condition like `(max-width: 700px)` is true, which is how a layout adapts to screen size.

### minmax and repeat(auto-fit, ...) (B12)

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```

- `minmax(200px, 1fr)`: each **grid track** (column or row) is at least 200px and at most one share of the free space. It works only in grid track sizes.
- `repeat(auto-fit, ...)` fits as many columns as there is room for, so the grid is responsive with no media query.
- `auto-fit` collapses empty tracks so the cards stretch to fill the row, while `auto-fill` keeps the empty tracks.

**In the exam:** `minmax(min, max)` sets the minimum and maximum size of a grid track, and `repeat(auto-fit, minmax(200px, 1fr))` makes as many columns as fit.

### clamp vs calc vs var vs minmax (A16)

| Function | Does | Example |
|---|---|---|
| `clamp(min, preferred, max)` | a preferred value kept between a min and a max, for **any** property | `font-size: clamp(1rem, 2.5vw, 2rem);` |
| `minmax(min, max)` | a min and max for a **grid track** only | `grid-template-columns: minmax(150px, 1fr) 3fr;` |
| `calc(...)` | arithmetic, even mixing units | `width: calc(100% - 2rem);` |
| `var(--name)` | reads a custom property (a CSS variable) | `color: var(--brand);` after `:root { --brand: #3355ff; }` |

**In the exam (A16):** `clamp()` gives a property a preferred value while respecting a minimum and a maximum, as in `clamp(1rem, 2.5vw, 2rem)`.

### :focus-visible (A20)

```css
button:focus-visible,
a:focus-visible {
  outline: 3px solid var(--focus, #2563eb);
  outline-offset: 2px;
}
```

- `:focus` matches every focused element, including a button just clicked with the mouse.
- `:focus-visible` matches only when the browser decides a visible focus ring helps, mainly **keyboard** navigation (Tab). Mouse users don't get a ring on click, and keyboard users always see where they are.
- Never write `outline: none` without giving a replacement style. It breaks keyboard accessibility.

**In the exam:** `:focus-visible` styles an element when it has focus and a visible focus indicator is appropriate (typically keyboard navigation), which keeps the page accessible.

Docs: [MDN grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas), [MDN minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax), [MDN repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat), [MDN clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp), [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible), [MDN media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).

## 11. Front-end security

The golden rule: **everything in the browser is under the user's control.** The frontend is for user experience. The server enforces security.

### Authentication vs authorisation (E2)

| | Authentication (authN) | Authorisation (authZ) |
|---|---|---|
| Question | **Who are you?** | **What are you allowed to do?** |
| How | logging in (password, then a token) | roles and permissions checked per request |
| When | first | after the user is identified |
| Failure code | 401 | 403 |

**In the exam:** authentication identifies who a user is, and authorisation decides what that identified user is allowed to access.

### JWT structure and exp (B15)

A JWT (JSON Web Token) is three base64url parts joined by dots: `header.payload.signature`.

- **Header**: the algorithm, for example `{ "alg": "HS256", "typ": "JWT" }`.
- **Payload**: the claims, for example `{ "sub": "42", "role": "admin", "iat": 1764000000, "exp": 1764003600 }`.
- **Signature**: made by the server with a secret key. It lets the **server** detect tampering.
- The payload is **encoded, not encrypted.** Anyone can read it, so never put secrets in it.
- `exp` is the expiry time in **seconds** since 1 Jan 1970. `Date.now()` is in milliseconds, so multiply by 1000.

```ts
function isTokenExpired(token: string): boolean {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload.exp * 1000 < Date.now();
}
```

The frontend can read `exp` to **guess** whether the token has expired, but it cannot verify the signature (it has no secret). The server makes the final decision.

**In the exam:** a JWT is `header.payload.signature`, and the frontend can read the payload's `exp` claim to tell whether the token may have expired, but only the server can verify the token.

### Handling an expired token (E1)

When the token has expired (`exp` is past, or the API returns 401):

1. Treat the user as **logged out**: clear the token and the user from state and storage.
2. Send them to log in again (`navigate('/login', { replace: true })` or `<Navigate to="/login" replace />`), **or** run a token-refresh flow if the app has one.
3. Don't show protected content, and don't keep sending the dead token.

```tsx
function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  if (!token || isTokenExpired(token)) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

**In the exam (E1):** the frontend should handle the expired authentication state and require the user to sign in again or use a token-renewal flow, never keep treating them as authenticated.

### Hiding routes is not security (E3)

The `RequireAuth` guard above and hiding admin links by role are **user experience only**. A user can edit the JavaScript in DevTools, change the stored role, or call the API directly with `curl`. The **server** must check the token and the user's permissions on **every** request.

**In the exam (E3):** users can manipulate client-side code and requests, so the server must also enforce access permissions. Hiding pages in the frontend only improves the user experience.

### HTTPS (E4)

HTTPS (HTTP over TLS) **encrypts** the traffic between the browser and the server, so someone on the network (public Wi-Fi, for example) can't read or change passwords, tokens or data while they travel. It does **not** protect data once it is in the browser (XSS) or on the server.

**In the exam (E4):** True. HTTPS protects tokens and sensitive data while they travel between the browser and the server.

### Don't trust API data, and XSS (E5)

A successful response (200) only means the request worked. It says nothing about whether the data is safe or the right shape.

- **XSS (cross-site scripting)**: an attacker gets their own script to run on your page, for example through a product description containing `<img src=x onerror="steal()">`. That script can read anything JavaScript can read, including tokens in `localStorage`.
- React **escapes** values in `{...}`, so `<p>{product.description}</p>` shows the text and doesn't run it. Keep it that way.
- Avoid `dangerouslySetInnerHTML`. If you really must render HTML, sanitise it first (for example with DOMPurify).
- Check URLs from the API before putting them in `href`, because `javascript:` links run code.
- TypeScript types vanish at runtime. `const p: Product = await res.json()` **checks nothing**, so validate important fields (or use a schema library).

**In the exam (E5):** False. Data from an API must be treated as untrusted even if the request succeeded, so validate its shape and render it safely (React escaping, no unsanitised `dangerouslySetInnerHTML`) to avoid XSS.

### Token storage trade-offs

| Where | Survives a reload? | Readable by JavaScript (so stolen by XSS)? | Notes |
|---|---|---|---|
| `localStorage` | yes | **yes** | simple, but the most exposed to XSS |
| `sessionStorage` | the tab only | **yes** | cleared when the tab closes |
| Memory (React state / Zustand) | **no** | harder to reach | lost on refresh, so it needs a refresh flow |
| `httpOnly` + `Secure` + `SameSite` cookie | yes | **no** | set by the server and sent automatically; guard against CSRF (`SameSite`, CSRF tokens) |

Also: never put API secrets or keys in frontend code. The bundle is public, and anyone can read it.

**In the exam:** `localStorage` is convenient but readable by any script (an XSS risk), while an `httpOnly`, `Secure`, `SameSite` cookie can't be read by JavaScript. It's a trade-off, and the server still validates every request.

Docs: [MDN Web security](https://developer.mozilla.org/en-US/docs/Web/Security), [jwt.io introduction](https://jwt.io/introduction), [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [react.dev: dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html).

## 12. Traps the MCQs set

Read the whole question, then rule out the options that are about the wrong thing (CSS for a data question, databases for a React question). These are the traps that look plausible:

| Statement or option | Verdict | Why |
|---|---|---|
| "`find()` returns every element that matches" (B3) | **False** | `find` returns only the **first** match (or `undefined`). `filter` returns all matches. |
| "`sort()` returns a sorted copy" | **False** | `sort` mutates the original. Use `[...arr].sort()` or `toSorted()`. |
| "`slice` to total a basket" (A1) | **Wrong** | `slice` copies part of an array. Totals use `reduce`. |
| "`Promise.all` runs tasks one after another" / "cancels requests" (A7) | **Wrong** | It waits for them in parallel and fails fast. Sequential is `for...of` + `await`, and cancelling is `AbortController`. |
| "`fetch` rejects on a 404 or 500" | **False** | It only rejects on a network error or an abort. Check `res.ok`. |
| `string & number` for "a string or a number" (A14) | **Wrong** | `&` means "both at once", which is `never`. The answer is `string \| number`. |
| `string + number`, `string / number` as types | **Wrong** | These aren't TypeScript type syntax. |
| "`interface` is the keyword for a type alias" (A3) | **Wrong** | The alias keyword is `type`. |
| "An interface sends API requests or stores data" (A8) | **Wrong** | It only describes a shape at compile time, and it doesn't exist at runtime. |
| "TypeScript types check API data at runtime" | **False** | Types are erased. A typed `res.json()` checks nothing. |
| "Custom Hooks can be called inside an `if`" | **False** | The Rules of Hooks apply to custom Hooks too (B4 is **True**). |
| `useLocation()` / `useSearchParams()` to go to `/dashboard` (A2) | **Wrong** | Those read the URL. Navigating from code is `useNavigate()`. |
| `useNavigate()` / `useRef()` to read `42` from `/products/42` (A10) | **Wrong** | Path segments come from `useParams()`. Query strings come from `useSearchParams()`. |
| `<Navigate />`, `<Link />` or `<BrowserRouter />` renders child routes (A6) | **Wrong** | Child routes render in `<Outlet />`. `<Navigate>` redirects, and `<Link>` is a link. |
| "React Router reloads the page on every navigation" (B1) | **False** | A `<Link>` changes the URL with no full reload (B1 is **True**). |
| "One app can have only one layout" (B11) | **False** | Each route group can have its own layout route. |
| 401 "means you lack permission" (A5, B5) | **Wrong** | 401 means **not authenticated**. 403 means authenticated but **not permitted**. |
| 204 "means the server crashed" or "moved permanently" (A13) | **Wrong** | 204 is success with no body. A crash is 500, and "moved permanently" is 301. |
| "Only POST can update a resource" (B10) | **False** | PUT (replace) and PATCH (partial) update. B10 is **True**. |
| "Client-side validation guarantees that bad data never reaches the server" (B9) | **False** | Users can bypass the frontend. The server must validate. (It's still the A17 answer for stopping a bad submit.) |
| "Local storage only" as validation (A17) | **Wrong** | Storage doesn't validate anything. |
| "`staleTime` is how long the session or component lasts" (A11) | **Wrong** | It is how long cached data counts as fresh. |
| "`cacheTime` keeps unused data" | **Outdated** | Renamed `gcTime` in v5. |
| "`isLoading` means no data yet" | **Outdated** | In v5 that is `isPending`. `isLoading` = `isPending && isFetching`. |
| "`invalidateQueries` deletes the data or the endpoint, or stops requests" (A15) | **Wrong** | It marks the matching queries stale so they refetch. |
| "Zustand makes every component subscribe to the whole store" (B7) | **False** | Selectors subscribe to just a slice. |
| "Use `useState` / `useEffect` / `createContext` to read a Zustand store" (A12) | **Wrong** | You call the Hook that `create` returned: `useThemeStore((s) => s.theme)`. |
| "TanStack Query and Zustand are interchangeable" (B14) | **False** | TanStack handles server state (caching, refetching), and Zustand handles client state. |
| `calc()` or `var()` for "a preferred value with min and max" (A16) | **Wrong** | That's `clamp()`. `minmax()` is for grid tracks only. |
| "`:focus-visible` hides focus or blocks the keyboard" (A20) | **Wrong** | It shows a focus style when a visible indicator is appropriate. |
| "`minmax()` works on any property" | **False** | Only on grid track sizes (B12 is **True** for grid tracks). |
| "Authorisation happens before the user is identified" (E2) | **Wrong** | AuthN (who) comes first, then authZ (what). |
| "Hiding a page in React secures it" / "routing encrypts data" (E3) | **Wrong** | Only server checks enforce access. Routing encrypts nothing. |
| "A JWT payload is encrypted" | **False** | It is base64url-encoded and readable by anyone. The signature only proves it wasn't changed. |
| "Ignore `exp` and keep the user logged in" (E1) | **Wrong** | Handle the expiry: re-login or refresh the token. |
| "A successful request means the data is trustworthy" (E5) | **False** | Validate the data and render it safely (XSS). |
| "HTTPS protects tokens in `localStorage` from XSS" | **False** | HTTPS protects data in transit only. |

**In the exam:** when two options both sound right, pick the one that matches the exact verb in the question ("calculate a single value" means `reduce`, "navigate programmatically" means `useNavigate`, "named grid areas" means `grid-template-areas`, "preferred value with limits" means `clamp`).
