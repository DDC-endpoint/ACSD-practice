---
id: d04
module: ACSD
kind: drill
title: Custom Hooks and the Rules of Hooks
difficulty: 2
timeMinutes: 25
mock: [B4]
tasks:
  - { name: "useToggle(initial) returns [value, toggle]", tests: [1, 2] }
  - { name: "useCounter with min/max limits and reset", tests: [3, 4, 5] }
  - { name: "useLocalStorage(key, initial): lazy read + save in useEffect", tests: [6, 7] }
  - { name: "FaqItem component uses useToggle", tests: [8] }
---

# d04 · Custom Hooks and the Rules of Hooks

> **Exam link:** **B4** (True/False): *"A React custom Hook must follow the Rules of Hooks, including being called at the top level of a component or another custom Hook."* The answer is **True**. **D2b** also says *"Write a React component or custom Hook that implements the requirements above"*, so a custom Hook is an accepted way to answer a 6-mark question. Expect to name the rules, spot a broken one in a snippet, and write a small Hook in a text box.

## The idea

### 1. A custom Hook is a function whose name starts with `use` and that calls other Hooks

```ts
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

const [open, toggle] = useToggle();    // used like useState
```

It's how you pull **stateful logic** out of a component so several components can reuse it. A Hook can return anything: a value, a tuple like `useState`, or an object (`{ count, increment }`). See [react.dev: Reusing logic with custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).

A tuple's return type needs to be spelled out (`[boolean, () => void]`, or `return [value, toggle] as const`). Otherwise TS infers `(boolean | (() => void))[]`, and `toggle()` won't type-check.

### 2. The Rules of Hooks

See [react.dev: Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

1. **Only call Hooks at the top level.** Never inside an `if`, a loop, a nested function, or after an early `return`.
2. **Only call Hooks from React functions:** a function component or another custom Hook. Never from a plain helper function, an event handler or a class.
3. **Name custom Hooks `useSomething`.** The `use` prefix tells React and the linter that the rules apply to it.

```tsx
function Profile({ id }: { id?: number }) {
  if (!id) return <p>No user</p>;
  const [user, setUser] = useState(null);   // ✘ after an early return: sometimes runs, sometimes not
  ...
}

function Profile({ id }: { id?: number }) {
  const [user, setUser] = useState(null);   // ✔ Hooks first
  if (!id) return <p>No user</p>;
  ...
}
```

### 3. Why: React matches Hooks by call order

React doesn't know your state's *names*. It stores each component's Hook values in a list: the 1st `useState` call gets slot 1, the 2nd gets slot 2, and so on. On the next render it hands the slots back **in the same order**. If an `if` skips a Hook on one render, every Hook after it gets the wrong slot's value. Calling Hooks unconditionally, in the same order on every render, is what keeps that list lined up.

To make a Hook's *effect* conditional, put the condition **inside** it:

```ts
useEffect(() => {
  if (!id) return;          // ✔ the condition goes inside the Hook
  loadUser(id);
}, [id]);
```

### 4. Each call gets its own state

```tsx
<FaqItem />   {/* its own useToggle -> its own `open` */}
<FaqItem />   {/* a separate `open`; opening one doesn't open the other */}
```

A custom Hook shares **logic**, not **state**. Every component that calls `useToggle` gets a brand-new `useState` inside it. If two components need the **same** data (a cart, a logged-in user), a custom Hook alone won't do it. You lift the state up to a parent, use Context, or use a store like **Zustand**, where every component reads one shared store (see `../d09-zustand/LESSON.md`).

### 5. Testing a Hook: `renderHook` + `act`

```ts
const { result } = renderHook(() => useToggle(false));
act(() => result.current[1]());          // anything that sets state goes inside act()
expect(result.current[0]).toBe(true);    // result.current is the LATEST return value
```

`renderHook` mounts a tiny test component that calls your Hook. See [Testing Library: renderHook](https://testing-library.com/docs/react-testing-library/api/#renderhook).

## Worked example

A different Hook: `useInput`, for a text box in a form.

```tsx
import { useState, type ChangeEvent } from "react";

export function useInput(initial = "") {                          // 1
  const [value, setValue] = useState(initial);                    // 2

  function onChange(e: ChangeEvent<HTMLInputElement>) {           // 3
    setValue(e.target.value);
  }

  return { value, onChange, reset: () => setValue(initial) };     // 4
}

function SignUp() {
  const email = useInput();                                       // 5
  const name = useInput("Guest");                                 // 6
  return (
    <form>
      <input value={name.value} onChange={name.onChange} />       {/* 7 */}
      <input value={email.value} onChange={email.onChange} />
      <button type="button" onClick={() => { email.reset(); name.reset(); }}>Clear</button>
    </form>
  );
}
```

1. The name starts with `use`, because it calls a Hook.
2. Called at the top level of the custom Hook: allowed.
3. A plain function **inside** the Hook. It doesn't call a Hook, it only calls the setter, which is fine.
4. It returns an object, so callers pick fields by name.
5. and 6. Two calls give **two separate** states, so typing in one box doesn't change the other.
7. Each input is wired to its own Hook result. The component stays short, because the state logic lives in `useInput`.

## Your task

1. Do the TODOs in order:
   - **TODO d04-1** in `src/useToggle.ts`: return `[value, toggle]`. (Tests 1–2)
   - **TODO d04-2** in `src/useCounter.ts`: `count`, `increment`, `decrement` and `reset`, kept between `min` and `max`. (Tests 3–5)
   - **TODO d04-3** in `src/useLocalStorage.ts`: like `useState`, but it reads its starting value from `localStorage` and saves every change. (Tests 6–7)
   - **TODO d04-4** in `src/FaqItem.tsx`: use **your** `useToggle` to show and hide an answer. (Test 8)
2. Run `npm test -- d04` until it's green.
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write `useToggle` and `useCounter` on paper. Then write the three Rules of Hooks and one sentence on *why* the order matters.

## Hints

<details><summary>Hint 1: where do I start?</summary>

`useToggle` is four lines: a `useState(initial)`, a `toggle` function that calls the setter, and `return [value, toggle];`. Get tests 1 and 2 green, then copy the pattern for `useCounter`.
</details>

<details><summary>Hint 2: test 2 or test 4 fails when the setter is called several times in one act()</summary>

You used the value from this render (`setValue(!value)` or `setCount(count + 1)`). React batches those calls, and they all read the same old value. Use the functional form: `setValue((v) => !v)`, `setCount((c) => Math.min(c + 1, max))`.
</details>

<details><summary>Hint 3: how do I clamp to min and max?</summary>

`Math.min(c + 1, max)` never goes above `max`. `Math.max(c - 1, min)` never goes below `min`. The defaults `-Infinity` and `Infinity` mean "no limit", so you don't need an `if`.
</details>

<details><summary>Hint 4: useLocalStorage (nearly the answer)</summary>

```ts
const [value, setValue] = useState<T>(() => {
  const stored = localStorage.getItem(key);
  return stored !== null ? (JSON.parse(stored) as T) : initial;
});
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value));
}, [key, value]);
return [value, setValue];
```
Passing a **function** to `useState` (a lazy initialiser) means `localStorage` is only read on the first render, not on every render. `localStorage` only stores strings, which is why you need `JSON.stringify` and `JSON.parse`. See [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
</details>

<details><summary>Hint 5: test 8 fails: both answers open at once, or none do</summary>

Each `FaqItem` must call `useToggle` itself. Don't keep `open` in a variable outside the component. Render the answer with `{open && <p>{answer}</p>}`, and pick the label with a ternary: `{open ? "Hide answer" : "Show answer"}`.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>True or False: a React custom Hook must follow the Rules of Hooks, including being called at the top level of a component or another custom Hook.</summary>

**True.** A custom Hook calls built-in Hooks, so the same rules apply to it: call it only at the top level (not in a condition, loop or nested function), and only from a function component or another custom Hook.
</details>

<details><summary>State the Rules of Hooks and explain why they exist.</summary>

1) Only call Hooks at the top level: never inside conditions, loops, nested functions or after an early return. 2) Only call them from function components or custom Hooks. 3) Custom Hook names start with `use`. They exist because React identifies each Hook by the **order** it's called in on each render. If a Hook is skipped on one render, the later Hooks get another Hook's state.
</details>

