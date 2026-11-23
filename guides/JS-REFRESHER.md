---
id: js-refresher
module: ACSD
kind: guide
title: JavaScript refresher (start here)
---

# JavaScript refresher (start here)

You are starting JavaScript tonight, and the ICT (Wed 25 Nov 2026) is React + TypeScript. React code is just JavaScript with a few extra rules, so this page covers only the JavaScript you will actually meet in React code, in the order the four drills use it (j01 to j04).

How to use it:

- This is a **look-it-up** page, not a lesson. Do the drill first, and come back here when a piece of syntax confuses you.
- Each idea has a short snippet, a line or two of explanation, a bold **In the exam:** line (only where the test could really ask about it) and an **In React:** line showing where you will see the same syntax in React code.
- The events in the snippets (`id`, `title`, `date`, `capacity`, `booked`) are the CampusEvents app from the module.
- The real test has no editor and no autocomplete, so after each section, try typing the snippets from memory.

## 1. How to try code

You do not need to install anything.

- **Browser console:** open any page, press **F12**, click **Console**, paste a line and press Enter. Press Shift+Enter to type several lines before running.
- **Node:** open a terminal, type `node`, and paste code at the `>` prompt. Press Ctrl+C twice to leave. To run a file, use `node file.js`.
- **`console.log(value)`** prints a value. Use it all the time: when you are unsure what something is, log it.

```js
console.log("hello");              // hello
console.log({ id: 1, title: "Quiz night" }); // prints the object
console.log("booked:", 12, true);  // you can pass several values
```

In the console and in `node`, the last expression's value prints by itself, so `2 + 2` shows `4` without `console.log`.

**In React:** `console.log` is how you check props and state while building. Open the console on the running app (F12) and the logs appear there.

More: [console.log on MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/log_static)

## 2. Basics (j01)

### let and const

```js
const title = "Quiz night";   // const: this name can't be pointed at something else
let booked = 12;              // let: this name can change
booked = booked + 1;          // 13
booked += 1;                  // 14, the short form
// title = "Other";           // TypeError: assignment to constant variable
```

Use `const` by default and `let` only when you will reassign. Don't use `var`; it is the old way and behaves oddly.

**In the exam:** the code you read will be almost all `const`. If you see `let`, the value is reassigned somewhere.

**In React:** `const [count, setCount] = useState(0);` is a `const` too. You never reassign state; you call the setter.

