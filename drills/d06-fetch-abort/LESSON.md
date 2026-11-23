---
id: d06
module: ACSD
kind: drill
title: Fetch, AbortController and status codes
difficulty: 2
timeMinutes: 30
mock: [A5, A13, A19, B5, C5, D2]
tasks:
  - { name: "messageFor: a message per status (401 sign in, 403 permission, 404, 500)", tests: [2, 3] }
  - { name: "getCourses(signal): fetch + res.ok check + ApiError", tests: [1, 2, 3] }
  - { name: "deleteCourse(id): DELETE, 204 is success, no res.json()", tests: [4] }
  - { name: "useCourses: useEffect + AbortController, ignore AbortError", tests: [5, 6, 7, 8] }
  - { name: "CourseCount: Loading… / error / N courses", tests: [5, 6] }
---

# d06 · Fetch, AbortController and status codes

> **Exam link:** **D2** (10 marks): *"retrieve a list of courses from https://example.com/api/courses … display a loading message … an error message if the request fails … the number of courses … avoid updating component state after the component has been unmounted"*. Part (a) asks why API calls are async, (b) asks you to write the Hook or component, and (c) asks why a service module helps. **C5**: *"Explain the difference between an HTTP 401 Unauthorized response and a 403 Forbidden response from the perspective of a frontend application."* MCQ/TF: **A5** (which code means "not authenticated"), **A13** (what 204 No Content means), **A19** (why a service module), **B5** (403 = no permission).

## The idea

### 1. API calls are asynchronous

A request goes over the network, and the answer might take 50 ms or 5 s. JavaScript runs your UI on **one thread**, so it can't sit and wait: the page would freeze. `fetch` returns a **Promise** straight away, and `await` pauses only your `async` function, not the page.

```ts
async function getCourses(): Promise<Course[]> {
  const res = await fetch("https://example.com/api/courses"); // wait for the response headers
  return await res.json();                                     // wait for the body, parse JSON
}
```

