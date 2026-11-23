---
id: d03
module: ACSD
kind: drill
title: React state and conditional rendering
difficulty: 1
timeMinutes: 25
mock: [A4]
tasks:
  - { name: "ModuleList: early return when empty, .map with a stable key", tests: [1, 2] }
  - { name: "CoursePage: useState for the tab, loading/not-found early returns, tab buttons, && panels", tests: [3, 4, 5] }
  - { name: "Reviews tab: ternary for list vs 'No reviews yet.'", tests: [6] }
  - { name: "LikeButton: onClick + functional update setLikes(l => l + 1)", tests: [7, 8] }
---

# d03 · React state and conditional rendering

> **Exam link:** **A4** asks: *"A React application needs to display different content depending on whether a user has selected a particular tab. Which programming technique is most appropriate?"* The answer is **conditional rendering**. The skills here are also the base of every Section D answer you write in a text box. **D2b** (*"Display a loading message… Display an error message… Display the number of courses"*) is `useState` plus early returns, and **D1c** is a small component that takes data and renders it.

## The idea

### 1. A component is a function that takes typed props

```tsx
interface Props {
  name: string;
  online: boolean;
}

function UserBadge({ name, online }: Props) {   // destructure the props object
  return <span>{name}{online ? " (online)" : ""}</span>;
}

<UserBadge name="Ana" online={true} />          // strings in quotes, everything else in { }
```

