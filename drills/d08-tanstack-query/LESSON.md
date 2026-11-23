---
id: d08
module: ACSD
kind: drill
title: TanStack Query - caching, staleTime and invalidateQueries
difficulty: 3
timeMinutes: 30
mock: [A11, A15, B6, C4, D4]
tasks:
  - { name: "useProducts: useQuery with queryKey, queryFn and staleTime", tests: [1, 2, 3] }
  - { name: 'useUpdateProduct: useMutation that invalidates ["products"] on success', tests: [6] }
  - { name: "ProductList: pending / error / data states + a button that runs the mutation", tests: [4, 5, 7] }
---

# d08 · TanStack Query: caching, staleTime and invalidateQueries

> **Exam link:** **A11** *"What does the staleTime option in TanStack Query control?"* · **A15** *"What is the main purpose of the invalidateQueries() function?"* · **B6** *"TanStack Query is designed to help manage asynchronous server data, including caching and synchronisation"* (True) · **C4** *"After successfully updating a customer's profile... Write the TanStack Query function commonly used for this purpose and briefly explain what it does"* · **D4** the shopping app: *"Product information must be retrieved from an external API... should be cached... When a product is updated, the application should refresh... avoid unnecessary API requests"* (parts b and c are this drill; a and d are in d09). You pick options in A/B and write code plus 2–4 sentences in C4/D4.

The lectures barely cover this library, so this lesson is your main source. Read it once, do the drill, then come back to the viva questions.

## The idea

### 1. Server state is data you borrow, not data you own

Products, customers, orders: they live in a database on a server. Your app only holds a **copy**, and that copy can go out of date when someone else changes the server. That is **server state**. It needs things plain `useState` + `useEffect` don't give you: loading and error flags, a cache, no duplicate requests, and a way to refresh after a change.

