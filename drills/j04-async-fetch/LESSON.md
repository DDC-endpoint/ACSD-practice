---
id: j04
module: ACSD
kind: drill
title: Async, Promises and fetch
difficulty: 1
timeMinutes: 25
mock: [A5, A13, B5, C5, D2, D3]
tasks:
  - { name: "getEvent(id): fetch + check res.ok + return res.json()", tests: [1, 2] }
  - { name: "createEvent(data): POST with method, Content-Type header and JSON.stringify body", tests: [3, 4] }
  - { name: "deleteEvent(id): DELETE, 204 has no body so never call res.json()", tests: [5, 6] }
  - { name: "loadWithStatus: try / catch / finally with a loading flag", tests: [7, 8] }
  - { name: "toBody and parseSaved: JSON.stringify and JSON.parse", tests: [9] }
---

# j04 · Async, Promises and fetch

> **Exam link:** **D2** (10 marks): *"retrieve a list of courses from https://example.com/api/courses … display a loading message … an error message if the request fails"*. You write an `async` function with `try` / `catch` / `finally` and a `res.ok` check. **D3(b)**: *"Write a function that submits valid event data using the Fetch API and the POST method. Include appropriate request headers and JSON serialisation."* **A5 / B5 / C5 / A13**: the status codes (401 vs 403, 204 No Content). This drill is the plain-JavaScript warm-up for **d06** (fetch + `useEffect` + `AbortController`) and **d07** (POST/PUT forms). Do this one first.

## The idea

Try snippets yourself: open the browser DevTools console (F12 → Console) and paste them, or run `node` in a terminal. (`fetch` works in both. In the console, `await` works at the top level.)

### 1. A Promise is "a value that arrives later"

Some things take time: asking a server for data, reading a file. JavaScript doesn't freeze while it waits. It gives you a **Promise** straight away, and carries on with the next line. A Promise is in one of three states:

- **pending**: still waiting
- **fulfilled**: it worked, and now it holds a value
- **rejected**: it failed, and now it holds an error

Here is synchronous versus asynchronous in one picture:

```js
console.log("1: before");
setTimeout(() => console.log("3: later (after 1 second)"), 1000);
console.log("2: after");
// prints: 1: before, 2: after, 3: later
```

Line 2 doesn't wait for line 3. Slow work is started, then JavaScript moves on, then comes back when it's done. That's why `fetch` returns a Promise and not the data itself. [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

**In React you'll see this as:** a component shows "Loading…" first, then the data. The render doesn't wait for the server.

### 2. `async` and `await`

```js
async function loadNumber() {
  return 5;
}
const result = loadNumber();   // result is a Promise, NOT 5
const value = await result;    // 5
```

