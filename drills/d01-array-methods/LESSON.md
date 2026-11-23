---
id: d01
module: ACSD
kind: drill
title: Array methods and Promise.all
difficulty: 1
timeMinutes: 25
mock: [A1, A7, B3, C1]
tasks:
  - { name: "reduce with an initial value of 0: sumPrices (the C1 line) and basketTotal", tests: [1] }
  - { name: "find (first match or undefined) vs filter (every match, maybe [])", tests: [2] }
  - { name: "map each item to a label", tests: [3] }
  - { name: "some (at least one) and every (all of them)", tests: [4] }
  - { name: "sort a COPY by price, then slice(0, n)", tests: [5] }
  - { name: "Promise.all: start three requests in parallel, destructure the results", tests: [6, 7] }
  - { name: "Promise.allSettled: keep the successes, count the failures", tests: [8] }
---

# d01 · Array methods and Promise.all

> **Exam link:** **A1**: *"display the total value of all items in a shopping basket. Which array method… for calculating a single accumulated value?"* → `reduce()` (the distractors are `find`, `sort`, `slice`). **C1**: *"`const prices = [15, 25, 10, 30];` Write a JavaScript statement using `reduce()` to calculate the total… in a variable named `total`"*: a one-line answer typed into a text box. **B3**: *"The JavaScript `find()` method returns every element that satisfies a condition"* → **False**. **A7**: *"What is the main purpose of `Promise.all()`?"* → run several async operations and wait for all of them to succeed.

## The idea

All of these methods take a **callback**: a small arrow function that gets called once per element. Only `sort` changes the array it's called on; the others return something new. MDN has a page per method: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

### 1. `reduce`: many values → one value

```ts
const prices = [15, 25, 10, 30];
const total = prices.reduce((sum, p) => sum + p, 0);   // 80   ← this is the whole C1 answer
```

`sum` is the running total so far (the *accumulator*), `p` is the current price, and the `0` at the end is the **initial value**: what `sum` starts as. Always pass it. Without it, `[].reduce(...)` throws a `TypeError`, and with an array of objects the first *object* becomes `sum`.

```ts
const items = [{ price: 2, qty: 3 }, { price: 5, qty: 1 }];
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);   // 11
```