TanStack Query does exactly that job: it **fetches, caches and keeps server data in sync** (that's why B6 is True). Your own `fetch` code stays in a service module; TanStack Query decides *when* to call it.

The app is wrapped once in a provider, usually in `main.tsx`:

```tsx
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}><App /></QueryClientProvider>
```

Docs: [TanStack Query overview](https://tanstack.com/query/latest/docs/framework/react/overview).

### 2. `useQuery` = key + function

```tsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["products"],      // the NAME of this cache entry
  queryFn: fetchProducts,      // HOW to get the data (a function returning a Promise)
});
```

- The **query key** is an array that names the data. Any component that asks for `["products"]` gets the **same cache entry**. If two components mount at once, there is still **one** request.
- Keys can carry parameters: `["products", id]` is a different entry for each id.
- `queryFn` is passed, not called: `fetchProducts`, not `fetchProducts()`.
- If `queryFn` **throws** (for example on `!res.ok`), the query goes into the error state.
- v5 names: `isPending` (no data yet), `isError`, `isSuccess`. Older tutorials say `isLoading` and use a different call style. Use the object form shown here.

### 3. Fresh vs stale, and `staleTime`

Cached data is either **fresh** (trust it, don't refetch) or **stale** (show it, but fetch a new copy when there's a reason to, such as a component mounting or the window regaining focus).

**`staleTime` controls how long cached data counts as fresh** (the A11 answer). The default is **0**: data is stale the moment it arrives, so every new component that mounts triggers a background refetch.

```tsx
useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 60_000 }); // fresh for 1 minute
```

With `staleTime: 60_000`, a product page opened 30 seconds after the list reuses the cache and sends **no** request. That is how you "avoid unnecessary API requests" (D4).

**`gcTime`** (default 5 minutes) is a different thing: how long an **unused** cache entry is kept in memory before it is thrown away. Don't mix the two up: `staleTime` = fresh or not; `gcTime` = kept or deleted.

Docs: [Important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), [Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching).

### 4. Changing data: `useMutation`

Reads use `useQuery`. Writes (POST, PUT, DELETE) use `useMutation`:

```tsx
const mutation = useMutation({ mutationFn: updateProduct });
mutation.mutate({ id: 1, name: "Kettle", price: 21 }); // runs updateProduct(...) once, when you say so
```

A mutation does **not** run on mount and does **not** cache anything. It just runs your function and gives you `isPending`, `isError`, `isSuccess` for that call.

### 5. After a change: `invalidateQueries`

After the PUT succeeds, the cached product list is **out of date**. Tell TanStack Query:

```tsx
const queryClient = useQueryClient();
useMutation({
  mutationFn: updateProduct,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
});
```

`invalidateQueries` **marks every matching cached query as stale** and **refetches the ones currently on screen (active)**. It works even inside the `staleTime` window: invalidating overrides "fresh". It does **not** delete the data, so the old list stays visible until the new one arrives. Matching is by prefix: `["products"]` also matches `["products", 7]`.

Docs: [Query invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation), [Invalidation from mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations).

### 6. Why this avoids unnecessary requests (D4b)

Put 3 and 5 together. The cache plus `staleTime` means components **share** one copy and **don't refetch** while it's fresh. `invalidateQueries` means you refetch **only when you know** the data changed, and only for the key that changed. So you get fewer requests, faster screens (cached data shows instantly), and data that is still correct after an update.

## Worked example

A different scenario: a library app that lists books and lets you add one. Same pattern, different names.

```tsx
// bookApi.ts: the service module (plain fetch, no React)
export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch("/api/books");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);   // throw -> isError in the component
  return res.json();
}
export async function addBook(book: NewBook): Promise<Book> {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// useBooks.ts
export function useBooks() {
  return useQuery({
    queryKey: ["books"],        // 1. the cache entry is called ["books"]
    queryFn: fetchBooks,        // 2. how to fill it
    staleTime: 5 * 60_000,      // 3. trust the cached list for 5 minutes
  });
}

// useAddBook.ts
export function useAddBook() {
  const queryClient = useQueryClient();                       // 4. the same client the Provider holds
  return useMutation({
    mutationFn: addBook,                                      // 5. what to run on mutate(...)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }), // 6. list is now out of date
  });
}

// BookList.tsx
export function BookList() {
  const { data, isPending, isError, error } = useBooks();
  const addBookMutation = useAddBook();

  if (isPending) return <p>Loading...</p>;                    // 7. first load, no data yet
  if (isError) return <p role="alert">{error.message}</p>;   // 8. queryFn threw
  return (
    <>
      <ul>{data.map((b) => <li key={b.id}>{b.title}</li>)}</ul>
      <button onClick={() => addBookMutation.mutate({ title: "Dune" })}>Add Dune</button>
    </>
  );
}
```

What happens when you click **Add Dune**:
1. `mutate` runs `addBook` → POST.
2. The POST succeeds → `onSuccess` → `invalidateQueries({ queryKey: ["books"] })`.
3. `["books"]` is marked stale. `BookList` is on screen, so its query is active and refetches (a GET), even though the 5-minute `staleTime` hasn't run out.
4. The new list, including Dune, replaces the old one.

## Your task

The shop from mock **D4**. `src/types.ts` (the `Product` interface) and `src/productApi.ts` (`fetchProducts` = GET `/api/products`, `updateProduct` = PUT `/api/products/:id`) are done for you. Read `productApi.ts` first.

1. Open `src/useProducts.ts`. Do **TODO d08-1**: `useQuery` with key `["products"]`, `fetchProducts`, and a `staleTime` of one minute.
2. Open `src/useUpdateProduct.ts`. Do **TODO d08-2**: `useMutation` with `updateProduct`, and on success invalidate `["products"]`.
3. Open `src/ProductList.tsx`. Do **TODO d08-3**: the loading, error and list states, plus a "+£1" button per product that calls `mutate`.
4. Run `npm test -- d08` until all 7 tests are green. Tests 1–3 need only TODO 1. Test 7 needs all three.
5. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write these on paper:
   - the `useQuery` call with `queryKey`, `queryFn` and `staleTime`
   - the `useMutation` call with `onSuccess` calling `queryClient.invalidateQueries({ queryKey: [...] })`
   - the C4 answer for a customer profile (see the viva questions)

## Hints

<details><summary>Hint 1: where do I start?</summary>

TODO d08-1 is one `return` statement:

```tsx
return useQuery({ queryKey: [...], queryFn: ..., staleTime: ... });
```

One minute is `60_000` (or `60 * 1000`) milliseconds. The underscore is just a digit separator.
</details>

<details><summary>Hint 2: test 3 says I made 2 requests</summary>

You're missing `staleTime`, or it's in seconds (`60`) instead of milliseconds. With the default `staleTime` of 0, a component that mounts later refetches.
</details>

<details><summary>Hint 3: where does queryClient come from?</summary>

Inside the hook, before `useMutation`: `const queryClient = useQueryClient();`. It returns the client the `QueryClientProvider` was given. Don't write `new QueryClient()` in a hook: that makes a second, empty cache.
</details>

<details><summary>Hint 4: invalidateQueries "does nothing"</summary>

v5 takes an **object**: `invalidateQueries({ queryKey: ["products"] })`. And the key must start with the same key as `useProducts` (`"products"`, not `"product"`): matching is by prefix, so `["products"]` also refreshes `["products", 7]`.
</details>

<details><summary>Hint 5: TypeScript says data might be undefined</summary>

Return early for `isPending` and `isError` first. After those two `if`s, TypeScript knows `data` is defined.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>What does the staleTime option in TanStack Query control? (A11)</summary>

How long cached query data is considered **fresh**. While it's fresh, TanStack Query serves it from the cache and does not refetch on mount or window focus. The default is 0, so data is stale immediately. Trap options: it has nothing to do with login sessions, component mounting time or form submissions.
</details>

<details><summary>What is the main purpose of invalidateQueries()? (A15)</summary>

To mark matching cached queries as stale (invalid) so they are refreshed: active queries refetch straight away, inactive ones refetch the next time they're used. It does not delete the API endpoint, disable requests or remove components, and it doesn't wipe the cached data either: the old data shows until the new data arrives.
</details>

<details><summary>C4: After successfully updating a customer's profile, the cached customer information must be refreshed. Write the function and explain it.</summary>

```ts
queryClient.invalidateQueries({ queryKey: ["customer"] });
```

Called in the mutation's `onSuccess`, it marks every cached query whose key starts with `["customer"]` as stale and refetches the ones currently in use. The screen then shows the updated profile from the server instead of the old cached copy.
</details>

<details><summary>D4b: Describe what query caching means in TanStack Query and how it benefits the application.</summary>

TanStack Query stores the result of each query in a cache under its query key (for example `["products"]`). Every component that uses the same key reads that one cached copy, and while it's fresh (`staleTime`) no new request is sent. This avoids unnecessary API requests, makes screens appear instantly with cached data, and keeps all components showing the same data.
</details>

<details><summary>D4c: How can the app make sure product information is refreshed after a successful update?</summary>

Send the update with `useMutation`, and in its `onSuccess` callback call `queryClient.invalidateQueries({ queryKey: ["products"] })`. This marks the cached product queries as stale and makes the active ones refetch, so the list shows the server's updated data. It only happens after the update succeeds, so a failed update doesn't trigger a pointless refetch.
</details>

<details><summary>True or false: "TanStack Query is designed to help manage asynchronous server data, including caching and synchronisation." (B6) And what's the difference between staleTime and gcTime?</summary>

**True.** That is exactly its job: fetching, caching and keeping server data in sync.

`staleTime` decides whether cached data is **fresh** (no refetch) or **stale** (refetch when there's a reason). `gcTime` (default 5 minutes) decides how long an **unused** cache entry is kept before it's deleted from memory. Stale data is still in the cache; garbage-collected data is gone.
</details>
