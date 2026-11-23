---
id: d07
module: ACSD
kind: drill
title: Forms, validation and POST/PUT
difficulty: 2
timeMinutes: 30
mock: [A17, B9, B10, D3]
tasks:
  - { name: "validateEvent: name/location not blank, maxAttendees a positive integer", tests: [1, 2, 3] }
  - { name: "createEvent: POST /api/events with JSON header + JSON.stringify body, check res.ok", tests: [4, 5] }
  - { name: "updateEvent: PUT /api/events/:id", tests: [6] }
  - { name: "deleteEvent: DELETE /api/events/:id", tests: [6] }
  - { name: "EventForm: controlled inputs, preventDefault, per-field errors, submit only when valid", tests: [7, 8] }
---

# d07 · Forms, validation and POST/PUT

> **Exam link:** **D3** (10 marks): an event form with *"Event Name must not be empty … Location must not be empty … Maximum Attendees must be a positive integer"*. (a) *"Write a … validation function that checks all three requirements. It should return suitable validation errors"* (4). (b) *"Write a function that submits valid event data using the Fetch API and the POST method. Include appropriate request headers and JSON serialisation"* (3). (c) *"Explain the difference between POST and PUT"* (3). MCQ/TF: **A17** (blocking a badly formatted email → client-side validation), **B9** (*"Client-side validation guarantees that invalid data can never reach a server"*: **false**), **B10** (*"PUT can be used … when updating an existing resource"*: **true**).

## The idea

### 1. A validation function returns errors, not true/false

Return **one message per bad field**, so the form can show each message under its own input. An empty object means "valid".

```ts
type EventErrors = Partial<Record<"name" | "location" | "maxAttendees", string>>;

const errors: EventErrors = {};
if (input.name.trim() === "") errors.name = "Event name is required.";
// ...
return errors;                              // {} when everything is fine
```

`Partial<Record<K, string>>` reads as "an object that *may* have a string for each of these keys". `.trim()` matters: `"   "` is not a name.

### 2. "Positive integer" when the value is a string

An `<input>` always gives you a **string**, even with `type="number"`. Convert, then check:

```ts
const raw = String(input.maxAttendees).trim();
const n = Number(raw);
if (raw === "" || !Number.isInteger(n) || n <= 0) errors.maxAttendees = "...";
```

The traps: `Number("")` is `0` (not NaN), `Number("abc")` is `NaN`, and `Number.isInteger(NaN)` and `Number.isInteger(2.5)` are both `false`. `parseInt("2.5")` gives `2`, which would wrongly accept 2.5, so don't use it here. Docs: [MDN: Number.isInteger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger).

### 3. Sending JSON with fetch

```ts
const res = await fetch("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },  // tell the server the body is JSON
  body: JSON.stringify(data),                       // the body must be a string, not an object
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.json();                            // 201 Created: the new event, with its id
```

All three lines get marks in D3(b): the **method**, the **Content-Type header** and **`JSON.stringify`**. Then check `res.ok`, because `fetch` doesn't throw on a 400 (see d06). Docs: [MDN: Supplying request options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options).

### 4. POST vs PUT (and DELETE)

| | URL | Meaning | Who picks the id? | Repeat it twice? |
|---|---|---|---|---|
| `POST` | the **collection**: `/api/events` | create a new event | the **server** | two events (not idempotent) |
| `PUT` | the **item**: `/api/events/42` | replace/update event 42 | you already know it | same result (idempotent) |
| `DELETE` | the **item**: `/api/events/42` | remove event 42 | you already know it | still gone (idempotent) |

