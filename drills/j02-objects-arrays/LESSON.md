---
id: j02
module: ACSD
kind: drill
title: Objects, arrays, destructuring and spread
difficulty: 1
timeMinutes: 25
mock: []
tasks:
  - { name: "spread to copy an event and change one field (bookSeat, renameEvent)", tests: [1, 2] }
  - { name: "spread and filter to add or remove an item in a list without mutating", tests: [3, 4] }
  - { name: "destructure in the parameters, with a default, and use a template literal", tests: [5] }
  - { name: "optional chaining ?. and nullish ??, and why not ||", tests: [6, 7] }
  - { name: "rest in destructuring: drop the password", tests: [8] }
  - { name: "array destructuring, and bracket access with a variable key", tests: [9, 10] }
---

# j02 · Objects, arrays, destructuring and spread

> **Exam link:** The ICT is React + TypeScript, and every React state update is written with the tools in this drill. `const [count, setCount] = useState(0)` is array destructuring. `function Card({ title, date })` is destructuring in the parameters. `setEvents([...events, newEvent])` and `setEvent({ ...event, booked: event.booked + 1 })` are spread. You will read these lines in multiple-choice questions and type them into code boxes (d03 and d09 use them all the time).

## The idea

To try any snippet yourself: open the browser DevTools console (F12, then Console) and paste it, or run `node` in a terminal and paste it there.

### 1. Object and array literals, dot vs bracket access

An **object** is a bag of named values. An **array** is a numbered list. You write them with `{ }` and `[ ]`.

```js
const event = { id: 1, title: "Hack Night", capacity: 50, booked: 10 };
const tags = ["tech", "free", "evening"];

event.title;        // "Hack Night"   dot: you type the name
tags[0];            // "tech"         arrays count from 0
tags.length;        // 3

const key = "capacity";
event[key];         // 50   brackets: the name is held in a variable
event.key;          // undefined   looks for a property literally called "key"
```

Use a dot when you know the name as you type. Use brackets when the name is in a variable (or has a space or dash in it). If a property doesn't exist you get `undefined`, not an error. [MDN: property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)

**In React you'll see this as:** `event.title` inside JSX, and `values[name]` in a form handler where `name` is the input's name.

### 2. Destructuring: pull values out into variables

**Destructuring** is a shortcut for copying properties or items into variables of their own.

```js
// objects: match by NAME
const { title, capacity = 0, id: eventId } = event;
// title = "Hack Night"
// capacity = 50 (the "= 0" is a DEFAULT, used only if event.capacity is undefined)
// id: eventId  means "take event.id and call the variable eventId" (renaming)

// arrays: match by POSITION
const [first, second] = tags;      // first = "tech", second = "free"
```

It also works right in a function's parameters, so you don't need `props.title` everywhere:

```js
function describe({ title, date, venue = "TBC" }) {
  return title + " at " + venue;
}
describe({ title: "Quiz", date: "2026-12-02" });   // "Quiz at TBC"
```

