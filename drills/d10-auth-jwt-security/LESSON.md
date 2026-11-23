---
id: d10
module: ACSD
kind: drill
title: JWT, protected routes and front-end security
difficulty: 2
timeMinutes: 30
mock: [B15, E1, E2, E3, E4, E5]
tasks:
  - { name: "decodeJwtPayload: split, base64url-decode the middle part, null when malformed", tests: [1, 2] }
  - { name: "isTokenExpired: exp is in SECONDS, missing exp counts as expired", tests: [3, 4] }
  - { name: "hasRole: role claim as a string or an array", tests: [5] }
  - { name: "authFetch: Bearer header, 401 -> onUnauthorized, 403 -> forbidden error", tests: [6, 7, 8] }
  - { name: "RequireAuth: Navigate to /login, 403 message, Outlet/children", tests: [9, 10, 11, 12] }
---

# d10 · JWT, protected routes and front-end security

> **Exam link:** **B15** *"A frontend application can use a JWT's expiry information to determine whether a token may have expired"* (True). Section E is all this drill: **E1** *"their JWT has expired when they attempt to access a protected page"*, **E2** *"authentication and authorisation"*, **E3** *"why should the frontend not rely exclusively on hiding restricted pages"*, **E4** *"over HTTPS"*, **E5** *"data received from an external API as automatically trustworthy"*. Also **C5** (401 vs 403). E items are 2 marks each: pick the option, or say True/False.

## The idea

### 1. Authentication vs authorisation (E2)

- **Authentication**: *who are you?* Logging in with email + password proves your identity. The server then gives you a token.
- **Authorisation**: *what may you do?* Given who you are (and your role), are you allowed to open this page or call this endpoint?

Authentication always comes first: you can't decide what someone may do before you know who they are.

### 2. A JWT is three base64url parts, and the browser can only *read* it

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1MSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTgwMDAwMDAwMH0 . 4xP...sig
      header                          payload (claims)                              signature
```

The payload decodes to plain JSON: `{ "sub": "u1", "role": "ADMIN", "exp": 1800000000 }`. Base64url is **encoding, not encryption**, so anyone holding the token can read it. Never put secrets in a JWT.

The **signature** is made with the server's secret key. The browser doesn't have that key, so the frontend **cannot verify** a token. It can only read the claims. Only the server can tell whether a token is genuine. ([MDN: atob](https://developer.mozilla.org/en-US/docs/Web/API/Window/atob), [jwt.io intro](https://jwt.io/introduction))

```ts
const middle = token.split(".")[1];           // the payload part
const payload = JSON.parse(base64UrlToText(middle));
```

### 3. `exp` is in seconds (B15, E1)

`exp` counts **seconds** since 1970. `Date.now()` counts **milliseconds**. Multiply before you compare:

```ts
const expired = payload.exp * 1000 <= Date.now();
```

So yes (B15), the frontend can use `exp` to guess that a token **may** have expired, and send the user to log in before a request fails. But the server still makes the final decision: it rejects an expired token with **401**.

When the token has expired (E1), the app must **handle it**: log the user out and ask them to sign in again (re-authenticate), or use a refresh-token flow to get a new token. It must never carry on as if the user were still logged in.

### 4. Hiding pages is UX, not security (E3)

`RequireAuth` and a hidden "Admin" link make the app *pleasant*: users don't land on pages they can't use. They are **not protection**. All the JavaScript runs on the user's machine, so a user can edit it, change their token in DevTools, or call the API directly with Postman. The **server must check** the token and the role on **every** request.

```tsx
<Route element={<RequireAuth token={token} role="ADMIN" />}>
  <Route path="/admin" element={<AdminDashboard />} />   {/* hidden in the UI... */}