More: [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

### Types and typeof

```js
typeof "hi"         // "string"
typeof 42           // "number" (whole numbers and decimals are both number)
typeof true         // "boolean"
typeof undefined    // "undefined" (a name with no value yet)
typeof null         // "object" (a famous bug; null means "deliberately empty")
typeof [1, 2]       // "object" (arrays are objects; check with Array.isArray)
typeof { id: 1 }    // "object"
typeof (() => 1)    // "function"
Array.isArray([1, 2]) // true
```

Strings use `"double"`, `'single'` or `` `backticks` ``. They all make a string. Backticks add template strings (section 3).

**In the exam:** `typeof null` is `"object"` and `typeof []` is `"object"`. TypeScript's `typeof` in a type position is different (d02).

**In React:** you rarely call `typeof`, but you will see `undefined` a lot: data that has not loaded yet is `undefined`.

More: [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

### === vs ==

```js
5 === 5       // true
5 === "5"     // false (different types)
5 == "5"      // true (== converts types first: avoid it)
null == undefined   // true (the one case people use ==, but skip it)
5 !== "5"     // true
```

Always use `===` and `!==`. They never convert types, so the result is the one you expect.

**In the exam:** `==` converts types and `===` does not. Pick `===` in your own code.

**In React:** `event.id === selectedId`, `status === "loading"`. Always triple.

More: [Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)

### Truthy and falsy

Anywhere JS wants true/false (an `if`, `&&`, `||`, `!`), it converts the value. These are **falsy**: `false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`. **Everything else is truthy**, including `"0"`, `[]` and `{}`.

```js
if ("") console.log("never runs");
if ([]) console.log("runs: an empty array is truthy");
const events = [];
if (events.length) console.log("has events");   // length 0 is falsy
!!"hello"   // true, "!!" turns any value into a real boolean
```

**In the exam:** `[]` and `{}` are truthy. `0`, `""`, `null` and `undefined` are falsy.

**In React:** `{events.length && <List />}` has a trap: when `length` is `0`, React prints the `0` on screen. Write `{events.length > 0 && <List />}` instead.

More: [Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

### if/else and the ternary

```js
const open = booked < capacity;
if (open) {
  console.log("Spaces left");
} else if (booked === capacity) {
  console.log("Full");
} else {
  console.log("Overbooked");
}

const label = open ? "Open" : "Full";   // condition ? ifTrue : ifFalse
```

The ternary is an `if/else` that gives back a value, so you can use it inside other expressions.

**In the exam:** a ternary is how a React component chooses between two bits of output.

**In React:** `{isLoading ? <p>Loading...</p> : <List />}`. You cannot write an `if` statement inside JSX, but you can write a ternary or `&&`.

More: [Conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)

### Loops: for and for...of

```js
const titles = ["Quiz night", "Hack day", "Careers fair"];

for (let i = 0; i < titles.length; i++) {   // classic: start; keep going while; step
  console.log(i, titles[i]);
}

for (const title of titles) {               // for...of: each item, no index needed
  console.log(title);
}
```

Use `for...of` for the items of an array. (`for...in` loops over keys and is a trap with arrays; skip it.)

**In the exam:** the test is far more likely to use array methods (`map`, `filter`, `reduce`; d01) than loops, but you must be able to read both.

**In React:** React code mostly uses `.map(...)` inside JSX instead of a loop. A `for...of` with `await` inside shows up when requests must run one after another.

More: [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

### Functions and return

```js
function seatsLeft(event) {
  return event.capacity - event.booked;
}

seatsLeft({ capacity: 50, booked: 42 });   // 8
```

A function with no `return` gives back `undefined`. `return` also stops the function straight away, so code after it never runs.

```js
function noReturn(event) {
  event.capacity - event.booked;   // computed, then thrown away
}
noReturn({ capacity: 5, booked: 1 }); // undefined
```

**In the exam:** a function with no `return` returns `undefined`. Look for the missing `return` first when "it gives undefined".

**In React:** a component is a function that returns JSX. Forget the `return` and the component renders nothing.

More: [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## 3. Objects and arrays (j02)

### Literals, dot and bracket

```js
const event = { id: 7, title: "Hack day", capacity: 40, booked: 12 };
const tags = ["tech", "free"];

event.title            // "Hack day" (dot: you know the name)
event["title"]         // "Hack day" (bracket: the name is a string)
const key = "capacity";
event[key]             // 40 (bracket with a variable)
tags[0]                // "tech" (arrays count from 0)
tags.length            // 2
tags[tags.length - 1]  // "free" (the last item)
event.venue            // undefined (no such key: no error)
```

**In the exam:** a missing key gives `undefined`, not an error. Reading a key *of* `undefined` is the error (see `?.` below).

**In React:** `event.title` inside JSX, and `` `/api/events/${id}` `` in fetch URLs. Computed keys like `{ [name]: value }` appear in form handlers (d07).

More: [Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

### Destructuring

Destructuring pulls values out of an object or array into their own names.

```js
const event = { id: 7, title: "Hack day", capacity: 40, booked: 12 };

const { title, capacity } = event;          // object: match by NAME, order doesn't matter
const { title: name } = event;              // rename: use title's value as "name"
const { venue = "TBC" } = event;            // default: used when the value is undefined

const [first, second] = ["tech", "free"];   // array: match by POSITION
const [, onlySecond] = ["tech", "free"];    // skip the first with an empty slot

function describe({ title, booked }) {      // in a parameter: take the object apart
  return `${title}: ${booked}`;
}
```

Object destructuring uses `{ }` and names. Array destructuring uses `[ ]` and positions.

**In the exam:** `const [count, setCount] = useState(0)` is **array** destructuring, and `function Card({ title })` is **object** destructuring of props.

**In React:** both of those, every file. Also `const { id } = useParams();` and `const { data, isPending } = useQuery(...)`.

More: [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)

### Spread: copy and change

`...` copies the contents of an object or array into a new one. Put your changes after it, and they win.

```js
const event = { id: 7, title: "Hack day", booked: 12 };

const updated = { ...event, booked: 13 };     // new object, booked changed
// event.booked is still 12

const more = ["tech", "free"];
const added = [...more, "new"];               // new array with one more
const removed = more.filter((t) => t !== "free");  // new array without "free"
```

This is a **shallow** copy: nested objects inside are still shared.

**Why React needs this:** React decides to re-render by checking whether state is a *new* object. If you change the old object (`event.booked = 13`) and set it back, React sees the same object and does nothing.

**In the exam:** never mutate state (`push`, `event.booked++`, `sort`). Make a new value with spread, `map` or `filter`, then call the setter.

**In React:** `setEvents([...events, newEvent])`, `setForm({ ...form, title: value })`, `setEvents(events.map((e) => e.id === id ? { ...e, booked: e.booked + 1 } : e))`.

More: [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

### Rest

The same `...` on the **receiving** side gathers "the rest" into one name.

```js
const { id, ...others } = { id: 7, title: "Hack day", booked: 12 };
// id = 7, others = { title: "Hack day", booked: 12 }

const [head, ...tail] = [1, 2, 3];   // head = 1, tail = [2, 3]

function total(...nums) {            // nums is an array of all the arguments
  return nums.reduce((sum, n) => sum + n, 0);
}
total(1, 2, 3);  // 6
```

Rule of thumb: `...` in a **new** value being built is spread; `...` on the left of `=` or in a parameter list is rest.

**In React:** `function Button({ label, ...rest }) { return <button {...rest}>{label}</button>; }` passes every other prop through.

More: [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

### Template literals

```js
const event = { title: "Hack day", booked: 12, capacity: 40 };
const text = `${event.title} has ${event.capacity - event.booked} spaces`;
// "Hack day has 28 spaces"
const url = `/api/events/${event.id}`;
```

Backticks let you put any expression inside `${ }`. Use them for messages and URLs instead of `+`.

**In React:** `` fetch(`/api/events/${id}`) `` and `` className={`card ${open ? "open" : ""}`} ``.

More: [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

### Optional chaining `?.` and `??` vs `||`

```js
const event = { title: "Hack day" };

event.venue.name          // TypeError: venue is undefined
event.venue?.name         // undefined (stops quietly if venue is null/undefined)
event.venue?.name ?? "TBC" // "TBC"

0 || 10          // 10 (|| replaces ANY falsy value, including 0)
0 ?? 10          // 0  (?? replaces only null and undefined)
"" || "none"     // "none"
"" ?? "none"     // ""
```

Use `??` when `0`, `""` or `false` are real values (such as `booked` being `0`).

**In the exam:** `??` only replaces `null` or `undefined`, while `||` replaces every falsy value.

**In React:** `data?.events` before the data has loaded, `user?.name ?? "Guest"`, and `array?.[0]`. `onClick?.()` calls a function only if it exists.

More: [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), [Nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## 4. Functions and modules (j03)

### Arrow functions

```js
function seatsLeft(e) { return e.capacity - e.booked; }  // normal

const seatsLeft2 = (e) => {                 // arrow, with a body: you must write return
  return e.capacity - e.booked;
};
const seatsLeft3 = (e) => e.capacity - e.booked;   // arrow, no braces: implicit return
const double = (n) => n * 2;                       // one parameter: brackets optional, but keep them
const hello = () => "hi";                          // no parameters: empty ()
```

With `{ }` you need `return`. Without `{ }` the one expression is returned for you.

**The `({ })` trap:** `{` after `=>` starts a function body, not an object. To return an object straight away, wrap it in brackets.

```js
const wrong = (e) => { id: e.id };      // body with a label "id:"; returns undefined
const right = (e) => ({ id: e.id });    // returns the object
```

**In the exam:** `map((e) => ({ ...e, booked: e.booked + 1 }))` has the `({ })`. Without the brackets it returns `undefined` for every item.

**In React:** `onClick={() => setCount(count + 1)}`, `events.map((e) => <li key={e.id}>{e.title}</li>)`, `setEvents((prev) => [...prev, ev])`.

More: [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### Functions are values, and callbacks

A function can be stored in a variable, passed in as an argument, or returned. A function you pass for someone else to call later is a **callback**.

```js
const events = [{ id: 1, booked: 5 }, { id: 2, booked: 40 }];

function isBusy(e) { return e.booked > 20; }

events.filter(isBusy);              // pass the function: NO brackets
events.filter((e) => e.booked > 20); // same thing, written inline
events.filter(isBusy());            // wrong: this CALLS it now and passes its result
```

`isBusy` is the function. `isBusy()` is the result of running it.

**In the exam:** every array method takes a callback. Watch for `onClick={handle()}` (runs on every render) versus `onClick={handle}` or `onClick={() => handle(id)}`.

**In React:** `<button onClick={handleBook}>`, and `onClick={() => book(e.id)}` when you need to pass an argument. `useEffect(() => { ... }, [])` takes a callback too.

More: [Callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

### A function that returns a function

```js
function makeFilter(minBooked) {
  return (e) => e.booked >= minBooked;   // remembers minBooked
}

const busy = makeFilter(20);
busy({ booked: 25 });                    // true
events.filter(makeFilter(20));           // use the returned function as a callback
```

The inner function "remembers" `minBooked` even after `makeFilter` has finished. This is called a **closure**.

**In React:** `const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });` then `onChange={handleChange("title")}`. Event handlers capturing state work through closures too.

More: [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

### Named and default import/export

```js
// events.js
export const MAX = 100;                    // named export
export function seatsLeft(e) { return e.capacity - e.booked; }
export default function EventCard() {}     // default export: at most ONE per file

// elsewhere
import EventCard from "./events.js";             // default: no braces, any name you like
import { MAX, seatsLeft } from "./events.js";    // named: braces, exact names
import EventCard, { MAX } from "./events.js";    // both
import { seatsLeft as left } from "./events.js"; // rename a named import
```

A file can have many named exports but only one default. Braces mean "named".

**In the exam:** `import { useState } from "react"` has braces because `useState` is a named export; `import React from "react"` has none because it is the default.

**In React:** `import { useState, useEffect } from "react";` at the top of nearly every file, and `export default function App() {}` at the bottom. Your own components usually use `export default`, and hooks often use named exports.

More: [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import), [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)

## 5. Async (j04)

### Promises

JavaScript does not stop and wait for slow things such as network requests. A **Promise** is an object that stands for a value that will arrive later. It is *pending*, then *fulfilled* (with a value) or *rejected* (with an error).

```js
fetch("/api/events")
  .then((res) => res.json())          // runs when fulfilled
  .then((events) => console.log(events))
  .catch((err) => console.error(err)); // runs if anything above rejects
```

**In the exam:** a Promise is a value that arrives later and settles as fulfilled or rejected.

**In React:** older code and tutorials chain `.then`. Newer code uses `async/await`, below.

More: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

### async/await

```js
async function loadEvents() {
  const res = await fetch("/api/events");   // wait for the Promise, get the value
  const events = await res.json();          // res.json() is a Promise too
  return events;
}

const events = await loadEvents();          // await needs async, or top-level in a module
```

- An `async` function **always returns a Promise**, even if you `return` a plain value.
- `await` pauses only **that function** until the Promise settles. The page keeps working.
- `await` only works inside an `async` function (or at the top level of a module).
- Forget the `await` and you get a Promise object, not the data.

**In the exam:** an `async` function returns a Promise, and `await` pauses only that function.

**In React:** `useEffect` cannot take an `async` callback directly. Define the async function inside it and call it (see section 6).

More: [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

### try / catch / finally

```js
async function load() {
  try {
    const res = await fetch("/api/events");
    return await res.json();
  } catch (err) {
    console.error("failed:", err.message);   // runs if anything in try throws or rejects
    return [];
  } finally {
    console.log("done");                     // always runs, success or failure
  }
}
```

`await` turns a rejected Promise into a thrown error, so `try/catch` catches it. Use `finally` for things like `setLoading(false)`.

**In React:** `catch (err) { setError(err.message) }` and `finally { setLoading(false) }`.

More: [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

### fetch, res.ok and res.json()

```js
const res = await fetch("/api/events");
if (!res.ok) throw new Error(`HTTP ${res.status}`);   // ok is true for 200 to 299
const events = await res.json();                      // the body, parsed from JSON
```

**`fetch` does not throw on 404 or 500.** It only rejects on a network failure (or an abort). A 404 is a normal response with `res.ok === false`, so you must check it and throw yourself.

**In the exam:** check `res.ok` (or `res.status`) and `throw` if it is false. `res.json()` returns a Promise, so it needs `await`.

**In React:** every data-loading `useEffect` and every `queryFn` starts with this three-line pattern.

More: [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch), [Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)

### POST with headers and JSON.stringify

```js
const res = await fetch("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Hack day", capacity: 40 }),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const created = await res.json();
```

`fetch` takes a second argument: options. The `body` must be a **string**, so `JSON.stringify` turns your object into one, and the `Content-Type` header tells the server it is JSON.

**In the exam:** a POST needs `method: "POST"`, the JSON header and a stringified body.

**In React:** inside a form's `handleSubmit` or a `useMutation` `mutationFn` (d07, d08). Secured calls add `Authorization: \`Bearer ${token}\`` to `headers`.

More: [Using fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

### JSON.parse, JSON.stringify and 204

```js
JSON.stringify({ id: 1, title: "Quiz" });  // '{"id":1,"title":"Quiz"}'  (object to string)
JSON.parse('{"id":1,"title":"Quiz"}');     // { id: 1, title: "Quiz" }  (string to object)
JSON.parse("not json");                    // throws SyntaxError
```

`res.json()` does the `JSON.parse` for you. A **204 No Content** response (common after a DELETE) has **no body**, so calling `res.json()` on it throws.

```js
const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
if (res.status === 204) return null;   // nothing to parse
return await res.json();
```

More: [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

## 6. Reading React code with JS eyes

Here is a whole React + TypeScript component. Do not worry about what React does; just spot the JavaScript you already know.

```tsx
import { useState, useEffect } from "react";                         // 1
import type { CampusEvent } from "./types";                          // 2

export default function EventList({ title }: { title: string }) {    // 3
  const [events, setEvents] = useState<CampusEvent[]>([]);           // 4
  const [error, setError] = useState<string | null>(null);           // 5

  useEffect(() => {                                                  // 6
    async function load() {                                          // 7
      try {
        const res = await fetch("/api/events");                      // 8
        if (!res.ok) throw new Error(`HTTP ${res.status}`);          // 9
        setEvents(await res.json());                                 // 10
      } catch (err) {
        setError((err as Error).message);                            // 11
      }
    }
    load();                                                          // 12
  }, []);                                                            // 13

  return (
    <section>
      <h2>{title}</h2>
      {error && <p>{error}</p>}
      <ul>{events.map((e) => <li key={e.id}>{e.title}</li>)}</ul>    {/* 14 */}
    </section>
  );
}
```

1. **Named imports** with braces (section 4): `useState` and `useEffect` are named exports of `"react"`.
2. `import type` is TypeScript only and is removed at build time (d02 covers it).
3. **Default export** (section 4) and **object destructuring of props** (section 3): `{ title }`. The `: { title: string }` is a TypeScript label; d02 covers them.
4. **Array destructuring** (section 3): `useState` returns a pair `[value, setter]`. `[]` is the starting value. `<CampusEvent[]>` is a TypeScript label for what the array holds.
5. Same again: `error` starts as `null` and later holds a string. `string | null` means "a string or null" (d02).
6. `useEffect` takes a **callback** (section 4), an arrow function with no parameters. It runs after the first render.
7. The effect callback can't be `async`, so we define an **async function** inside it (section 5).
8. `await fetch(...)` (section 5) waits for the response.
9. **`res.ok` check and `throw`** (section 5). A template literal builds the message (section 3).
10. `res.json()` is a Promise, so it needs `await`. `setEvents(...)` replaces state with a new array (section 3: never mutate).
11. `catch` handles the failure from `throw` or a network error. `(err as Error)` is a TypeScript label telling the compiler what `err` is.
12. Call the async function we just defined.
13. `[]` is the dependency array: "run this once, after the first render".
14. **`.map` with an arrow function** (sections 3 and 4) turns each event into a `<li>`. `key={e.id}` helps React track items. `{ }` in JSX means "JavaScript goes here". `{error && <p>...}` uses `&&` (section 2).

(The numbered comments are for this page only; remove them in real code.)

## 7. JS traps

| Trap | Wrong | Right |
|---|---|---|
| Equality | `if (id == "7")` | `if (id === 7)`: `==` converts types, `===` doesn't |
| Mutating state | `events.push(ev); setEvents(events);` | `setEvents([...events, ev]);` (a new array) |
| Returning an object from an arrow | `(e) => { id: e.id }` returns `undefined` | `(e) => ({ id: e.id })` |
| `const` means frozen | "A `const` array can't change" | The name can't be re-pointed, but `arr.push(1)` works. Set React state by calling the setter, not by changing the array |
| `\|\|` for defaults | `booked \|\| 10` turns `0` into `10` | `booked ?? 10` replaces only `null` and `undefined` |
| Missing `await` | `const events = res.json();` is a Promise | `const events = await res.json();` |
| fetch throws on 404 | `try { await fetch(url) } catch` and assume errors land there | Check `if (!res.ok) throw new Error(...)` |
| `.json()` on a 204 | `await res.json()` after DELETE throws | Check `res.status === 204` first and skip the parse |
| `typeof null` | "`typeof null` is `'null'`" | It is `"object"`. Check `x === null` |
| `sort` mutates | `setItems(items.sort(...))` | `setItems([...items].sort(...))` or `items.toSorted(...)` |
| `forEach` returns | `const names = list.forEach((e) => e.title)` is `undefined` | Use `map` to get a new array |
| Import braces | `import { EventCard } from "./EventCard"` for a default export | Default: `import EventCard from ...`. Named: `import { seatsLeft } from ...` |
| Calling vs passing | `onClick={handle()}` runs during render | `onClick={handle}` or `onClick={() => handle(id)}` |
| `0 &&` in JSX | `{events.length && <List />}` prints `0` | `{events.length > 0 && <List />}` |
| Async `useEffect` | `useEffect(async () => {...}, [])` | Define an async function inside and call it |

**In the exam:** when an option "works but looks odd", ask whether it mutates something, forgets an `await`, or confuses *passing* a function with *calling* it. Those three explain most JS-flavoured wrong answers.

Next: **d01 array methods**, in [`drills/d01-array-methods/LESSON.md`](../drills/d01-array-methods/LESSON.md).