"A single accumulated value" (total, count, max, average) means `reduce`. [MDN: reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

### 2. `find` vs `filter`: the B3 trap

| | returns | no match |
|---|---|---|
| `find(cb)` | the **first** element that matches (one item) | `undefined` |
| `filter(cb)` | a **new array** of **every** element that matches | `[]` |

```ts
const nums = [4, 9, 12, 15];
nums.find((n) => n > 10);     // 12           (stops at the first hit)
nums.filter((n) => n > 10);   // [12, 15]
nums.find((n) => n > 99);     // undefined
nums.filter((n) => n > 99);   // []
```

So "`find()` returns every element that satisfies a condition" is **False**. That's `filter`. In TypeScript the return type tells you too: `find` gives `T | undefined`, `filter` gives `T[]`.

### 3. `map`: same length, each element transformed

```ts
const names = items.map((item) => item.name);        // ["Mug", "Pen"]
const labels = items.map((i) => `${i.qty} x ${i.name}`);
```

`map` always returns an array the **same length** as the input. Use `filter` to drop items, and `map` to change them. In React, `map` is how you turn data into a list of elements.

### 4. `some` and `every`: yes/no questions

```ts
[1, 0, 3].some((n) => n === 0);    // true:  at least one is 0
[1, 0, 3].every((n) => n > 0);     // false: not all are > 0
[].some((n) => n === 0);           // false
[].every((n) => n > 0);            // true   (nothing broke the rule)
```

### 5. `sort` changes the array; `slice` doesn't

```ts
const prices = [10, 9, 100];
prices.sort();                           // ✘ [10, 100, 9]: compares as TEXT, and prices itself is now reordered
const sorted = [...prices].sort((a, b) => a - b);   // ✔ [9, 10, 100] on a copy; prices is untouched
const top2 = sorted.slice(0, 2);         // [9, 10]: slice(start, end) copies, end is NOT included
```

- `sort` **mutates** (changes) the original and returns that same array. In React that's a bug: never sort state or props in place.
- Without a compare function, `sort` turns values into strings, so `100` comes before `9`. For numbers use `(a, b) => a - b` (small → big).
- Newer JavaScript has `toSorted()`, which returns a sorted copy. This project's TypeScript settings target ES2022, so use `[...arr].sort(...)`.
- `slice` never changes the array. It is **not** a way to total things, which is why it's a wrong option in A1.

### 6. `Promise.all`: start everything, wait for all of it

```ts
// One after another: the 2nd request doesn't START until the 1st has finished. Waits add up.
const user = await loadUser();
const orders = await loadOrders();

// In parallel: both start now, and we wait once.
const [user, orders] = await Promise.all([loadUser(), loadOrders()]);
```

- You pass an **array of promises** and get back **one** promise. It resolves to an array of the results, **in the same order you passed them** (not the order they finished).
- **If any one rejects, the whole `Promise.all` rejects** straight away with that error ("fail fast"). The other requests aren't cancelled; their results are just ignored.
- `Promise.all` does **not** run things one after another, and it does **not** cancel anything (both are A7 distractors).

[MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

### 7. `Promise.allSettled`: when partial results are OK

```ts
const results = await Promise.allSettled([loadA(), loadB()]);
// [{ status: "fulfilled", value: ... }, { status: "rejected", reason: Error }]
```

It **never rejects**. It waits for every promise to *settle* (succeed or fail) and tells you which was which. Use it when one failed widget shouldn't blank the whole page.

> **A7 nuance:** the mock's answer says *"wait for all of them to settle successfully"*. "Settled" strictly includes failures (that's `allSettled`), but the option means "all succeed", and it's the correct pick. The other options are clearly wrong.

## Worked example

A different scenario: a gradebook. Same methods, new data.

```ts
interface Mark { student: string; score: number; }

const marks: Mark[] = [
  { student: "Ana", score: 72 },
  { student: "Ben", score: 38 },
  { student: "Cai", score: 55 },
];

const totalScore = marks.reduce((sum, m) => sum + m.score, 0);   // 165   (initial value 0)
const average = totalScore / marks.length;                       // 55

const firstFail = marks.find((m) => m.score < 40);     // { student: "Ben", score: 38 }   one object
const passes = marks.filter((m) => m.score >= 40);     // [Ana, Cai]                      an array

const names = marks.map((m) => m.student);             // ["Ana", "Ben", "Cai"]
const anyFail = marks.some((m) => m.score < 40);       // true
const allPassed = marks.every((m) => m.score >= 40);   // false

const ranked = [...marks].sort((a, b) => b.score - a.score);   // b - a = high → low, on a copy
const podium = ranked.slice(0, 2);                             // [Ana, Cai]

async function loadDashboard() {
  const [students, modules] = await Promise.all([fetchStudents(), fetchModules()]);
  return { students, modules };   // if fetchModules() rejects, loadDashboard() rejects too
}
```

- `(a, b) => b.score - a.score` sorts **high → low**; `a - b` would be low → high.
- `[...marks]` makes a shallow copy, so `marks` keeps its original order.
- `Promise.all` takes an **array** `[ ... ]` and you destructure the result with `const [a, b] = ...`.

## Your task

A shopping basket of `{ name, price, qty }` items, plus a checkout page that needs three requests.

1. Open `src/basket.ts`:
   - **TODO d01-1:** `sumPrices(prices)` (the C1 line, word for word) and `basketTotal(items)` (price × qty for each line). Both use `reduce` with an initial value of `0`.
   - **TODO d01-2:** `findItem(items, name)` with `find`, and `itemsCheaperThan(items, maxPrice)` with `filter`.
   - **TODO d01-3:** `itemLabels(items)` returns labels like `"2 x Apple"`.
   - **TODO d01-4:** `hasFreeItem` (`some`) and `allHaveQty` (`every`).
   - **TODO d01-5:** `cheapest(items, n)` returns the `n` cheapest items without changing `items`.
2. Open `src/loaders.ts`. Read `loadCheckoutOneByOne` (given): that's the slow way.
   - **TODO d01-6:** `loadCheckout(api)` does the same with `Promise.all`, so all three requests start at once.
   - **TODO d01-7:** `loadWhatWeCan(loaders)` uses `Promise.allSettled` and returns `{ values, failed }`.
3. Run `npm test -- d01` until all 8 tests are green.
4. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write these on paper:
   - the C1 line: `const total = prices.reduce((sum, p) => sum + p, 0);`
   - `find` vs `filter` on the same array, and what each returns when nothing matches
   - `const [a, b] = await Promise.all([loadA(), loadB()]);`

## Hints

<details><summary>Hint 1: where do I start?</summary>

Test 1. Write the C1 line inside `sumPrices` and `return total;`. Then copy the same shape for `basketTotal`, but add `item.price * item.qty` instead of `p`. Don't forget the `, 0` before the closing bracket.
</details>

<details><summary>Hint 2: test 2 says "expected [ {…} ] to equal {…}" or the reverse</summary>

You swapped them. `findItem` should give back **one object** (or `undefined`), so it uses `find`. `itemsCheaperThan` should give back an **array**, so it uses `filter`. "Below `maxPrice`" means `<`, not `<=`.
</details>

<details><summary>Hint 3: test 5 says the original order changed</summary>

`items.sort(...)` sorted the caller's array in place. Copy first: `[...items].sort((a, b) => a.price - b.price).slice(0, n)`.
</details>

<details><summary>Hint 4: test 6 fails on <code>startedTogether</code> (only the first loader was called)</summary>

You `await`ed each call on its own line, so the second request couldn't start until the first finished. Call all three **inside** the array you pass to `Promise.all`, and `await` only once:
```ts
const [user, items, offers] = await Promise.all([api.loadUser(), api.loadBasket(), api.loadOffers()]);
```
</details>

<details><summary>Hint 5: test 8 (nearly the answer)</summary>

```ts
const results = await Promise.allSettled(loaders.map((load) => load()));
const values: T[] = [];
let failed = 0;
for (const r of results) {
  if (r.status === "fulfilled") values.push(r.value);
  else failed++;
}
return { values, failed };
```
`loaders.map((load) => load())` calls every loader, which starts them all, and gives you an array of promises.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Write a statement using <code>reduce()</code> that totals <code>const prices = [15, 25, 10, 30];</code> into <code>total</code>.</summary>

```ts
const total = prices.reduce((sum, p) => sum + p, 0);   // 80
```
`sum` is the accumulator, `p` is each price, and `0` is the initial value, so an empty array gives 0 instead of an error.
</details>

<details><summary>True or false: <code>find()</code> returns every element that satisfies a condition.</summary>

**False.** `find()` returns only the **first** matching element, or `undefined` if none match. `filter()` returns a new array of **every** matching element (an empty array if none match).
</details>

<details><summary>Which array method calculates a single accumulated value, such as a basket total? Why not <code>sort</code> or <code>slice</code>?</summary>

`reduce()`. It walks the array carrying an accumulator and returns one value. `sort` only reorders (and mutates the original), and `slice` only copies part of the array; neither combines the values.
</details>

<details><summary>What is the main purpose of <code>Promise.all()</code>, and what happens if one promise rejects?</summary>

It runs several asynchronous operations **in parallel** and waits until **all** of them have succeeded, resolving to an array of their results in the original order. If any one rejects, `Promise.all` rejects immediately with that error. If you want every result, including the failures, use `Promise.allSettled`.
</details>

<details><summary>What's the difference between <code>await a(); await b();</code> and <code>await Promise.all([a(), b()])</code>?</summary>

The first is sequential: `b` doesn't start until `a` has finished, so the total time is a + b. With `Promise.all`, both start at once and you wait for the slower one, so the total time is about max(a, b). Use sequential `await` only when the second call needs the first one's result.
</details>

<details><summary>Why is <code>items.sort(...)</code> risky in a React component, and what do you write instead?</summary>

`sort` mutates the array in place. If `items` is state or props, you've changed React's data without telling it. Sort a copy instead: `[...items].sort((a, b) => a.price - b.price)` (or `toSorted` in ES2023+). Also, without a compare function `sort` compares as strings, so `[10, 9, 100]` comes out as `[10, 100, 9]`.
</details>