</Route>
// ...but GET /api/admin/... must ALSO return 401/403 on the server.
```

### 5. 401 vs 403 in the frontend (C5)

| Status | Meaning | What the frontend does |
|---|---|---|
| **401 Unauthorized** | not authenticated: no token, or an expired/invalid one | log out, go to `/login` |
| **403 Forbidden** | authenticated, but not *allowed* (wrong role) | show "not authorised". **Don't** log out: logging in again won't help |

One helper that adds the `Authorization: Bearer <token>` header and handles both cases keeps every component free of auth code. That's what the module's `services/api.ts` does.

### 6. Protected routes with React Router

```tsx
if (!token || isTokenExpired(token)) {
  return <Navigate to="/login" replace state={{ from: location }} />;
}
```

- `replace`: the protected URL is replaced in history, so **Back** doesn't bounce the user straight into the redirect again.
- `state={{ from: location }}`: the login page can send the user back to where they were going after a successful login.
- `<Outlet />` renders the matched child route when the guard is used as a layout route ([React Router: Outlet](https://reactrouter.com/api/components/Outlet)).

### 7. HTTPS, storage and untrusted data (E4, E5)

- **HTTPS (E4: True).** It encrypts the request in transit, so nobody on the network (café Wi-Fi) can read the `Authorization` header and steal the token.
- **Where to keep the token.** `localStorage` survives a refresh and is easy, but **any JavaScript on the page can read it**, so an XSS bug can steal the token. That's what the module app does, as a teaching choice. An **httpOnly cookie** can't be read by JavaScript at all (so XSS can't steal it), but needs `Secure`, `SameSite` and CSRF protection set up on the server. In-memory state is safest but is lost on refresh.
- **Never trust API data blindly (E5: False).** A `200 OK` only means the request worked, not that the data is safe or the right shape. Check it (types, required fields), and render it as text. React escapes `{value}` for you. `dangerouslySetInnerHTML` switches that off and lets an attacker's `<img onerror=...>` run: avoid it. ([react.dev: dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html))

## Worked example

A different scenario: a **library app**, where members borrow books and only librarians can add them. The token's role claim is `"librarian"` or `["member", "librarian"]`.

```tsx
// 1. A guard for one page, using children instead of <Outlet />
function LibrarianOnly({ token, children }: { token: string | null; children: ReactNode }) {
  const location = useLocation();
  if (!token || isTokenExpired(token))                          // not logged in, or expired
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  if (!hasRole(token, "librarian"))                             // logged in, wrong role
    return <p role="alert">Only librarians can add books.</p>;
  return <>{children}</>;
}

