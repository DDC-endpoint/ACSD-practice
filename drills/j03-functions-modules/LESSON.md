---
id: j03
module: ACSD
kind: drill
title: Functions and modules
difficulty: 1
timeMinutes: 20
mock: [C1]
tasks:
  - { name: "arrow function with an implicit return, and add the missing export: formatPrice", tests: [1, 2] }
  - { name: "arrow function that returns an object: ({ ... })", tests: [3] }
  - { name: "make formatEvent the default export", tests: [4] }
  - { name: "write the import line: default + named", tests: [10] }
  - { name: "write myFilter and applyToAll by hand with a loop", tests: [5, 6, 7] }
  - { name: "a function that returns a function: capacityOver(n)", tests: [8, 9] }
---

# j03 · Functions and modules

> **Exam link:** **C1** asks you to type `const total = prices.reduce((sum, p) => sum + p, 0);` into a text box. Everything inside the brackets is an **arrow function passed as a callback**: this drill makes that line stop looking like magic. Every React file you read starts with `import ... from ...` and ends with `export default ...`, so you need to read and write those lines too.

## The idea

Try snippets yourself: open the browser DevTools console (F12 → Console) and paste them, or run `node` in a terminal. (Snippets with `import`/`export` need real files, so for those just read them.)

### 1. Arrow functions

A function is a recipe you can run later. An **arrow function** is the short way to write one: parameters, then `=>`, then what it gives back.

```js
const add = (a, b) => a + b;        // no { } and no `return`: the value after => is returned
add(2, 3);                          // 5

const double = n => n * 2;          // ONE parameter: the brackets are optional
const hello = () => "hi";           // no parameters: empty brackets are required

const area = (w, h) => {            // with { } you must write `return` yourself
  const result = w * h;
  return result;
};
```

- No `{ }` after the arrow = **implicit return** (the value is returned for you).
- With `{ }` = a normal function body. No `return` means it gives back `undefined`.

### 2. The `({ ... })` trap

You want an arrow function that returns an **object**. This looks right and is wrong:

```js
const toPoint = (x, y) => { x: x, y: y };      // ✘ the { } is read as a function BODY, so you get undefined
const toPoint = (x, y) => ({ x: x, y: y });    // ✔ round brackets around the object
toPoint(1, 2);                                 // { x: 1, y: 2 }
```

`{ ... }` after `=>` means "function body". Wrap the object in `( )` to say "this is a value".

**In React you'll see this as:** `setUser((prev) => ({ ...prev, name: "Ana" }))`. That `({ ... })` is exactly this trap.

### 3. Functions are values

In JavaScript a function is a value, like a number or a string. You can put it in a variable, pass it to another function, or return it from one.

```js
const shout = (text) => text.toUpperCase() + "!";    // stored in a variable

function runTwice(fn, input) {                       // `fn` is a function we receive
  return fn(fn(input));
}
runTwice(shout, "hey");                              // "HEY!!" (shout was passed in, NOT called: no brackets after it)
```

A function you hand to another function to be called later is a **callback**. `shout` here is the callback.

`shout` is the function. `shout("hey")` is the function **called**, giving a result. Passing `shout` (no brackets) hands over the recipe. Passing `shout("hey")` hands over its result.

**In React you'll see this as:** `onClick={() => setOpen(true)}`, `items.map((i) => ...)` and `items.filter((i) => ...)`. They all take a callback. Callbacks are this drill (j03), and `map`/`filter` themselves are d01.

### 4. What `filter` and `map` do inside

`filter` and `map` aren't magic. They're a loop that calls your callback. Here are hand-made versions:

```js
function myFilter(list, test) {
  const kept = [];
  for (const item of list) {
    if (test(item)) kept.push(item);     // call the callback; keep the item if it says true
  }
  return kept;
}

function applyToAll(list, fn) {          // this is what `map` does
  const results = [];
  for (const item of list) {
    results.push(fn(item));              // call the callback; keep what it gives back
  }
  return results;
}

myFilter([1, 2, 3, 4], (n) => n > 2);    // [3, 4]
applyToAll([1, 2, 3], (n) => n * 10);    // [10, 20, 30]
```

### 5. A function that returns a function

You can also **return** a function. The returned function remembers the values around it.

