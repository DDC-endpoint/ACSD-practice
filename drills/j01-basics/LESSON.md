---
id: j01
module: ACSD
kind: drill
title: JavaScript basics
difficulty: 1
timeMinutes: 20
mock: []
tasks:
  - { name: "return a value, and compare ids with ===: seatsLeft, sameId", tests: [1, 2] }
  - { name: "truthy and falsy: isBlank", tests: [3] }
  - { name: "if / else if / else and the ternary: statusLabel, openText", tests: [4, 5] }
  - { name: "typeof, and its two quirks (null and arrays): describeValue", tests: [6] }
  - { name: "loops: for...of (countOpen) and a classic for (titlesOf)", tests: [7, 8] }
  - { name: "const vs mutation: addBooking changes an object in place", tests: [9] }
---

# j01 · JavaScript basics

> **Exam link:** the ICT is React + TypeScript, and every React line you type is JavaScript first. This drill is "the JS every later drill assumes": declaring variables, comparing with `===`, `if`/ternary (React renders with `cond ? a : b`), loops, and functions that `return`. Nothing here is a mock question on its own. Without it, d01 and everything after it will feel like a foreign language.

## The idea

Try every snippet yourself. Open the browser DevTools console (press **F12**, then the **Console** tab) and paste it in, or run `node` in a terminal and paste there. Seeing the answer yourself beats reading about it.

The running example is **CampusEvents**. An event is an *object* (a bundle of named values) like this:

```js
{ id: 3, title: "Hack Night", capacity: 40, booked: 38, category: "tech", isOpen: true }
```

### 1. `let` and `const`: two ways to name a value

```js
let seats = 10;
seats = 9;              // fine: let can be re-assigned

const venue = "Room 4";
venue = "Room 5";       // TypeError: Assignment to constant variable.
```

- `const` means "this name can't point at a different value". Use it by default.
- Use `let` only when you really will re-assign it (a counter, a running total).
- Don't use `var`. It's the old way and it has odd scoping rules.

The trap: `const` stops **re-assigning**, not **changing the inside** of an object or array.

```js
const event = { title: "Hack Night", booked: 38 };
event.booked = 39;       // ✔ allowed: same object, new value inside
const titles = [];
titles.push("Hack Night");   // ✔ allowed: same array, one more item

event = { title: "Other" };  // ✘ TypeError: that's re-assigning the name
```

