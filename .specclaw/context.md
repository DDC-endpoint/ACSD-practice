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

## Learnings from change 001 (2026-11-23)
- **The papers follow the module mock's blueprint: 49 items** (20 MCQ + 15 TF + 5 C + 4 D + 5 E), 100 marks. Not 45.
- `package.json` has `"type": "module"`, so in Node the UMD paper files must be **evaluated in a `vm` context** (`ctx.self = ctx`), not `require`d. `exam/marking.test.ts` shows how.
- jsdom replaces the global `URL`, so `new URL(..., import.meta.url)` breaks in drill tests. Use `resolve(dirname(fileURLToPath(import.meta.url)), "../src/x")` or `__dirname`.
- d02 (types) and d11 (CSS) check declarations by **reading the source as text**, because types and layout don't exist at runtime in jsdom.
- TanStack v5 typings: `getQueryCache().find(...)?.options.staleTime` is untyped, so tests assert `staleTime` through behaviour (remount → no refetch).
- Selfcheck AC-6 skips `exam/papers/` because question text legitimately contains `fetch("https://…")`. The papers aren't code that runs.
- `specclaw-build finalize` merges locally and deletes the branch even when `test_command` fails. In this repo, open PRs through `/specclaw:pr` instead, and keep `.specclaw/changes/*/.lock/` and `logs/` gitignored.
- Branch `solutions` = `main` + `.staging/solutions` overlay. After a PR merges, merge `main` into `solutions` and re-run `bash scripts/selfcheck.sh`.