Docs: [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

### 2. `fetch` does NOT throw on 404 or 500: check `res.ok`

`fetch` only rejects when there's no response at all (network down, or the request was aborted). A 401, 403, 404 or 500 still **resolves**. You have to check:

```ts
if (!res.ok) {                       // ok is true for 200–299 only
  throw new ApiError(res.status, messageFor(res.status));
}
```

`ApiError` is just an `Error` that also carries `status`, so the UI can react differently to 401 and 403. The module's own `src/services/api.ts` does exactly this. Docs: [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok).

### 3. Status codes you must know

| Code | Name | Meaning | What the frontend does |
|---|---|---|---|
| 200 | OK | Success, with a body | `await res.json()` |
| 201 | Created | A POST made a new resource | read the new item (it has the server's id) |
| 204 | No Content | Success, **no body** | don't call `res.json()`: there's nothing to parse |
| 400 | Bad Request | Your data was invalid | show the validation message |
| 401 | Unauthorized | **Not authenticated**: no token, or it expired | send to login, or refresh the token |
| 403 | Forbidden | Authenticated, but **not allowed** | show "you don't have permission". Don't re-login |
| 404 | Not Found | No such resource | show "not found" |
| 500 | Internal Server Error | The server broke | "try again later" |

**401 vs 403 (C5):** 401 means "I don't know who you are", so logging in (or refreshing the token) can fix it. 403 means "I know who you are, and the answer is no", so logging in again won't help: show a forbidden message. The name "Unauthorized" is misleading. It really means *unauthenticated*, and that's the A5 trap. Docs: [MDN: HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

### 4. Put the API calls in a service module

```ts
// courseService.ts
export async function getCourses(signal?: AbortSignal) { ... }
export async function deleteCourse(id: number) { ... }
```

Components call `getCourses()` and never see a URL. That **separates data access from presentation** (A19): the URL, headers, `res.ok` check and error messages live in one place. If five components need courses, they share one function, and a change to the endpoint or auth header is one edit (D2c). It's also easy to stub in tests.

### 5. `AbortController`: cancel the request when the component goes away

```ts
useEffect(() => {
  const controller = new AbortController();
  getCourses(controller.signal).then(...).catch(...);
  return () => controller.abort();     // cleanup: runs on unmount
}, []);
```

- `controller.signal` goes into `fetch(url, { signal })`.
- `controller.abort()` cancels the request, and `fetch` rejects with an error whose `name` is `"AbortError"`.
- In your `catch`, **ignore** that error (`if (controller.signal.aborted) return;`). We cancelled it on purpose, and the component is gone, so we mustn't call `setError` or `setLoading`.

In development, React's `<StrictMode>` mounts, unmounts and re-mounts every component, so your effect runs twice and the first request is aborted. If you don't ignore `AbortError`, you'll see a bogus error on screen. Docs: [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), [react.dev: Fetching data in Effects](https://react.dev/learn/synchronizing-with-effects#fetching-data).

## Worked example

A different scenario: show **one student's name**, loaded from `/api/students/:id`. Same pattern, so copy the shape, not the answer.

```tsx
// studentService.ts
export async function getStudent(id: number, signal?: AbortSignal): Promise<Student> {
  const res = await fetch(`/api/students/${id}`, { signal });   // 1. pass the signal through
  if (!res.ok) throw new ApiError(res.status, messageFor(res.status)); // 2. 4xx/5xx don't throw by themselves
  return (await res.json()) as Student;                         // 3. 200: parse the body
}

// useStudent.ts
export function useStudent(id: number) {
  const [student, setStudent] = useState<Student | null>(null);  // the data
  const [loading, setLoading] = useState(true);                  // in progress?
  const [error, setError] = useState<string | null>(null);       // what went wrong

  useEffect(() => {
    const controller = new AbortController();                    // 4. one controller per run

    async function load() {
      try {
        const data = await getStudent(id, controller.signal);
        setStudent(data);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;                   // 5. we cancelled it: say nothing
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      }
    }

    load();                                                      // 6. useEffect can't be async itself
    return () => controller.abort();                             // 7. cleanup: unmount or id changes
  }, [id]);                                                      // 8. re-run when id changes

  return { student, loading, error };
}

// StudentName.tsx
export function StudentName({ id }: { id: number }) {
  const { student, loading, error } = useStudent(id);
  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return <p>{student?.name}</p>;
}
```

Line 6 matters: `useEffect(async () => ...)` is wrong, because an `async` function returns a Promise and React expects the effect to return a cleanup function (or nothing). Define an `async` function inside and call it.

## Your task

The D2 scenario: count the courses at `https://example.com/api/courses`.

1. Open `src/courseService.ts`:
   - **TODO d06-1 `messageFor(status)`**: 401 → sign in, 403 → permission (and *not* "sign in"), 404 → not found, 500 → server error.
   - **TODO d06-2 `getCourses(signal?)`**: `fetch` with the signal, check `res.ok`, throw an `ApiError`, return the JSON.
   - **TODO d06-3 `deleteCourse(id)`**: `DELETE`. A 204 is success, and you must **not** call `res.json()`.
2. Open `src/useCourses.ts`. **TODO d06-4**: the `useEffect` with an `AbortController`, aborting in the cleanup and ignoring the abort in `catch`.
3. Open `src/CourseCount.tsx`. **TODO d06-5**: `Loading…`, the error, or `N courses`.
4. Run `npm test -- d06` until all 8 are green. Tests 1–4 are the service, 5–6 the component, and 7–8 the abort.
5. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and, on paper, write the whole of D2(b): the three `useState`s, the `useEffect` with `AbortController`, the `res.ok` check and the three-way render. Then write two sentences on 401 vs 403.

## Hints

<details><summary>Hint 1: where do I start?</summary>

Start with the service. Test 1 only needs `getCourses` to call `fetch` and return `await res.json()`. Then add the `if (!res.ok) throw new ApiError(...)` line and `messageFor` for tests 2–3.
</details>

<details><summary>Hint 2: test 4 fails with "Unexpected end of JSON input"</summary>

You called `res.json()` on a 204. There is no body. After the `res.ok` check, just let the function end: an `async` function with no `return` resolves to `undefined`, which is what `Promise<void>` wants.
</details>

<details><summary>Hint 3: test 7 says fetch was called with no signal, or the signal isn't aborted</summary>

Create the controller **inside** the effect, pass `controller.signal` to `getCourses`, and **return** `() => controller.abort()` from the effect. Forgetting the `return` is the usual mistake: the arrow is created but React never gets it.
</details>

<details><summary>Hint 4: test 8 shows an error instead of "3 courses"</summary>

StrictMode ran your effect twice and aborted the first request. Its `AbortError` reached your `catch`, and you called `setError`. Add `if (controller.signal.aborted) return;` as the first line of the `catch`.
</details>

<details><summary>Hint 5: the effect (nearly the answer)</summary>

```ts
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    try {
      setCourses(await getCourses(controller.signal));
      setLoading(false);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }
  load();
  return () => controller.abort();
}, []);
```
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Why is an asynchronous operation needed when calling an external API? (D2a)</summary>

The request travels over the network, so the response takes an unknown amount of time. JavaScript runs the UI on a single thread, so waiting synchronously would freeze the page. `fetch` returns a Promise instead, and `async/await` lets the code wait for the result without blocking rendering or user input.
</details>

<details><summary>Explain the difference between 401 and 403 from the frontend's point of view. (C5)</summary>

401 Unauthorized means the user is **not authenticated**: there's no token, or it's invalid or expired. The frontend should send them to the login page or try a token refresh. 403 Forbidden means the user **is** authenticated but doesn't have permission for this resource, so logging in again won't help. The frontend should show a "you don't have permission" message (and hide that action).
</details>

<details><summary>What does 204 No Content mean, and what must the frontend not do with it? (A13)</summary>

The request succeeded, but the server sends no response body. It's typical for DELETE and some PUTs. The frontend treats it as success and must not call `res.json()`, because parsing an empty body throws "Unexpected end of JSON input".
</details>

<details><summary>Why put API calls in a service module when several components use the same endpoint? (A19, D2c)</summary>

It separates data-access logic from presentation: components ask for `getCourses()` and only deal with rendering. The URL, headers (such as the auth token), the `res.ok` check and the error messages are written once, so there's no duplication. A change to the endpoint is one edit, and the function is easy to reuse and to mock in tests.
</details>

<details><summary>How do you avoid updating state after the component unmounts? (D2b)</summary>

Create an `AbortController` inside `useEffect`, pass `controller.signal` to `fetch`, and return `() => controller.abort()` as the cleanup. On unmount React runs the cleanup, so the request is cancelled and `fetch` rejects with an `AbortError`. In the `catch`, return early when `controller.signal.aborted` (or `err.name === "AbortError"`) so no `setState` runs.
</details>

<details><summary>True or false: <code>fetch</code> rejects its Promise when the server returns 404 or 500.</summary>

**False.** That's the MCQ trap. `fetch` only rejects on a network failure or an abort. A 404 or 500 is still a response, so the Promise resolves with `res.ok === false`, and you must check `res.ok` (or `res.status`) and throw yourself.
</details>