`Props` is a normal TypeScript `interface`. If you forget a prop or pass the wrong type, TS complains before the code runs. See [react.dev: Passing props](https://react.dev/learn/passing-props-to-a-component).

### 2. `useState`: memory that survives a re-render

```tsx
const [tab, setTab] = useState<TabId>("overview");
//     value  setter          type     starting value
```

A normal `let` variable resets every time the component runs. State doesn't. Calling the **setter** stores the new value **and** makes React re-render the component with it. Never assign the value directly (`tab = "modules"` does nothing useful). See [react.dev: State](https://react.dev/learn/state-a-components-memory).

### 3. Conditional rendering: three forms

```tsx
// a) && : "show this, or nothing"
{isAdmin && <button>Delete</button>}

// b) ternary ? : : "show this OR that"
{items.length > 0 ? <List items={items} /> : <p>Nothing here.</p>}

// c) early return: "the whole component is different in this case"
if (loading) return <p>Loading…</p>;
return <Dashboard />;
```

Use `&&` when the other case is *nothing*, a ternary when there are *two* outcomes, and an early return for loading, error or empty states that replace everything. A tab UI is just state plus `&&`: `{tab === "reviews" && <Reviews />}`. See [react.dev: Conditional rendering](https://react.dev/learn/conditional-rendering).

Trap: `{count && <p>{count} items</p>}` renders a **0** on screen when `count` is 0. Use `{count > 0 && ...}`.

### 4. Lists: `.map` plus a stable `key`

```tsx
<ul>
  {students.map((s) => (
    <li key={s.id}>{s.name}</li>
  ))}
</ul>
```

The `key` lets React tell items apart between renders. Use something **unique and stable** from the data (an id or a code). The array index is a poor key if the list can be reordered or filtered. See [react.dev: Rendering lists](https://react.dev/learn/rendering-lists).

### 5. Events and the functional update

```tsx
<button onClick={() => setCount(count + 1)}>+1</button>      // pass a FUNCTION, don't call it
<button onClick={setCount(count + 1)}>+1</button>            // ✘ runs during render: infinite loop
```

React **batches** setter calls in one handler and only re-renders afterwards. Inside that handler, `count` is a snapshot that doesn't change:

```tsx
setCount(count + 1);
setCount(count + 1);       // ✘ both read the same old count: +1 in total

setCount((c) => c + 1);
setCount((c) => c + 1);    // ✔ each gets the latest value: +2 in total
```

When the new value depends on the old one, pass a function. See [react.dev: Queueing state updates](https://react.dev/learn/queueing-a-series-of-state-updates).

## Worked example

A different scenario: a login panel that shows a different message for each state.

```tsx
import { useState } from "react";

interface Props {
  userName: string | null;       // null = not logged in
  checking: boolean;             // true while we ask the server
}

export function WelcomePanel({ userName, checking }: Props) {
  const [showTips, setShowTips] = useState(false);                // 1

  if (checking) return <p>Checking your session…</p>;              // 2

  return (
    <div>
      {userName ? <h2>Hi, {userName}</h2> : <h2>Please log in</h2>} {/* 3 */}
      <button onClick={() => setShowTips((s) => !s)}>              {/* 4 */}
        {showTips ? "Hide tips" : "Show tips"}
      </button>
      {showTips && (                                               // 5
        <ul>
          {["Use a strong password", "Log out on shared PCs"].map((tip) => (
            <li key={tip}>{tip}</li>                               // 6
          ))}
        </ul>
      )}
    </div>
  );
}
```

1. The Hook comes **first**, before any `return`. Hooks must run in the same order on every render (more in d04).
2. An early return: while checking, nothing else on the panel makes sense.
3. A ternary: there are exactly two outcomes.
4. The handler is an arrow function, and the update flips the **previous** value.
5. `&&`: the tips are either shown or nothing.
6. The tip text is unique and never reorders, so it works as a key here.

## Your task

A course page with three tabs: **Overview**, **Modules** and **Reviews**. The types and the `TABS` array are given in `src/types.ts`.

1. Do the TODOs in order:
   - **TODO d03-1** in `src/ModuleList.tsx`: an early return for an empty list, then `.map` with `key={m.code}`. (Tests 1–2)
   - **TODO d03-2** in `src/CoursePage.tsx`: `useState` for the tab, the loading and not-found early returns, one button per tab, and the Overview and Modules panels with `&&`. (Tests 3–5)
   - **TODO d03-3** in `src/CoursePage.tsx`: the Reviews panel, with a ternary for "reviews or `No reviews yet.`". (Test 6)
   - **TODO d03-4** in `src/LikeButton.tsx`: a Like button and a +2 button. (Tests 7–8)
2. Run `npm test -- d03` until it's green.
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write `CoursePage` on paper: the `useState` line, both early returns, the `TABS.map` buttons and the three panels. Check that every `.map` has a `key` and every `onClick` gets a function.

## Hints

<details><summary>Hint 1: where do I start?</summary>

`ModuleList` is the smallest piece. Get test 2 green first with just the early return:
```tsx
if (modules.length === 0) return <p>No modules yet.</p>;
```
Then return the `<ul>` with `modules.map(...)` for test 1.
</details>

<details><summary>Hint 2: "React Hook useState is called conditionally" or "Rendered more hooks than during the previous render"</summary>

Your `useState` line is below an `if (...) return`. On a loading render the Hook isn't reached, and on the next render it is, so React's Hook order changes. Move `useState` to the very top of the component, above the early returns.
</details>

<details><summary>Hint 3: test 5 fails: clicking a tab does nothing</summary>

- Check that `onClick` gets a **function**: `onClick={() => setTab(t.id)}`, not `onClick={setTab(t.id)}`.
- Check each panel compares against the right id: `"modules"`, not `"Modules"` (that's the label).
</details>

<details><summary>Hint 4: test 8 fails: +2 only adds 1</summary>

You wrote `setLikes(likes + 1)` twice. Both calls read the same `likes` from this render. Use `setLikes((l) => l + 1)` twice.
</details>

<details><summary>Hint 5: the panels (nearly the answer)</summary>

```tsx
{tab === "overview" && <p>{course.description}</p>}
{tab === "modules" && <ModuleList modules={course.modules} />}
{tab === "reviews" &&
  (course.reviews.length > 0 ? (
    <ul>{course.reviews.map((r) => <li key={r.id}>{r.author}: {r.text}</li>)}</ul>
  ) : (
    <p>No reviews yet.</p>
  ))}
```
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>A page must show different content depending on which tab is selected. What technique is this, and how do you write it?</summary>

Conditional rendering. Keep the selected tab in state, `const [tab, setTab] = useState("overview")`, and render each panel only when it matches: `{tab === "modules" && <ModuleList />}`. Clicking a tab button calls `setTab(...)`, which re-renders the component with the new tab.
</details>

<details><summary>When would you use <code>&&</code>, a ternary, or an early return?</summary>

`&&` when the alternative is to show nothing (`{error && <p>{error}</p>}`). A ternary when there are two alternatives (`{ok ? <List /> : <p>Empty</p>}`). An early return when one state replaces the whole component, like `if (loading) return <p>Loading…</p>;`.
</details>

<details><summary>Why does a list rendered with <code>.map</code> need a <code>key</code>, and what should it be?</summary>

The key lets React match each item to the same item in the previous render, so it updates, adds or removes the right DOM elements and keeps the right state with each item. It should be unique among siblings and stable, like a database id. The array index is a poor choice if the list can be reordered, filtered or added to in the middle.
</details>

<details><summary>What's the output after one click? <code>onClick={() => { setCount(count + 1); setCount(count + 1); }}</code>, with <code>count</code> starting at 0.</summary>

1, not 2. React batches both updates, and both read the same snapshot `count = 0`, so both set it to 1. Writing `setCount(c => c + 1)` twice gives 2, because each update receives the latest pending value.
</details>

<details><summary>True or False: changing a normal variable (<code>let open = true</code>) inside a component re-renders it.</summary>

False. Only calling a state setter (or new props from the parent) triggers a re-render. A normal variable is also reset to its starting value every time the component function runs, so it can't remember anything between renders.
</details>

<details><summary>What's wrong with <code>&lt;button onClick={setTab("reviews")}&gt;</code>?</summary>

It **calls** `setTab` while rendering instead of passing a function to run on click. That sets state during render, which re-renders, which calls it again, so React stops with "Too many re-renders". Write `onClick={() => setTab("reviews")}`.
</details>
