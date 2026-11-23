# Project Context

_Last updated: 2026-11-23 (change 001 build)_

## Architecture Overview
- One npm project at the root. Stack: React 19.3, TypeScript 6.0 (strict), react-router-dom 7.18 (same as the module's CampusEvents app), @tanstack/react-query 5, zustand 5, Vitest 5 + jsdom + Testing Library. Every version is pinned exactly.
- **Drills** live in `drills/dNN-slug/`. Each has:
  - `LESSON.md`: front matter (`id`, `module`, `kind`, `title`, `difficulty`, `timeMinutes`, `mock: [ids]`, `tasks`), then `# dNN · Title`, a `> **Exam link:**` line, `## The idea`, `## Worked example`, `## Your task`, `## Hints` (`<details>` cards) and `## Viva questions` (`<details>`). The template is `templates/LESSON.md`.
  - `src/`: the starter.
  - `test/*.test.ts(x)`.
- **Exam page** in `exam/`: `index.html` + `exam.css` + `app.js` (UI) + `marking.js` (pure marking) + `papers/mock1.js`, `mock2.js` (data). Classic scripts with a UMD wrapper, so it works from `file://` and in Vitest. `exam/marking.test.ts` checks the totals and that model answers score full marks.
- **Branches:** `main` holds the starters, lessons, tests, exam and guides. `solutions` is `main` plus the completed `drills/*/src/` files.

## Coding Style & Conventions
- Starter TODOs are written `// TODO dNN-n: …`. An unfinished function body is `throw new Error("TODO dNN-n")`. An unfinished component returns a placeholder (`<p>TODO dNN-n</p>`) so the tests fail on assertions, not on crashes.
- Test names are numbered: `test("1. …")`. Each test file imports only from `../src/...`.
- Tests stub `fetch` with `vi.stubGlobal("fetch", vi.fn(...))` and restore it in `afterEach`. TanStack tests get a fresh `new QueryClient({ defaultOptions: { queries: { retry: false } } })` per test. Router tests use `MemoryRouter`/`createMemoryRouter`. Zustand stores are reset in `beforeEach` via `useStore.setState(initial, true)`.
- Imports come from `react-router-dom`, as in the module code.
- The CSS drill (d11) tests read the CSS file as text and use regexes. jsdom doesn't compute layout.

## Key Patterns
- **Solution workflow** (from OOP-practice):
  1. Write the full solution first and get it green.
  2. Copy the completed `src/` files to `.staging/solutions/drills/<drill>/src/` (gitignored).
  3. Turn `src/` back into the starter.
  4. Check the starter: it type-checks, and at least one test fails.
- The ICT has no editor. Every lesson ends its task with "write it from memory", and the viva answers are phrased the way you'd write them in a Section C/D text box.

## Constraints
- The exam page uses no network: no CDN, web fonts or `fetch`. It carries no Blackboard name or logo, and copies only the layout pattern.
- `bash scripts/selfcheck.sh` must print `SELFCHECK PASS` before a PR.