- An `async` function **always returns a Promise**, even if you `return 5`.
- `await somePromise` pauses *that function* until the Promise is fulfilled, and gives you the value. (It doesn't freeze the page.)
- You can only use `await` **inside an `async` function** (or at the top level of a module). Anywhere else it's a syntax error.
- If the awaited Promise is rejected, `await` **throws** the error. That's what `catch` is for.

```js
async function countEvents() {
  const events = await getEvents();   // wait for the list
  return events.length;               // the caller gets a Promise of a number
}
```

[MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) · [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

**In React you'll see this as:** you can't make a `useEffect` callback itself `async`. You define an `async function load()` **inside** it and call `load()`. (d06 covers that.)

### 3. `try` / `catch` / `finally`

```js
let loading = true;
try {
  const data = await load();      // if this throws, JS jumps to catch
  console.log("got", data);
} catch (err) {
  console.log("failed:", err.message);
} finally {
  loading = false;                // runs on success AND on failure
}
```

- `try`: the code that might fail.
- `catch (err)`: runs only if something threw. `err.message` is the text.
- `finally`: runs **every time**. It's the right place to switch off a loading flag, so a failed request doesn't leave "Loading…" on screen forever.

[MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

**In React you'll see this as:** `setLoading(true)` before, and `setLoading(false)` in `finally`. That's the D2 answer.

### 4. `fetch` and the big trap: it does NOT throw on 404 or 500

```js
const res = await fetch("/api/events");   // 1. wait for the response
console.log(res.ok);                      // true for status 200 to 299
console.log(res.status);                  // 200, 404, 500 ...
const data = await res.json();            // 2. wait for the body, parsed from JSON
```

`fetch` only **rejects** when there's no response at all (the network is down). A 404 or a 500 is still a "successful" fetch, because the server did answer. So you must check:

```js
if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);   // now catch will see it
}
```

Forget this line and your code happily does `res.json()` on an error page. There are **two awaits**: one for `fetch(...)`, one for `res.json()`. [MDN: Using fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)

**In React you'll see this as:** every fetch helper has the `if (!res.ok) throw …` line. Mock D2 awards a mark for it.

### 5. POST: send data to the server

```js
const res = await fetch("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

The second argument to `fetch` is an **options object** with three things:

- `method: "POST"`. The default is `GET`.
- `headers`: `Content-Type: application/json` tells the server "the body is JSON".
- `body`: **must be a string** (or similar), so you turn the object into JSON text with `JSON.stringify`. If you pass the object itself, JavaScript sends `"[object Object]"`.

**In React you'll see this as:** the submit handler of a form. d07 builds on exactly this.

### 6. `JSON.stringify` and `JSON.parse`

```js
const text = JSON.stringify({ title: "Quiz", isOpen: true });   // '{"title":"Quiz","isOpen":true}'  (a string)
const obj = JSON.parse(text);                                   // { title: "Quiz", isOpen: true }  (an object)
JSON.parse("not json");                                         // throws a SyntaxError
```

`stringify`: object → text. `parse`: text → object. `res.json()` is just "read the body, then `JSON.parse` it" (and it returns a Promise). Text is what travels over the network and what `localStorage` stores, which is why you convert. [MDN: JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

### 7. Status codes worth knowing (small table)

| Code | Meaning | What your code does |
|---|---|---|
| 200 | OK, with a body | `await res.json()` |
| 201 | Created (a POST worked) | `await res.json()` to get the new item |
| 204 | OK, **no body** | **don't** call `res.json()`, there's nothing to parse |
| 400 | Bad request (your data was invalid) | show the validation message |
| 401 | Not logged in | send to login |
| 403 | Logged in but not allowed | "no permission" |
| 404 | Not found | "not found" |
| 500 | Server broke | "try again later" |

d06 goes deeper on these.

## Worked example

A different scenario: a **student profile** from `/api/students`. Same pattern, new data.

```js
async function loadStudent(id, setLoading) {
  setLoading(true);                                      // 1
  try {
    const res = await fetch(`/api/students/${id}`);      // 2
    if (!res.ok) {                                       // 3
      throw new Error(`HTTP ${res.status}`);
    }
    const student = await res.json();                    // 4
    return { data: student, error: null };               // 5
  } catch (err) {
    return { data: null, error: err.message };           // 6
  } finally {
    setLoading(false);                                   // 7
  }
}

async function saveStudent(student) {
  const res = await fetch("/api/students", {
    method: "POST",                                      // 8
    headers: { "Content-Type": "application/json" },     // 9
    body: JSON.stringify(student),                       // 10
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();                               // the created student (201)
}
```

1. Turn the loading flag on before the slow work starts.
2. `await fetch(...)`: wait for the response. The URL is a template literal, so `id` is slotted in.
3. A 404 or 500 doesn't throw by itself, so we throw our own error.
4. Second await: read and parse the body.
5. Success: hand back the data and no error.
6. Failure (a network error **or** our `throw` above): hand back the message.
7. `finally` runs after the `return` in 5 or 6 and switches loading off either way.
8. to 10. The three parts of a POST. The body is a **string**.

## Your task

The CampusEvents server lives at `/api/events`. You write the small module that talks to it.

1. Open `src/eventsApi.js`. Read `getEvents` and `countEvents` (given) first. Then do `TODO j04-1` to `TODO j04-5`:
   - **TODO j04-1:** `getEvent(id)` fetches one event. Check `res.ok`.
   - **TODO j04-2:** `createEvent(data)` sends a POST with JSON.
   - **TODO j04-3:** `deleteEvent(id)` sends a DELETE. The server answers 204, so there's no body to parse.
   - **TODO j04-4:** `loadWithStatus(load, setLoading)` wraps a request in `try` / `catch` / `finally`.
   - **TODO j04-5:** `toBody(obj)` and `parseSaved(text)` convert to and from JSON text.
2. Run `npm test -- j04` until all 10 tests are green. (The tests use a fake `fetch`, so no network is needed.)
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the file and write these on paper:
   - an `async` function that fetches a URL, checks `res.ok`, and returns `await res.json()`
   - the POST call with `method`, `headers` and `body: JSON.stringify(...)`
   - `try` / `catch` / `finally` with `setLoading(false)` in the `finally`

## Hints

<details><summary>Hint 1: getEvent, where do I start?</summary>

Copy the shape of `getEvents` (given) and change the URL to `` `${BASE}/${id}` ``. The backticks and `${...}` are a template literal: they put `id` into the text.
</details>

<details><summary>Hint 2: test 2 says "promise resolved instead of rejecting"</summary>

You didn't check `res.ok`. `fetch` doesn't throw on a 404, so add ``if (!res.ok) { throw new Error(`HTTP ${res.status}`); }`` before you read the body. The test wants the message to contain `404`.
</details>

<details><summary>Hint 3: createEvent, what goes in the options?</summary>

Three keys: `method: "POST"`, `headers: { "Content-Type": "application/json" }`, and `body: JSON.stringify(data)`. The options object is the **second** argument: `fetch(BASE, { ... })`.
</details>

<details><summary>Hint 4: test 3 says the body is not a string</summary>

You passed `data` straight in. A body must be text: wrap it with `JSON.stringify(data)`.
</details>

<details><summary>Hint 5: deleteEvent, test 5 says json was called</summary>

A 204 means **No Content**. There's nothing to parse, and `res.json()` on an empty body would throw. After the `res.ok` check, just `return true;`.
</details>

<details><summary>Hint 6: loadWithStatus, the order of things</summary>

```js
setLoading(true);
try {
  const data = await load();
  return { data, error: null };
} catch (err) {
  return { data: null, error: err.message };
} finally {
  setLoading(false);
}
```
`finally` still runs even though `try` and `catch` already hit a `return`. Test 8 checks exactly that. Don't forget `await` on `load()`: without it, a rejected promise slips past your `catch`.
</details>

<details><summary>Hint 7: toBody and parseSaved</summary>

`toBody` is `return JSON.stringify(obj);`. For `parseSaved`, put `return JSON.parse(text);` inside `try`, and `return null;` inside `catch`.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>What is a Promise?</summary>

A Promise is an object that stands for a value that **arrives later**, such as the result of a network request. It starts **pending**, then becomes **fulfilled** (with a value) or **rejected** (with an error). You wait for it with `await` or `.then`.
</details>

<details><summary>Does <code>fetch</code> reject when the server returns a 404 or 500? How do you handle that?</summary>

No. `fetch` only rejects if no response arrives at all (for example, the network is down). A 404 or 500 still resolves, with `res.ok` set to `false`. So you check ``if (!res.ok) throw new Error(`HTTP ${res.status}`)`` yourself, so that your `catch` can show an error message.
</details>

<details><summary>Write a function that submits valid event data using the Fetch API and the POST method, with headers and JSON serialisation.</summary>

```js
async function createEvent(event) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
```
`method: "POST"` says this is a create, the `Content-Type` header tells the server the body is JSON, and `JSON.stringify` turns the object into the text string that a body must be.
</details>

<details><summary>What does <code>finally</code> do, and why put <code>setLoading(false)</code> there?</summary>

`finally` runs after `try` / `catch` **whether or not an error was thrown**. Putting `setLoading(false)` there means the loading message always goes away, on success and on failure. If you put it only at the end of `try`, a failed request would leave "Loading…" on screen forever.
</details>

<details><summary>What does an <code>async</code> function return, and where can you use <code>await</code>?</summary>

An `async` function **always returns a Promise**, even if you write `return 5` (you get a Promise of 5). You can use `await` only **inside an `async` function** (or at the top level of a module). `await` pauses that function until the Promise settles and gives you its value.
</details>

<details><summary>What does an HTTP 204 mean, and what should the frontend do with the response?</summary>

**204 No Content**: the request succeeded but there's **no response body**. So don't call `res.json()` (there's nothing to parse and it would throw). Just treat it as success. It's what a DELETE usually returns.
</details>

<details><summary>Why do we use <code>JSON.stringify</code> on the body of a POST?</summary>

A request body must be text (a string), not a JavaScript object. `JSON.stringify(data)` converts the object into JSON text, and the `Content-Type: application/json` header tells the server how to read it. The server then does the reverse (like `JSON.parse`).
</details>
