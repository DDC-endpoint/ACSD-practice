---
id: d09
module: ACSD
kind: drill
title: Zustand stores, actions and selectors
difficulty: 2
timeMinutes: 25
mock: [A12, B7, B14, D4]
tasks:
  - { name: "theme store: toggleTheme and setTheme with set()", tests: [1] }
  - { name: "ThemeToggle: read theme and toggleTheme with selectors", tests: [2, 3, 4] }
  - { name: "cart store: addItem, removeItem, clear (new arrays, no mutation)", tests: [5, 6] }
  - { name: "selectItemCount + CartBadge subscribing with it", tests: [7] }
---

# d09 · Zustand stores, actions and selectors

> **Exam link:** **A12** *"Which Zustand function is commonly used to access a particular piece of data from a store?"* (the store's generated Hook) · **B7** *"Zustand requires every component in an application to subscribe to the entire store"* (False) · **B14** *"TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses"* (False) · **D4** the shopping app: *"a. Identify which of the requirements should be handled using Zustand and which using TanStack Query"* and *"d. Explain one advantage of using a selector when accessing data from a Zustand store"* (parts b and c are in d08). You pick options in A/B and write 2–4 sentences in D4.

The lectures barely cover Zustand, so this lesson is your main source. Do d08 first if you can: part 1 below compares the two libraries.

## The idea

### 1. Client state vs server state: pick the right tool

| | **Client / UI state** → Zustand | **Server state** → TanStack Query |
|---|---|---|
| Where it really lives | in the browser, your app owns it | on a server, you hold a copy |
| Examples | theme, cart contents, menu open, selected tab | products, customers, orders from an API |
| Can go out of date? | no, you are the only one changing it | yes, someone else can change the server |
| Needs | a shared place to read and update it | fetching, caching, loading/error, refetching |

So in mock D4, **the theme (light/dark) → Zustand**: it's UI state that many components need, and no server is involved. **Fetching products, caching them, refreshing after an update and avoiding unnecessary requests → TanStack Query**: that's server state, and caching, `staleTime` and `invalidateQueries` are what TanStack Query is built for.

They are **not interchangeable** (B14 is False). Zustand has no fetching, caching or refetching. TanStack Query isn't meant for a theme toggle. Real apps use both side by side.

### 2. A store is a Hook

```ts
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,                                                  // state
  increment: () => set((state) => ({ count: state.count + 1 })), // action
}));
```

- `create` returns a **Hook**. That generated Hook (`useCounterStore`) is how components read the store. That's the A12 answer: not `useState`, not `useEffect`, not `createContext`.
- The state **and** the functions that change it (actions) live together in the store.
- Note the TypeScript shape: `create<State>()(...)`, with an extra `()` before the function.
- **No Provider.** Unlike React Context, you don't wrap the app in anything. Any component imports the Hook and uses it.

Docs: [Zustand introduction](https://zustand.docs.pmnd.rs/getting-started/introduction).

### 3. `set` merges, and never mutates

```ts
set({ theme: "dark" });                                  // new value doesn't depend on the old one
set((state) => ({ count: state.count + 1 }));            // new value DOES depend on the old one
set((state) => ({ items: [...state.items, newItem] }));  // arrays: always a NEW array
```

`set` **merges** the object you return into the state, so you only return the keys that change. Treat state as read-only: `state.items.push(x)` changes the old array in place, and components won't see a change. Use `[...]`, `map`, `filter`.

Docs: [Updating state](https://zustand.docs.pmnd.rs/guides/updating-state).

### 4. Selectors: subscribe to a slice, not the whole store

```tsx
const theme = useThemeStore((state) => state.theme);   // ✔ re-renders only when theme changes
const everything = useThemeStore();                     // ✘ re-renders on ANY change in the store
```

The function you pass is a **selector**. It picks the slice this component needs. After every `set`, Zustand runs the selector again and re-renders the component **only if the selected value changed**. So components don't have to subscribe to the entire store (B7 is False).

Selectors can also **derive** a value, so you don't store things you can work out:

```ts
const selectItemCount = (state: CartState) => state.items.reduce((sum, i) => sum + i.quantity, 0);
const count = useCartStore(selectItemCount);
```

Keep a selector returning **one** value, such as a string, number or function. A selector that builds a new object or array every time (`(s) => ({ a: s.a, b: s.b })`) looks "changed" on every run. Just call the Hook twice.

### 5. Outside React: `getState` and `setState`

```ts
useThemeStore.getState().theme;            // read without a component
useThemeStore.getState().toggleTheme();    // call an action
useThemeStore.setState({ menuOpen: true }); // write directly (tests use this to reset stores)
```

## Worked example

A different scenario: a notifications store for a header bell and a settings page.

```tsx
// useNotificationStore.ts
interface NotificationState {
  unread: number;
  muted: boolean;
  receive: () => void;
  markAllRead: () => void;
  toggleMuted: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unread: 0,                                                     // 1. starting state
  muted: false,
  receive: () => set((state) => ({ unread: state.unread + 1 })),  // 2. depends on old value: function form
  markAllRead: () => set({ unread: 0 }),                         // 3. doesn't: plain object
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
}));

// Bell.tsx
export function Bell() {
  const unread = useNotificationStore((state) => state.unread);            // 4. one slice
  const markAllRead = useNotificationStore((state) => state.markAllRead);  // 5. actions via selectors too
  return <button onClick={markAllRead}>Notifications: {unread}</button>;
}

// MuteSwitch.tsx
export function MuteSwitch() {
  const muted = useNotificationStore((state) => state.muted);
  const toggleMuted = useNotificationStore((state) => state.toggleMuted);
  return <label><input type="checkbox" checked={muted} onChange={toggleMuted} /> Mute</label>;
}
```

- No Provider anywhere: `Bell` and `MuteSwitch` both import the same Hook and share one store.
- When a notification arrives (`receive`), `unread` changes, so `Bell` re-renders and `MuteSwitch` **doesn't**, because its selected value (`muted`) didn't change. That is the selector advantage.
- Actions are just functions in the store, so they never change; selecting them never causes extra renders.

## Your task

The shop from mock **D4**: a theme switch and a cart badge.

1. Open `src/useThemeStore.ts`. Do **TODO d09-1**: write `toggleTheme` and `setTheme` with `set`.
2. Open `src/ThemeToggle.tsx`. Do **TODO d09-2**: read `theme` and `toggleTheme` with **two selectors**, and render the button. Test 4 fails if you use `useThemeStore()` with no selector.
3. Open `src/useCartStore.ts`. Do **TODO d09-3**: `addItem` (adds with quantity 1, or bumps the quantity), `removeItem`, `clear`. Always return new arrays.
4. Still in `useCartStore.ts` and then `src/CartBadge.tsx`: do **TODO d09-4**: `selectItemCount` (total quantity, using `reduce`), and use it as the badge's selector.
5. Run `npm test -- d09` until all 7 tests are green.
6. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write on paper:
   - the whole theme store (`create<ThemeState>()((set) => ({ ... }))`)
   - one component line that reads `theme` with a selector
   - the D4a and D4d answers (see the viva questions)

## Hints

<details><summary>Hint 1: where do I start?</summary>

Replace the throwing `toggleTheme` with:

```ts
toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
```

`setTheme` takes the theme as a parameter: `setTheme: (theme) => set({ theme })`.
</details>

<details><summary>Hint 2: test 4 says ThemeToggle re-rendered when menuOpen changed</summary>

You subscribed to the whole store, probably with `const { theme, toggleTheme } = useThemeStore();`. Use one selector per value: `useThemeStore((state) => state.theme)` and `useThemeStore((state) => state.toggleTheme)`.
</details>

<details><summary>Hint 3: addItem with an existing item</summary>

Check first with `state.items.find((i) => i.id === product.id)`. If it exists, return `{ items: state.items.map(...) }`, copying the matching item with `{ ...i, quantity: i.quantity + 1 }` and leaving the others as they are. Otherwise return `{ items: [...state.items, { ...product, quantity: 1 }] }`.
</details>

<details><summary>Hint 4: the badge shows the wrong number</summary>

The count is the sum of the **quantities**, not `items.length`: two kettles and a toaster is 3, but there are only 2 items. `state.items.reduce((sum, i) => sum + i.quantity, 0)`. Don't forget the `0` start value.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Which Zustand function is commonly used to access a particular piece of data from a store? (A12)</summary>

**The store's generated Hook**: the Hook that `create` returns, such as `useThemeStore`, called with a selector: `useThemeStore((state) => state.theme)`. Not `useState` (local component state), not `useEffect` (side effects) and not `createContext` (that's React Context, which Zustand doesn't need).
</details>

<details><summary>True or false: "Zustand requires every component in an application to subscribe to the entire store." (B7)</summary>

**False.** A component passes a selector to the store's Hook, for example `useThemeStore((s) => s.theme)`, and subscribes only to that slice. It re-renders only when that selected value changes.
</details>

<details><summary>True or false: "TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses." (B14)</summary>

**False**, twice over. They do different jobs: TanStack Query manages server state (fetching, caching, refetching), and Zustand manages client/UI state (theme, cart, open menus). And Zustand is not for server responses at all; it has no fetching or caching.
</details>

<details><summary>D4a: Which requirements should be handled with Zustand and which with TanStack Query? Explain.</summary>

**Zustand:** the selected theme (light/dark). It's client-side UI state that the app owns and that several components need, so a small global store with a Hook fits, and no server is involved.

**TanStack Query:** retrieving product information from the API, caching it, refreshing it after a product is updated, and avoiding unnecessary requests. That's server state: TanStack Query caches results by query key, uses `staleTime` to avoid refetching fresh data, and `invalidateQueries` to refetch after an update.
</details>

<details><summary>D4d: Explain one advantage of using a selector when accessing data from a Zustand store.</summary>

A selector such as `useThemeStore((state) => state.theme)` subscribes the component to only that slice of the store, so it re-renders only when the theme changes, not when unrelated state (like the cart) changes. This gives fewer unnecessary re-renders and better performance, and the component reads only the data it needs, which keeps it simpler.
</details>

<details><summary>Do you need a Provider for Zustand like you do for React Context or TanStack Query?</summary>

No. The store lives in a module, and any component that imports the Hook can use it. TanStack Query does need `<QueryClientProvider client={queryClient}>` around the app, and React Context needs its `<Context.Provider>`. That's a common MCQ distractor.
</details>
