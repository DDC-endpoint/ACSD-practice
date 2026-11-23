---
id: d02
module: ACSD
kind: drill
title: TypeScript types, interfaces and unions
difficulty: 1
timeMinutes: 25
mock: [A3, A8, A14, B2, B13, C2]
tasks:
  - { name: "write interface Product exactly as in C2 (description optional)", tests: [1] }
  - { name: "formatProduct: use the optional description, with a ?? fallback", tests: [2] }
  - { name: "type OrderStatus as a literal union + statusLabel switch", tests: [3, 4] }
  - { name: "type Id = string | number + narrow with typeof in formatId", tests: [5] }
  - { name: "type guard isProduct(x: unknown): x is Product for API data", tests: [6, 7] }
---

# d02 · TypeScript types, interfaces and unions

> **Exam link:** **C2**: *"Write a TypeScript interface named `Product` containing… id: number, name: string, price: number, description: optional string"*: four lines typed into a text box. **A3**: *"which keyword is used to define a custom type alias?"* → `type`. **A8**: *"what is the purpose of an interface?"* → to define the expected structure of an object. **A14**: *"a variable that can contain either a string or a number"* → `string | number` (the trap option is `string & number`). **B2**: interfaces can describe objects received from an API → **True**. **B13**: a union type lets a value be one of several types → **True**.

## The idea

TypeScript is JavaScript plus **types**: labels that say what shape a value has. The compiler (`tsc`) checks them before your code runs, then **deletes them**. Docs: [TypeScript handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 1. `interface`: the shape of an object

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;   // ? = optional: may be missing
}

const mug: Product = { id: 1, name: "Mug", price: 4.5 };        // ✔ description can be left out
const bad: Product = { id: 1, name: "Mug" };                    // ✘ compile error: price is missing
```

That's the C2 answer, word for word. Each line is `name: type;`. The `?` goes **after the property name**, not the type (`description?: string`, never `description: string?`).

An optional property has the type `string | undefined` when you read it, so handle the missing case:

```ts
const text = mug.description ?? "No description";   // ?? = "if it's null or undefined, use this instead"
```

### 2. `type`: a name for any type (A3)

```ts
type Price = number;
type OrderStatus = "pending" | "shipped" | "delivered";   // a literal union: ONLY these three strings
type Point = { x: number; y: number };                     // can describe objects too

let s: OrderStatus = "shipped";    // ✔
s = "lost";                        // ✘ compile error: not one of the three
```

**`interface` vs `type`:** both can describe an object, and in this module either is fine for that. Only `type` can name a union (`"a" | "b"`) or a primitive. `interface` is only for object shapes, and can be extended with `extends`. A rule of thumb: `interface` for objects (props, API data), `type` for unions. The keyword for a type **alias** is `type`.

### 3. Switching on a literal union

```ts
function statusColour(s: OrderStatus): string {
  switch (s) {
    case "pending":   return "grey";
    case "shipped":   return "blue";
    case "delivered": return "green";
  }
}
```

TypeScript knows these are the only three values, so it doesn't ask for a `default`. If you add `"cancelled"` to the union later, it complains that this function doesn't always return. That's the point: the compiler finds every place you forgot.

### 4. `|` (union) vs `&` (intersection): the A14 trap

```ts
type Id = string | number;          // EITHER a string OR a number
let a: Id = 42;     // ✔
a = "ab-12";        // ✔

type Impossible = string & number;  // BOTH a string AND a number at once → no value can be that → never
type Stocked = Product & { stock: number };   // & is for combining OBJECT types: all of Product's fields plus stock
```

- `|` = "one of these" (B13: a union type lets a value be one of several types).
- `&` = "all of these at once". It's useful for merging object types, but on two primitives it gives `never`.
- `string + number` and `string / number` aren't types at all.

### 5. Narrowing a union with `typeof`

With `Id = string | number`, you can only call methods that **both** have. Check which one you've got, and TypeScript narrows the type inside the `if`:

```ts
function show(id: Id): string {
  if (typeof id === "number") {
    return id.toFixed(0);       // here id is number
  }
  return id.toUpperCase();      // here id must be string
}
```

`typeof` gives `"string"`, `"number"`, `"boolean"`, `"object"` (for `null` too!), `"undefined"` or `"function"`. [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

### 6. Types vanish at runtime, so check API data

```ts
const res = await fetch("/api/products");
const data = (await res.json()) as Product[];   // "as" is a PROMISE to the compiler, not a check
```

`res.json()` returns whatever the server sent. The `as Product[]` only stops the compiler complaining; if the server sends `price: "4.50"` or leaves out `name`, nothing stops it at runtime. An interface **describes** what you expect from the API (B2: True). It doesn't **verify** it.

To actually check, write a **type guard**: a function that returns `boolean` at runtime and tells TypeScript `x is Product`:

```ts
function isPoint(x: unknown): x is Point {
  if (typeof x !== "object" || x === null) return false;   // typeof null is "object", so rule it out
  const p = x as Record<string, unknown>;
  return typeof p.x === "number" && typeof p.y === "number";
}

const pts = rawArray.filter(isPoint);   // type is Point[], and each item really was checked
```

`unknown` means "could be anything; prove it before you use it". It's the honest type for data from outside. Checking untrusted input is a security topic too: see **d10** (auth and security).

## Worked example

A different scenario: a library app.

```ts
interface Book {                 // the shape of one book
  isbn: string;
  title: string;
  pages: number;
  subtitle?: string;             // optional
}