```js
const greaterThan = (limit) => (n) => n > limit;   // takes limit, returns a NEW function

const over10 = greaterThan(10);
over10(15);    // true
over10(3);     // false
[5, 12, 20].filter(greaterThan(10));   // [12, 20]: the returned function is the callback
```

Read `(limit) => (n) => n > limit` as "give me a limit, I give you a tester". You'll mostly *meet* this pattern (in hooks and event handlers) rather than write it. [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) and [MDN: Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

### 6. Modules: `export` and `import`

A project is split into **files**. A file can share things with `export`, and another file picks them up with `import`.

**Named export / import** (a file can have as many as it likes):

```js
// format.js
export function formatPrice(pence) { /* ... */ }
export const taxRate = 0.2;

// events.js: the names go in { curly brackets } and must match exactly
import { formatPrice, taxRate } from "./format.js";
import { formatPrice as price } from "./format.js";   // to rename a named import, you need `as`
```

**Default export / import** (**one per file** at most):

```js
// EventCard.jsx
export default function EventCard() { /* ... */ }

// App.jsx: NO curly brackets, and you pick the name yourself
import EventCard from "./EventCard.jsx";
import Card from "./EventCard.jsx";     // also fine: the default has no fixed name
```

You can mix both in one line: `import formatEvent, { formatPrice } from "./format.js";`

- Paths to your own files start with `./` (this folder) or `../` (the folder above). In this pack they end with `.js`.
- Forget the `{ }` on a named import and you get `undefined` or an error. Add them to a default import and you get the same.

**In React you'll see this as:** components are usually **default** exports (`export default function App()` and `import App from "./App"`), and helpers or hooks are usually **named** exports (`import { useState } from "react"`). [MDN: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) and [MDN: import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

## Worked example

A different scenario: a shop that has `prices.js` and `shop.js`.

```js
// prices.js
export const addVat = (price) => price * 1.2;                 // named, arrow, implicit return
export const toItem = (name, price) => ({ name, price });     // returns an object, so ({ ... })

export default function describe(item) {                      // the ONE default export
  return `${item.name}: ${item.price}`;
}

// shop.js
import describe, { addVat, toItem } from "./prices.js";       // default has no { }, named ones do

const makeCounter = () => {
  let count = 0;
  return () => {          // a function that returns a function
    count += 1;
    return count;
  };
};

const next = makeCounter();
next();   // 1
next();   // 2  (it remembers count)

const names = ["pen", "mug"];
const items = names.map((n) => toItem(n, addVat(10)));        // callback to map
// [{ name: "pen", price: 12 }, { name: "mug", price: 12 }]
const lines = items.map(describe);                            // describe passed as a callback, no brackets
```

- `addVat` has no `{ }`, so the answer is returned for you.
- `toItem` wraps the object in `( )`. Without them it would return `undefined`.
- `describe` is the default export. In `shop.js` we could import it under any name.
- `makeCounter()` returns a function. `next` is that function, and each call changes the `count` it remembers.
- `items.map(describe)` passes the function itself (no brackets) as the callback.

## Your task

CampusEvents again: the formatting helpers live in one file and the list functions in another.

1. Open `src/format.js`:
   - **TODO j03-1:** make `formatPrice` an arrow function with an implicit return (pence → `"£12.50"`), and add the missing `export`.
   - **TODO j03-2:** `toSummary` is an arrow function that returns an object `{ id, label }`. Mind the `({ ... })` trap.
   - **TODO j03-3:** turn `formatEvent` into the **default** export and write its body.
2. Open `src/events.js`:
   - **TODO j03-4:** write the missing `import` line (default `formatEvent` plus named `toSummary`).
   - **TODO j03-5:** write `myFilter` and `applyToAll` by hand with a loop.
   - **TODO j03-6:** write `capacityOver(n)`: it returns a function.
3. Run `npm test -- j03` until all 10 tests are green. Tests 1 and 4 check the exports, and test 10 checks the import.
4. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write these on paper:
   - the C1 line: `const total = prices.reduce((sum, p) => sum + p, 0);`
   - an arrow function that returns an object: `const toSummary = (e) => ({ id: e.id });`
   - one named import and one default import, and say why only one has `{ }`

## Hints

<details><summary>Hint 1: where do I start? (j03-1)</summary>