On the frontend: the "New event" page POSTs, and the "Edit event" page PUTs to that event's own URL. The module's `eventService.ts` does exactly this: `create` POSTs to `/events`, and `update` PUTs to `` `/events/${id}` ``. Docs: [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

### 5. A controlled form in React

```tsx
const [values, setValues] = useState({ name: "", location: "", maxAttendees: "" });

<input name="name" value={values.name} onChange={handleChange} />   // React owns the value

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();                   // otherwise the browser reloads the page
  const found = validateEvent(values);
  setErrors(found);
  if (Object.keys(found).length > 0) return;   // invalid: stop here
  onCreate(...);                        // valid: submit
}
```

"Controlled" means the input shows whatever is in state (`value=`) and every keystroke goes through `onChange` back into state. Docs: [react.dev: `<input>`, controlling an input with a state variable](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

### 6. Client-side validation is for UX, not security

Checking in the browser gives instant feedback and saves a pointless request (A17: that's how you block a badly formatted email). It **guarantees nothing** (B9 is false): anyone can turn off JavaScript, edit the code in DevTools, or send the request with `curl` or Postman. The **server must validate again** and answer 400 if the data is bad.

### What the module's code does

The CampusEvents `EventForm.tsx` doesn't hand-write `validateEvent`. It uses **react-hook-form** to manage the inputs and **zod** to describe the rules as a schema (`z.string().trim().min(2, "Enter a location.")`, `z.coerce.number().int().min(1, ...)`), connected with `zodResolver`. That's the same idea with less code: a schema in, per-field error messages out. The ICT asks you to write the function by hand, so that's what this drill practises. You don't need to memorise the zod API.

## Worked example

A different form: **sign up for a newsletter** with an email and an age. Copy the shape, not the answer.

```ts
type SignupErrors = Partial<Record<"email" | "age", string>>;

export function validateSignup(input: { email: string; age: string | number }): SignupErrors {
  const errors: SignupErrors = {};                                   // 1. start empty

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {      // 2. a simple email pattern
    errors.email = "Enter a valid email address.";
  }

  const raw = String(input.age).trim();                              // 3. the input gave a string
  const age = Number(raw);
  if (raw === "" || !Number.isInteger(age) || age < 13) {            // 4. whole number, 13 or over
    errors.age = "You must be 13 or older.";
  }

  return errors;                                                     // 5. {} means valid
}

export async function subscribe(data: { email: string; age: number }): Promise<void> {
  const res = await fetch("/api/subscriptions", {                    // 6. collection URL → POST
    method: "POST",
    headers: { "Content-Type": "application/json" },                 // 7. it's JSON
    body: JSON.stringify(data),                                      // 8. object → string
  });
  if (!res.ok) throw new Error(`Subscribe failed (HTTP ${res.status})`); // 9. 4xx/5xx don't throw
}
```

Line 4 checks the empty string first, because `Number("")` is `0`. Without that, an empty age would fail only by luck (here because `0 < 13`). In the event form the rule is `> 0`, so the luck runs out: `""` must be rejected on purpose.

## Your task

The D3 scenario: create a campus event.

1. Open `src/validateEvent.ts`. **TODO d07-1**: the three rules. Test 3 throws every nasty value at `maxAttendees`: `0`, `-3`, `2.5`, `""`, `"  "`, `"abc"`, `"2.5"`.
2. Open `src/eventService.ts`:
   - **TODO d07-2 `createEvent`**: `POST /api/events`, JSON header, `JSON.stringify` body, check `res.ok`, return the created event.
   - **TODO d07-3 `updateEvent`**: `PUT /api/events/${id}`.
   - **TODO d07-4 `deleteEvent`**: `DELETE /api/events/${id}`.
3. Open `src/EventForm.tsx`. **TODO d07-5**: the `<form>`, three controlled inputs with the labels listed in the TODO, an error `<p role="alert">` under each, and `handleSubmit` that calls `onCreate` only when valid.
4. Run `npm test -- d07` until all 8 are green.
5. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and, on paper, write D3(a) `validateEvent` and D3(b) `createEvent` in full. Then write three sentences on POST vs PUT.

## Hints

<details><summary>Hint 1: where do I start?</summary>

`validateEvent`. Start with `const errors: EventErrors = {};` and `return errors;`, and test 1 passes already. Then add one `if` per rule and watch tests 2 and 3.
</details>

<details><summary>Hint 2: test 3 fails "for """ or "for "2.5""</summary>

- `""` or `"  "`: trim first, then check `raw === ""` explicitly. Don't rely on `Number("")` being `0`.
- a number like `2.5` or `-3`: you probably called `.trim()` on it. Turn it into a string first: `String(input.maxAttendees).trim()`.
- `"2.5"`: you used `parseInt`, which chops it to `2`. Use `Number(raw)` with `Number.isInteger`.
</details>

<details><summary>Hint 3: test 4 says the body was an object, or the headers don't match</summary>

`body` must be `JSON.stringify(data)`, not `data`. And `headers` must be exactly `{ "Content-Type": "application/json" }`. The test compares the whole object, so a typo such as `"content-type": "json"` fails.
</details>

<details><summary>Hint 4: test 8 fails, onCreate got maxAttendees: "50"</summary>

The state holds the input's string. Convert when you build the object for `onCreate`: `maxAttendees: Number(values.maxAttendees)`, and trim the text fields.
</details>

<details><summary>Hint 5: createEvent (nearly the answer)</summary>

```ts
const res = await fetch(EVENTS_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
if (!res.ok) throw new Error(`Could not create the event (HTTP ${res.status}).`);
return (await res.json()) as EventRecord;
```
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Explain the difference between POST and PUT from the frontend's point of view. (D3c)</summary>

POST **creates** a new resource. The frontend sends it to the collection URL (`/api/events`) without an id, and the server assigns the id and usually replies 201 with the new item. PUT **updates/replaces** an existing resource at its own URL (`/api/events/42`), so the frontend already knows the id. PUT is idempotent (sending it twice leaves the same result), while sending the same POST twice creates two events.
</details>

<details><summary>True or false: client-side validation guarantees that invalid data can never reach the server. (B9)</summary>

**False.** Client-side validation is for user experience: instant feedback and fewer wasted requests. A user can bypass it by disabling JavaScript, editing the code, or calling the API directly with a tool like Postman. The server must validate every request again.
</details>

<details><summary>True or false: a frontend can use PUT to update an existing resource. (B10)</summary>

**True.** PUT to the resource's own URL, e.g. `PUT /api/events/42` with the updated data as a JSON body, is the standard way to update it.
</details>

<details><summary>Which headers and body do you need to POST JSON with fetch? (D3b)</summary>

`method: "POST"`, `headers: { "Content-Type": "application/json" }` so the server knows how to parse the body, and `body: JSON.stringify(data)`, because `fetch` sends a string, not a JS object. Then check `res.ok` and throw if it's false.
</details>

<details><summary>Why call <code>e.preventDefault()</code> in a form's submit handler?</summary>

By default, submitting an HTML form makes the browser send the data and **reload the page**, which wipes your React state. `preventDefault()` stops that, so your code can validate and send the request with `fetch` instead.
</details>

<details><summary>When validating a "positive integer" from a form, why check for an empty string before calling <code>Number(x)</code>?</summary>

An input's value is always a string, even for `type="number"`, and `Number("")` is `0`, not `NaN`. So a blank field would quietly become the number 0. It's rejected by `> 0` only by luck, and any rule like `>= 0` would accept it. Checking `x.trim() === ""` first makes "required" explicit.
</details>