<details><summary>Spot the rule violation and fix it.
<pre><code>function OrderList({ userId }: { userId: number | null }) {
  if (userId === null) {
    return &lt;p&gt;Please log in&lt;/p&gt;;
  }
  const [orders, setOrders] = useState&lt;Order[]&gt;([]);
  useEffect(() =&gt; { fetchOrders(userId).then(setOrders); }, [userId]);
  return &lt;ul&gt;{orders.map(o =&gt; &lt;li key={o.id}&gt;{o.item}&lt;/li&gt;)}&lt;/ul&gt;;
}</code></pre></summary>

`useState` and `useEffect` are called **after an early return**, so they run only when `userId` isn't null. That breaks "only call Hooks at the top level", and React throws "Rendered more hooks than during the previous render" when the user logs in. Fix: move both Hooks above the `if`, and put the condition inside the effect:

```tsx
const [orders, setOrders] = useState<Order[]>([]);
useEffect(() => {
  if (userId === null) return;
  fetchOrders(userId).then(setOrders);
}, [userId]);
if (userId === null) return <p>Please log in</p>;
```
</details>

<details><summary>Two components both call <code>useCounter()</code>. One increments. Does the other change?</summary>

No. Each call to a custom Hook creates its own state, because the `useState` inside it runs separately for each component. A custom Hook shares logic, not data. To share the same value you'd lift the state up to a common parent, use Context, or use a global store like Zustand.
</details>

<details><summary>Is <code>function getUser() { const [u] = useState(null); return u; }</code> a valid custom Hook?</summary>

No. It calls a Hook, but its name doesn't start with `use`, so React and the linter treat it as a normal function and can't check the rules. Rename it to `useUser` and call it only from components or other Hooks.
</details>

<details><summary>Why can't you call a Hook inside an <code>onClick</code> handler?</summary>

An event handler is a nested function that runs later, maybe never, maybe many times. It isn't part of the render, so a Hook inside it wouldn't run in the same order on every render. Call the Hook at the top of the component and use its result (for example a setter) inside the handler.
</details>