[MDN: destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

**In React you'll see this as:** `function Card({ title, date }) { ... }` (the props object, destructured) and `const [count, setCount] = useState(0);` (`useState` returns an array of two things: the value and a function to change it, and you name them by position).

### 3. Spread `...`: copy and change without mutating

**Mutating** means changing an object or array that already exists (`event.booked++`, `list.push(x)`). **Spread** `...` copies everything out of an object or array into a new one, so you can change the copy and leave the original alone.

```js
const event = { id: 1, title: "Hack Night", booked: 10 };

const booked = { ...event, booked: event.booked + 1 };
// { id: 1, title: "Hack Night", booked: 11 }   a NEW object. event is still booked: 10.
// Order matters: the later booked: ... overrides the copied one.

const list = [1, 2, 3];
const longer = [...list, 4];                  // [1, 2, 3, 4]   new array (list.push(4) would change list)
const without2 = list.filter((n) => n !== 2); // [1, 3]         new array (list.splice would change list)
```

**Why this matters (the key React idea):** React decides whether to re-render by checking whether the state is a **new** object or array. If you change the old one in place (`event.booked++; setEvent(event)`), it's the *same* object, so React thinks nothing changed and the screen doesn't update. So **every state update is written as "make a new copy with the change"**.

Spread is **shallow**: it copies one level. Fine for flat objects like an event. [MDN: spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

**In React you'll see this as:** `setEvent({ ...event, booked: event.booked + 1 })`, `setEvents([...events, newEvent])`, `setEvents(events.filter((e) => e.id !== id))`.

### 4. Rest `...`: "and the rest of them"

The same three dots, on the **left** side of `=` or in a parameter list, gather the leftovers.

```js
const user = { id: 7, name: "Sam", password: "hunter2" };
const { password, ...safeUser } = user;
// safeUser = { id: 7, name: "Sam" }   everything except password

const [head, ...others] = [1, 2, 3, 4];   // head = 1, others = [2, 3, 4]
function total(...nums) { return nums.length; }   // total(5, 6, 7) -> 3
```

Easy way to remember: on the right-hand side it **spreads out** a value; on the left it **gathers up** the rest. [MDN: rest](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

### 5. Template literals: strings with values inside

Use backticks `` ` `` (not quotes) and put any expression in `${ }`.

```js
const booked = 10, capacity = 50;
`${booked} of ${capacity} seats taken`;   // "10 of 50 seats taken"
`Left: ${capacity - booked}`;             // "Left: 40"   any expression works
```

[MDN: template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

**In React you'll see this as:** `` className={`card ${isOpen ? "open" : "closed"}`} `` and `` `/events/${id}` `` for URLs.

### 6. `?.` and `??`: missing values without crashes

Reading a property of `undefined` throws a `TypeError`. **Optional chaining** `?.` stops and gives `undefined` instead. **Nullish coalescing** `??` gives a fallback only when the left side is `null` or `undefined`.

```js
const event = { title: "Quiz" };       // no organiser
event.organiser.email;                  // TypeError: cannot read properties of undefined
event.organiser?.email;                 // undefined   (safe)
event.organiser?.email ?? "no contact"; // "no contact"
```

**`??` vs `||`:** `||` gives the fallback for **any falsy** value (`0`, `""`, `false`, `null`, `undefined`). `??` only for `null`/`undefined`.

```js
0 || 10;      // 10   wrong if 0 is a real answer
0 ?? 10;      // 0    correct: 0 is a real value, kept
"" ?? "n/a";  // ""
```

So for a number like `capacity` (0 means sold out), use `??`. [MDN: ?.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), [MDN: ??](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

**In React you'll see this as:** `user?.name ?? "Guest"` while data is still loading.

## Worked example

A different scenario: a **playlist** app. Same tools, new data.

```js
const track = { id: 3, name: "Intro", plays: 8, artist: { name: "Ana" } };
let playlist = [track];

// copy and change (no mutation)
const played = { ...track, plays: track.plays + 1 };       // new object, plays: 9
playlist = [...playlist, { id: 4, name: "Outro", plays: 0 }];   // new array with 2 tracks
playlist = playlist.filter((t) => t.id !== 3);              // new array, track 3 gone

// destructure with a default and a rename
const { name, plays = 0, id: trackId } = track;             // "Intro", 8, 3
const [firstTrack, secondTrack] = playlist;                 // firstTrack is the Outro

// rest: everything except artist
const { artist, ...plain } = track;                         // plain = { id: 3, name: "Intro", plays: 8 }

// template literal, ?. and ??
const line = `${name} by ${track.artist?.name ?? "unknown"} (${plays} plays)`;
// "Intro by Ana (8 plays)"
```

- `{ ...track, plays: ... }` copies all of `track`, then replaces `plays`. The original `track` still says 8.
- `[...playlist, newTrack]` is the "append without push" move. `filter` is the "remove without splice" move.
- `id: trackId` renames, so you don't clash with another `id` already in scope.
- `{ artist, ...plain }` pulls `artist` out; `plain` holds the rest. That's the pattern for dropping a field.

## Your task

A set of small helper functions for CampusEvents (events, a user, a list of events).

1. Open `src/events.js`. Do `TODO j02-1` to `TODO j02-6`:
   - **TODO j02-1:** `bookSeat` and `renameEvent` return a **copy** with one field changed (spread).
   - **TODO j02-2:** `addEvent` and `removeEvent` return a **new array** (spread, `filter`).
   - **TODO j02-3:** `summary` destructures its parameter and builds a template literal.
   - **TODO j02-4:** `organiserEmail` (`?.` then `??`) and `capacityOf` (`??`, not `||`).
   - **TODO j02-5:** `publicUser` drops `password` with rest.
   - **TODO j02-6:** `firstTwo` (array destructuring) and `getField` (bracket access).
2. Run `npm test -- j02` until all 10 tests are green. The copy tests check that the input was **not** changed and that you returned a **new** object or array.
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the file and write these on paper:
   - `setEvent({ ...event, booked: event.booked + 1 })`
   - `setEvents([...events, newEvent])` and `setEvents(events.filter((e) => e.id !== id))`
   - `const [count, setCount] = useState(0)` and `function Card({ title, date }) { ... }`
   - `0 || 10` vs `0 ?? 10`

## Hints

<details><summary>Hint 1: where do I start (TODO j02-1)?</summary>

Start with test 1. Don't change `event` at all. Write a brand-new object that begins with `...event` (that copies every field) and then name the field you want different: `{ ...event, booked: ??? }`. Put the new value after the spread so it wins.
</details>

<details><summary>Hint 2: test 1 says the original changed, or "expected not to be the same object"</summary>

You wrote `event.booked++` or `event.booked = ...`, or returned `event` itself. Both change or reuse the original. Return `{ ...event, booked: event.booked + 1 }`. For `renameEvent`, the field is `title`, and you can write just `title` instead of `title: title`.
</details>

<details><summary>Hint 3: adding and removing (TODO j02-2)</summary>

Adding: `[...list, event]` (all the old items, then the new one). Don't use `list.push`; it changes `list` and returns a number, not an array.

Removing: `filter` keeps the items for which the callback returns `true`, so keep everything whose id is **not** the one to remove: `list.filter((e) => e.id !== id)`.
</details>

<details><summary>Hint 4: summary (TODO j02-3)</summary>

The parameters are already destructured for you, so `title`, `date` and `venue` are just variables. Use backticks and `${ }`:
`` return `${title} on ${date} at ${venue}`; ``. The `venue = "TBC"` default is already in the parameter list, so the missing-venue case works with no extra code.
</details>

<details><summary>Hint 5: test 6 throws "Cannot read properties of undefined"</summary>

`event.organiser.email` crashes when there is no organiser. Put `?.` before the dot: `event.organiser?.email`. That gives `undefined` when `organiser` is missing. Then add `?? "no contact"` after it.
</details>

<details><summary>Hint 6: test 7 says expected 100 to be 0</summary>

You used `||`. `0 || 100` is `100` because `0` is falsy. Use `??`, which only replaces `null` and `undefined`: `event.capacity ?? 100`.
</details>

<details><summary>Hint 7: publicUser (TODO j02-5)</summary>

```js
const { password, ...safeUser } = user;
return safeUser;
```
`password` is pulled out and then unused. That's fine here; it's how you remove a field without touching `user`. Don't use `delete user.password`, which changes the original.
</details>

<details><summary>Hint 8: firstTwo and getField (TODO j02-6)</summary>

`const [first, second] = list;` then `return { first, second };` (`{ first, second }` is short for `{ first: first, second: second }`).

For `getField`, the name is in the variable `key`, so use brackets with no quotes: `event[key]`. `event.key` would look for a property called "key".
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Why do you write <code>setEvents([...events, newEvent])</code> instead of <code>events.push(newEvent)</code> in React?</summary>

`push` changes the existing array, so React sees the same array reference and may not re-render. The spread version creates a **new** array, which React detects as a change. React state must be treated as read-only and replaced with a new value.
</details>

<details><summary>Write a line that updates <code>event</code> state so <code>booked</code> goes up by one without mutating it.</summary>

```js
setEvent({ ...event, booked: event.booked + 1 });
```
The spread copies the other fields into a new object and `booked` overrides the copied value.
</details>

<details><summary>What does <code>const [count, setCount] = useState(0)</code> do?</summary>

`useState(0)` returns an array of two items: the current value and a function to update it. Array destructuring names them by position, so `count` is the first (starting at 0) and `setCount` is the second. Calling `setCount(5)` stores a new value and re-renders.
</details>

<details><summary>What is the difference between <code>0 || 10</code> and <code>0 ?? 10</code>?</summary>

`0 || 10` is `10`, because `||` falls back for any falsy value, including `0`. `0 ?? 10` is `0`, because `??` only falls back for `null` or `undefined`. Use `??` when `0`, `""` or `false` are valid values.
</details>

<details><summary>What does <code>user?.name</code> do, and what happens if you write <code>user.name</code> when <code>user</code> is undefined?</summary>

`user?.name` returns `undefined` if `user` is `null` or `undefined`, instead of crashing. `user.name` throws `TypeError: Cannot read properties of undefined (reading 'name')`.
</details>

<details><summary>Explain <code>const { password, ...safeUser } = user;</code></summary>

It destructures `user`: `password` gets that property's value, and the rest operator `...safeUser` collects every other property into a new object. So `safeUser` is a copy of `user` without `password`, and `user` itself is unchanged.
</details>

<details><summary>When do you use <code>event[key]</code> instead of <code>event.title</code>?</summary>

Use brackets when the property name is held in a variable (`key = "title"`) or isn't a valid identifier. A dot always means the literal name, so `event.key` looks for a property called "key".
</details>