Test 1 says `formatPrice` is `undefined`. That is because the file doesn't export it. Put `export` at the very start of the line. Then replace the whole `{ ... }` body with just the value: `export const formatPrice = (pence) => <the text>;`
</details>

<details><summary>Hint 2: the price text (j03-1)</summary>

`pence / 100` turns 1250 into 12.5. `.toFixed(2)` turns that into the text `"12.50"` (two decimal places). Put `£` in front using a template literal: `` `£${(pence / 100).toFixed(2)}` ``.
</details>

<details><summary>Hint 3: test 3 says <code>undefined</code> (j03-2)</summary>

You wrote `=> { id: event.id, label: event.title }`. The braces are read as a function body. Wrap the object in round brackets: `=> ({ id: event.id, label: event.title })`.
</details>

<details><summary>Hint 4: test 4 says <code>typeof fmt.default</code> is not a function (j03-3)</summary>

The function exists but isn't exported. Write `export default function formatEvent(event) { ... }`. Build the text from three pieces with a template literal: `${event.title} - ${formatDate(event.date)} - ${formatPrice(event.price)}`. `formatDate` and `formatPrice` are already in the same file, so you don't import them.
</details>

<details><summary>Hint 5: test 10 says <code>formatEvent is not defined</code> (j03-4)</summary>

`events.js` uses `formatEvent` and `toSummary`, but it has no import line yet. The default one has no `{ }`, the named one does, and the path is `"./format.js"`:

```js
import formatEvent, { toSummary } from "./format.js";
```
</details>

<details><summary>Hint 6: myFilter (j03-5)</summary>

Make an empty array, loop over `list` with `for (const item of list)`, and call the callback with `test(item)`. If it's true, `push` the item. Return the array at the end. Don't use `.filter`, because the point is to see what it does inside.
</details>

<details><summary>Hint 7: applyToAll (j03-5, nearly the answer)</summary>

```js
const results = [];
for (const item of list) {
  results.push(fn(item));   // call fn, keep what it returns
}
return results;
```
It's the same as `myFilter`, but with no `if`: every item is pushed, after being changed by `fn`.
</details>

<details><summary>Hint 8: capacityOver (j03-6)</summary>

It takes `n`, then **returns** an arrow function. The returned function takes an `event` and gives back `event.capacity > n`:

```js
return (event) => event.capacity > n;
```
Don't write `event` as a parameter of `capacityOver` itself: it doesn't get the event until later.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Write an arrow function <code>add</code> that returns the sum of <code>a</code> and <code>b</code>.</summary>

```js
const add = (a, b) => a + b;
```
There are no braces, so the value after `=>` is returned (an implicit return). With braces you'd have to write `return a + b;`.
</details>

<details><summary>Why does <code>const f = () =&gt; { id: 1 }</code> return <code>undefined</code>, and how do you fix it?</summary>

The `{ }` after the arrow is read as a function **body**, not an object, and the body has no `return`. Wrap the object in round brackets: `const f = () => ({ id: 1 });`.
</details>

<details><summary>What is a callback? Give an example from the C1 mock question.</summary>

A callback is a function you pass to another function so it can be called later. In `prices.reduce((sum, p) => sum + p, 0)`, the arrow function `(sum, p) => sum + p` is the callback: `reduce` calls it once for every price.
</details>

<details><summary>What is the difference between passing <code>fn</code> and passing <code>fn()</code> as a callback?</summary>

`fn` is the function itself, so the other function can call it later. `fn()` calls it right now and passes along its **result** (often `undefined`). In React, `onClick={handle}` is right, and `onClick={handle()}` runs `handle` while the component renders.
</details>

<details><summary>What is the difference between a named export and a default export, and how do you import each?</summary>

A file can have many **named** exports (`export function formatPrice() {}`), imported with curly brackets and the exact name: `import { formatPrice } from "./format.js"`. A file can have only **one** default export (`export default function App() {}`), imported with no brackets, under any name: `import App from "./App.js"`. React components are usually default exports, and helpers usually named ones.
</details>

<details><summary>How do you import a named export under a different name?</summary>

Use `as`: `import { formatPrice as price } from "./format.js";`. A default import can be called anything without `as`, because it has no fixed name.
</details>