type Loan = "available" | "on-loan" | "lost";    // literal union via a type alias
type Shelf = string | number;                    // "A3" or 12

function bookLine(b: Book): string {
  return `${b.title}${b.subtitle ? ": " + b.subtitle : ""} (${b.pages} pages)`;
}

function loanText(l: Loan): string {
  switch (l) {
    case "available": return "On the shelf";
    case "on-loan":   return "Borrowed";
    case "lost":      return "Missing";
  }
}

function shelfLabel(s: Shelf): string {
  return typeof s === "number" ? `Shelf ${s}` : s.toUpperCase();   // narrowed in each branch
}

function isBook(x: unknown): x is Book {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return typeof b.isbn === "string" && typeof b.title === "string" && typeof b.pages === "number"
    && (b.subtitle === undefined || typeof b.subtitle === "string");
}
```

- `subtitle?` is optional, so `bookLine` checks it before using it.
- `loanText` has no `default`, because the union lists every possible value.
- `isBook` checks each required field's **runtime** type, and allows the optional one to be missing.

## Your task

1. Open `src/product.ts`:
   - **TODO d02-1:** complete `interface Product` exactly as C2 asks. Two fields are there as a placeholder; add `price` and the **optional** `description`.
   - **TODO d02-2:** `formatProduct(p)` returns `"Mug - £4.50 - Holds 350ml"`, or `"Pen - £1.00 - No description"` when there's no description.
2. Open `src/order.ts`. **TODO d02-3:** replace the placeholder `string` with the literal union, then write `statusLabel` with a `switch`.
3. Open `src/ids.ts`. **TODO d02-4:** replace the placeholder `unknown` with `string | number`, then narrow with `typeof` in `formatId`.
4. Back in `src/product.ts`. **TODO d02-5:** write the type guard `isProduct`. `productsFrom` (given) uses it to clean up an API body.
5. Run `npm test -- d02` until all 7 tests are green, and run `npm run typecheck`: TypeScript checks types, the tests can't. (Tests 1, 3 and 5 read your source as text, because types don't exist at runtime.)
6. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write on paper:
   - the C2 `interface Product` with the optional `description`
   - `type OrderStatus = "pending" | "shipped" | "delivered";`
   - a function that takes `string | number` and narrows it with `typeof`

## Hints

<details><summary>Hint 1: where do I start?</summary>

TODO d02-1 first. Until `price` is in the interface, `p.price` in `formatProduct` is a compile error ("Property 'price' does not exist on type 'Product'"). Inside an interface each line is `name: type;`, and an optional one is `name?: type;`.
</details>

<details><summary>Hint 2: test 2, formatting the price</summary>

`(4.5).toFixed(2)` is `"4.50"`. Build the string with a template literal (backticks) and use `p.description ?? "No description"` for the last part.
</details>

<details><summary>Hint 3: test 3 or test 5 fail, but my code works</summary>

Those tests read your **source** and look for `type OrderStatus = ...;` and `type Id = ...;` ending in a semicolon. String literals in the union need quotes: `"pending"`, not `pending` (which would mean a type named pending).
</details>

<details><summary>Hint 4: <code>id.trim()</code> is a compile error in formatId</summary>

On `string | number` you can only use what both types have, and numbers don't have `trim`. Handle the number case first with `if (typeof id === "number") return ...;`. After that, TypeScript knows `id` is a string.
</details>

<details><summary>Hint 5: isProduct (nearly the answer)</summary>

```ts
if (typeof x !== "object" || x === null) return false;
const p = x as Record<string, unknown>;
return typeof p.id === "number" && typeof p.name === "string" && typeof p.price === "number"
  && (p.description === undefined || typeof p.description === "string");
```
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Write a TypeScript interface named <code>Product</code> with id (number), name (string), price (number) and an optional description (string).</summary>

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}
```
The `?` after `description` makes it optional, so a `Product` without a description is still valid.
</details>

<details><summary>What is the purpose of an interface in TypeScript? Can one describe data received from an API?</summary>

An interface defines the expected structure of an object: its property names and their types. The compiler then checks that code uses objects of that shape correctly. Yes, it's commonly used to describe API responses (B2 is True), but it's only checked at compile time, so the actual JSON should still be validated at runtime.
</details>

<details><summary>Which keyword defines a custom type alias? Give an example with a union.</summary>

`type`. For example `type OrderStatus = "pending" | "shipped" | "delivered";` means a variable of type `OrderStatus` can only hold one of those three strings.
</details>

<details><summary>Which type would you use for a variable that holds either a string or a number, and why not <code>string &amp; number</code>?</summary>

`string | number`, a union: the value is one **or** the other. `string & number` is an intersection: the value would have to be both at once, which is impossible, so the type is `never`. To use the value, narrow it with `typeof id === "number"`.
</details>

<details><summary>True or false: a union type allows a value to belong to one of several specified types.</summary>

**True.** `A | B` accepts any value of type A or of type B. Before using type-specific methods, you narrow it (for example with `typeof` or by checking a literal value in a `switch`).
</details>

<details><summary>If you write <code>const data = (await res.json()) as Product[];</code>, is the data checked to be Products?</summary>

No. Types are removed when TypeScript compiles to JavaScript, and `as` just tells the compiler to trust you. If the server sends a missing or wrong-typed field, it slips through. To be safe, treat the body as `unknown` and check it with a type guard like `isProduct(x: unknown): x is Product` before using it.
</details>