**In React you'll see this as:** `const [count, setCount] = useState(0)`. It's `const` even though `count` changes, because React gives you a brand-new `count` on each render rather than re-assigning it. [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

### 2. Types and `typeof`

JavaScript values come in a few kinds. `typeof` tells you which:

```js
typeof "hello"     // "string"
typeof 42          // "number"   (whole numbers and decimals are both "number")
typeof true        // "boolean"
typeof undefined   // "undefined"  (a name with no value yet)
typeof { id: 1 }   // "object"
typeof [1, 2]      // "object"   ← arrays are objects too! Use Array.isArray([1, 2]) → true
typeof null        // "object"   ← a famous quirk
```

`null` means "I deliberately have nothing here". `undefined` means "nothing has been put here". `typeof null === "object"` is a mistake from the first version of JavaScript that can never be fixed without breaking old websites, so just learn it: to test for null, write `value === null`. [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

**In React you'll see this as:** TypeScript types like `string | null` and `number | undefined`. They exist because these two "nothing" values cause real bugs.

### 3. `===` and `==`

```js
"5" == 5      // true   ← == quietly converts types first. Surprising!
"5" === 5     // false  ← === says: different types, so not equal
0 == ""       // true   (!)
0 === ""      // false
```

**Always use `===` (and `!==` for "not equal").** `==` does type conversion in ways nobody remembers. This matters for ids: an id from a URL is the text `"3"`, but an id in your data is the number `3`. `"3" === 3` is `false`, so a lookup quietly finds nothing. [MDN: strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)

**In React you'll see this as:** `events.find((e) => e.id === Number(id))`. The `Number(...)` turns the URL's text into a number first, so `===` can match.

### 4. Truthy and falsy

When JavaScript needs a yes/no (in an `if`, `&&`, `!`), it converts the value. These six are the **falsy** values you'll meet (count as "no"):

```js
false   0   ""   null   undefined   NaN
```

Everything else is **truthy**, including `"0"`, `"false"`, `[]` (an empty array) and `{}` (an empty object).

```js
if ("") { /* skipped */ }
if ([]) { /* RUNS: an empty array is truthy */ }
!!"hello"      // true   (!! turns any value into true/false)
```

`NaN` ("not a number") is what you get from `Number("abc")`. Use it to spot bad input. A handy shortcut: `if (!text)` is true for `""`, `null` and `undefined` all at once. [MDN: falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

**In React you'll see this as:** `{events.length && <List />}`. When the length is `0`, React renders the number `0` on screen, a classic bug. Write `events.length > 0 && ...` instead.

### 5. `if` / `else if` / `else`, and the ternary

```js
const left = event.capacity - event.booked;

if (left === 0) {
  label = "Full";
} else if (left <= 5) {
  label = "Almost full";
} else {
  label = "Open";
}
```

Only the **first** branch whose condition is true runs. The **ternary** is a one-line `if/else` that gives back a value:

```js
const label = event.isOpen ? "Open for booking" : "Closed";
//            condition    ? value if true      : value if false
```

**In React you'll see this as:** `{isLoading ? <Spinner /> : <EventList />}`. You can't put an `if` statement inside JSX (the HTML-like code React uses), but you can put a ternary. [MDN: conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator)

### 6. Loops

```js
const titles = ["Hack Night", "Careers Fair"];

// classic for: you control the counter i
for (let i = 0; i < titles.length; i++) {
  console.log(titles[i]);     // i is 0, then 1
}

// for...of: gives you each item directly (usually nicer)
for (const title of titles) {
  console.log(title);
}
```

A classic `for` has three parts: **start** (`let i = 0`), **keep going while** (`i < titles.length`), **after each go** (`i++`, which adds 1). Note `let` there, because `i` changes. Inside `for...of`, `const` is fine because each go gets a fresh name.

Next drill up (d01) replaces most loops with `map`, `filter` and `reduce`, so these two loops are the foundation, not what you'll write most. [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

### 7. Functions and `return`

```js
function seatsLeft(event) {      // seatsLeft: the name. event: a parameter (an input).
  return event.capacity - event.booked;   // return: hand the answer back
}

const n = seatsLeft({ capacity: 40, booked: 38 });   // n is 2
```

- A **parameter** is a name for an input. The value you pass in when calling is the **argument**.
- `return` ends the function and gives the value back.
- **If a function has no `return`, it gives back `undefined`.** Working something out and forgetting to `return` it is the most common beginner bug.

```js
function forgetful(event) {
  event.title.toUpperCase();   // computed, then thrown away
}
forgetful({ title: "Hack Night" });   // undefined
```

[MDN: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## Worked example

A different scenario: a **library** with books `{ title, copies, onLoan, isReference }`.

```js
function copiesAvailable(book) {
  return book.copies - book.onLoan;                  // (1)
}

function shelfLabel(book) {
  const free = copiesAvailable(book);
  if (book.isReference) {                            // (2)
    return "Reference only";
  } else if (free === 0) {
    return "All on loan";
  }
  return free <= 2 ? "Few left" : "On the shelf";    // (3)
}

function describe(x) {
  if (x === null) return "null";                     // (4)
  return typeof x;
}

function countOnLoan(books) {
  let count = 0;                                     // (5)
  for (const book of books) {
    if (book.onLoan > 0) count++;
  }
  return count;                                      // (6)
}

const books = [
  { title: "Clean Code", copies: 3, onLoan: 3, isReference: false },
  { title: "Atlas", copies: 1, onLoan: 0, isReference: true },
];
shelfLabel(books[0]);   // "All on loan"
shelfLabel(books[1]);   // "Reference only"
countOnLoan(books);     // 1
describe(null);         // "null"  (typeof null alone would say "object")
```

1. A function that calls another function: `return` hands the number back to the caller.
2. `if / else if` checks one thing at a time, top to bottom. The first true branch returns and the function stops.
3. After the `if` returns early, the ternary handles the last two cases in one line.
4. Check `null` **before** `typeof`, because `typeof null` would wrongly say `"object"`.
5. `let`, because `count` changes.
6. `return` after the loop, not inside it. A `return` inside the loop would stop after the first book.

## Your task

A set of small CampusEvents helper functions.

1. Open `src/basics.js`. Do `TODO j01-1` … `TODO j01-6`:
   - **TODO j01-1:** `seatsLeft(event)` and `sameId(a, b)`. One line each. `sameId` uses `===`.
   - **TODO j01-2:** `isBlank(text)`: true for `undefined`, `null`, `""` and spaces-only text.
   - **TODO j01-3:** `statusLabel(event)` with `if / else if / else`, and `openText(event)` with the ternary.
   - **TODO j01-4:** `describeValue(value)` using `typeof`, with `null` and arrays handled first.
   - **TODO j01-5:** `countOpen(events)` with `for...of`, and `titlesOf(events)` with a classic `for`.
   - **TODO j01-6:** `addBooking(event, n)` changes `event.booked` in place and returns it (or `-1` if full).
2. `forgetfulTitle` at the top of the file is given. Read it: it's the "forgot to `return`" bug on purpose (test 1 checks it gives `undefined`).
3. Run `npm test -- j01` until all 9 tests are green.
4. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the file and write these on paper:
   - `statusLabel` with `if / else if / else`
   - the ternary: `event.isOpen ? "Open for booking" : "Closed"`
   - a `for...of` loop that counts with `let count = 0`
   - what `typeof null`, `"5" === 5` and `if ([])` do

## Hints

<details><summary>Hint 1: where do I start?</summary>

Test 1. Each function is one line: `return event.capacity - event.booked;`. For `sameId`, `return a === b;` (three equals signs, not two).
</details>

<details><summary>Hint 2: <code>isBlank</code> (test 3)</summary>

Two checks joined with `||` ("or"). First: is the text missing or empty? `!text` is `true` for `undefined`, `null` and `""`. Second: is it only spaces? `text.trim()` removes spaces from both ends, so `text.trim() === ""`. Put the missing check **first**, because `undefined.trim()` crashes. `||` stops as soon as the left side is true.

```js
return !text || text.trim() === "";
```
</details>

<details><summary>Hint 3: <code>statusLabel</code> (test 4)</summary>

First work out `const left = event.capacity - event.booked;`. Then check from most specific to least: `left === 0`, then `left <= 5`, then `else`. Each branch does `return "..."`. Mind the edge: exactly 5 left is "Almost full", and 6 left is "Open".
</details>

<details><summary>Hint 4: <code>openText</code> (test 5)</summary>

The shape is `condition ? valueIfTrue : valueIfFalse`. The condition is just `event.isOpen`, which is already `true` or `false`. Put `return` in front of the whole thing.
</details>

<details><summary>Hint 5: <code>describeValue</code> (test 6)</summary>

Three checks in this order, each one a `return`. First `if (value === null) return "null";`, then `if (Array.isArray(value)) return "array";`, and last `return typeof value;`.

If `null` or arrays come out as `"object"`, you did the `typeof` check too early.
</details>

<details><summary>Hint 6: the loops (tests 7 and 8)</summary>

`countOpen`: start `let count = 0;`, then `for (const event of events) { if (event.isOpen) count++; }`, then `return count;` **after** the loop.

`titlesOf`: `const titles = [];`, then `for (let i = 0; i < events.length; i++) { titles.push(events[i].title); }`, then `return titles;`. Your `const titles` is allowed to grow with `push`.
</details>

<details><summary>Hint 7: <code>addBooking</code> (test 9, nearly the answer)</summary>

```js
if (n > event.capacity - event.booked) return -1;   // not enough seats: change nothing
event.booked += n;                                  // += means "add n to what's there"
return event.booked;
```
If the test says the object didn't change, you probably wrote `return event.booked + n` without updating `event.booked`. A calculation doesn't store anything until you assign it.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>What's the difference between <code>let</code> and <code>const</code>? Can you change an array declared with <code>const</code>?</summary>

`let` lets you re-assign the name later (`count = count + 1`). `const` doesn't: re-assigning throws a `TypeError`. But `const` only locks the **name**, not what's inside, so `const items = []; items.push("a");` works fine. You can't write `items = [...]`.
</details>

<details><summary>What's the difference between <code>==</code> and <code>===</code>, and which should you use?</summary>

`==` converts the types before comparing, so `"5" == 5` is `true`. `===` compares value **and** type, so `"5" === 5` is `false`. Always use `===` (and `!==`), because it never surprises you. For example, a route id is the text `"3"` and won't match the number `3` unless you convert it.
</details>

<details><summary>Which values are falsy in JavaScript? Is an empty array falsy?</summary>

Six to remember: `false`, `0`, `""` (empty string), `null`, `undefined` and `NaN`. Everything else is truthy. An empty array `[]` and an empty object `{}` are both **truthy**, so check `arr.length === 0`, not `!arr`.
</details>

<details><summary>Why does <code>typeof null</code> give <code>"object"</code>, and how do you check for null properly?</summary>

It's a long-standing bug from the first version of JavaScript that was never fixed, to avoid breaking old code. `null` is not really an object. Check with `value === null`. Arrays also give `"object"`, so use `Array.isArray(value)` for those.
</details>

<details><summary>Write <code>if / else</code> as a ternary, and say why React uses the ternary.</summary>

```js
const label = isOpen ? "Open" : "Closed";
```
It's an expression, meaning it produces a value, so it can sit inside JSX: `{isOpen ? <OpenBadge /> : <ClosedBadge />}`. An `if` statement can't go inside JSX.
</details>

<details><summary>My function works out the right value but the caller gets <code>undefined</code>. What's wrong?</summary>

The function has no `return` statement (or the `return` is missing on that branch). A function with no `return` gives back `undefined`. Add `return value;` so the answer is handed back to the caller.
</details>