// 2. Calling the API: the server checks the token AGAIN
async function addBook(token: string, book: NewBook) {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(book),
  });
  if (res.status === 401) { logout(); navigate("/sign-in"); }   // token missing/expired
  if (res.status === 403) throw new Error("Forbidden");          // not a librarian
  return res.json();
}
```

- `isTokenExpired` first: an expired token is treated exactly like no token.
- The role check only runs once we know the token is valid (authenticate, then authorise).
- Even if a member edits the JavaScript and skips `LibrarianOnly`, `POST /api/books` still answers **403**: the real protection.

## Your task

1. Open `src/jwt.ts`. `base64UrlToText()` is given.
   - **TODO d10-1** `decodeJwtPayload(token)`: 3 parts, decode the middle one, `JSON.parse` it, and return `null` (never throw) for anything malformed.
   - **TODO d10-2** `isTokenExpired(token, nowMs)`: `exp` is in **seconds**. Missing `exp` or a bad token counts as expired. It's expired *at* `exp`, not one millisecond after.
   - **TODO d10-3** `hasRole(token, role)`: the `role` claim may be a string or an array.
2. Open `src/authFetch.ts`. **TODO d10-4**: add the Bearer header. On 401 call `onUnauthorized()` and throw an `ApiError(401)`. On 403 throw an `ApiError(403)` whose message contains "Forbidden". Return the JSON.
3. Open `src/RequireAuth.tsx`. **TODO d10-5**: `<Navigate>` to `/login` (with `replace` and `state={{ from: location }}`), a "403 Not authorised" message, or `children` / `<Outlet />`.
4. Run `npm test -- d10` until all 12 are green. Do the TODOs in order: `RequireAuth` uses your `isTokenExpired` and `hasRole`.
5. Then: **write it from memory.** The ICT has no editor, autocomplete or tests: you type code into a text box. Close the files and write on paper: the `exp * 1000` comparison, the `Authorization` header line, and the `<Navigate ... />` line. Then answer E1–E5 out loud in one sentence each.

## Hints

<details><summary>Hint 1: where do I start?</summary>

`token.split(".")` gives an array. If its `length !== 3`, return `null`. Wrap the decode + `JSON.parse` in `try { ... } catch { return null; }`, because both throw on garbage. Finally check `typeof payload === "object" && payload !== null && !Array.isArray(payload)`: `JSON.parse("42")` is valid JSON, but it isn't a payload.
</details>

<details><summary>Hint 2: test 3 fails on the last line (Nov 2023 says "expired")</summary>

You compared `payload.exp` (about 1.8 billion **seconds**) with `nowMs` (about 1.7 **trillion** milliseconds), so every token looks expired. Use `payload.exp * 1000 <= nowMs`. And `<=`, not `<`: at exactly `exp` it's already expired.
</details>

<details><summary>Hint 3: hasRole</summary>

```ts
const claim = decodeJwtPayload(token)?.role;
if (typeof claim === "string") return claim === role;
if (Array.isArray(claim)) return claim.includes(role);
return false;
```
</details>

<details><summary>Hint 4: authFetch (nearly the answer)</summary>

```ts
const headers = new Headers(init.headers);
if (token) headers.set("Authorization", `Bearer ${token}`);
const response = await fetch(url, { ...init, headers });
if (response.status === 401) { onUnauthorized(); throw new ApiError(401, "Unauthorised"); }
if (response.status === 403) throw new ApiError(403, "Forbidden");
```
Then handle other `!response.ok`, `204`, and `return await response.json()`.
</details>

<details><summary>Hint 5: tests 9–12 time out ("Unable to find an element")</summary>

The component still returns `<p>TODO d10-5</p>`. Order the checks: first token missing or expired (Navigate), then the role (403 message), then `return children ? <>{children}</> : <Outlet />;`. Don't forget `const location = useLocation();` at the **top** of the component (Rules of Hooks: not inside an `if`).
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>What is the main difference between authentication and authorisation? (E2)</summary>

Authentication checks **who** the user is, for example by verifying email and password at login, which gives them a token. Authorisation decides **what** that authenticated user may access or do, for example only users with the ADMIN role can open the admin dashboard. Authentication happens first.
</details>

<details><summary>Explain the difference between a 401 and a 403 response from the frontend's point of view. (C5)</summary>

401 Unauthorized means the request isn't authenticated: no token, or an expired/invalid one. The frontend should clear the session and send the user to log in again. 403 Forbidden means the server knows who the user is, but they don't have permission (wrong role). The frontend should show a "not authorised" message, and logging in again won't help.
</details>

<details><summary>A user's JWT has expired when they open a protected page. What should the frontend do? (E1, B15)</summary>

It should treat them as not authenticated: clear the stored token and redirect to the login page (re-authenticate), or get a new token through a refresh-token flow if the app has one. The frontend can spot this early by reading the `exp` claim (in seconds, so compare `exp * 1000` with `Date.now()`), but the server is still the authority: it rejects the expired token with a 401.
</details>

<details><summary>Why shouldn't the frontend rely only on hiding restricted pages? (E3)</summary>

All frontend code runs on the user's machine, so a user can change it, edit their stored token, or call the API directly (with Postman, for example). Hiding links and guarding routes is only for user experience. Every protected API endpoint must check the token and the role on the **server**.
</details>

<details><summary>Can the frontend verify a JWT's signature? Is the payload secret?</summary>

No to both. Verifying the signature needs the server's signing key, which must never be shipped to the browser, so the frontend can only decode and read the claims. The payload is only base64url-**encoded**, not encrypted, so anyone with the token can read it: never put passwords or secrets in it.
</details>

<details><summary>True or False: data from an external API can be trusted because the request succeeded. (E5) And HTTPS? (E4)</summary>

**E5 False.** A successful response only means the request worked. The data could still be malformed or malicious, so validate it, and render it as text (React's `{value}` escapes it) instead of using `dangerouslySetInnerHTML`, which allows XSS. **E4 True.** HTTPS encrypts traffic between the browser and the server, so tokens and passwords can't be read in transit. It doesn't protect against XSS on the page itself.
</details>

<details><summary>localStorage or an httpOnly cookie for the token? (one trade-off each)</summary>

localStorage is simple and survives a refresh, but any JavaScript on the page can read it, so an XSS attack can steal the token. An httpOnly cookie can't be read by JavaScript, so XSS can't steal it, but the server has to set it up with `Secure`/`SameSite` and protect against CSRF.
</details>
