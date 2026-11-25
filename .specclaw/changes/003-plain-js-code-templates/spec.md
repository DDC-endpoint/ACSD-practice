# Spec: Condensed exam refresher + plain-JS code templates

**Change:** 003-plain-js-code-templates · **Size:** bounded · **Created:** 2026-11-25

## Functional Requirements
- **FR-1 (A).** New `guides/ICT-QUICK.md`: a condensed refresher for the ICT, organised by the mock's sections A–E, with a target of ≤ 4 printed A4 pages. Each topic has a one-to-two-line rule and keyword → answer pairs. Topics come from `REFRESHER.md`, plus the lecture-only gaps listed in HANDOFF 2026-11-24 (IP/TCP/DNS, MVC/DTO, CORS, the four UI states, why a `useEffect` callback can't be `async`, HTML5 semantics, Bootstrap grid/breakpoints, logout/token storage).
- **FR-2 (A).** ICT-QUICK code templates are **plain JS/JSX only**: a component with props, `useState`, `useEffect` + fetch with loading/error, a controlled form, a list `.map` with `key`, `useNavigate`/`Link`/`useParams`, `useQuery`/`useMutation`, a Zustand store, and the core array methods.
- **FR-3 (A).** One short "If they ask for TypeScript" box: prop types, `useState<T>`, `interface`/`type`, typed fetch.
- **FR-4 (A).** `guides/ICT-QUICK.pdf` built by the existing pipeline (`bash scripts/build-pdfs.sh`). README gets a one-line pointer.
- **FR-5 (B).** In `guides/REFRESHER.md`, every `ts`/`tsx` block that contains type syntax gets a following block labelled **Plain JS** (`js`/`jsx`) with the types removed. A block that is only type declarations gets a one-line note instead. Blocks with no type syntax get nothing.
- **FR-6 (B).** Same rule for `guides/ICT-NIGHT-BEFORE.html`, using its own `<pre>` styling. Rebuild `REFRESHER.pdf` and `ICT-NIGHT-BEFORE.pdf`.

## Acceptance Criteria
- **AC-1.** `guides/ICT-QUICK.pdf` exists and is ≤ 4 pages.
- **AC-2.** Every `js`/`jsx` block in ICT-QUICK.md parses as JSX (esbuild `loader: jsx`) and contains no type annotations.
- **AC-3.** Every Plain JS block added to REFRESHER.md and ICT-NIGHT-BEFORE.html parses as JSX (esbuild).
- **AC-4.** Every REFRESHER `ts`/`tsx` block with type syntax is followed by a Plain JS block or a "delete in plain JS" note.
- **AC-5.** `node scripts/pdf/check.mjs` prints PASS, and `bash scripts/selfcheck.sh` prints `SELFCHECK PASS`.
- **AC-6.** No drill `src/`/`test/` file, no `videos/` file and none of the student's uncommitted files are changed.

## Edge Cases
- `as` casts, generics (`useState<Event[]>`), non-null `!`, `satisfies`, and `import type` must all be removed in the JS versions.
- JSX inside `.map` keeps `key`.

## Approach
Write by hand (no automated TS→JS stripper, because the readable output matters). Work in a worktree on branch `specclaw/003-plain-js-code-templates`, cut from `main`. Copy the untracked `ICT-NIGHT-BEFORE.html/.pdf` into the worktree so they get committed. Build the night-before PDF with headless Chrome `--print-to-pdf`. AC-2/3 are checked by a throwaway esbuild parse script in the scratchpad.

**File map:**
- add `guides/ICT-QUICK.md`, `guides/ICT-QUICK.pdf`
- modify `guides/REFRESHER.md`, `guides/REFRESHER.pdf`
- add (first commit) `guides/ICT-NIGHT-BEFORE.html`, `guides/ICT-NIGHT-BEFORE.pdf`
- modify `README.md` (one-line pointer)
