# Tasks: JavaScript refresher (stage 1: the JS the ICT needs)

**Change:** 002-js-refresher
**Created:** 2026-11-24
**Total Tasks:** 7

## Summary

Wave 1 wires the tooling. Wave 2 writes the four drills and the guide in parallel: each drill is written as a solution first, then turned back into the starter. Wave 3 handles the README, PDFs and selfcheck.

## Tasks

### Wave 1 — tooling

- [x] `T1` — Let the tooling see the j-drills
  - Files: `vitest.config.ts`, `scripts/selfcheck.sh`, `scripts/pdf/build.mjs`
  - Estimate: small
  - Kind: config
  - Notes:
    - The Vitest include adds `js`.
    - The selfcheck AC-2 regex becomes `([dj]\d\d)`, and the AC-4 regex becomes `drills/[dj][0-9]{2}-`.
    - build.mjs keeps a lowercase `j` in ids.
    - `npx vitest run` and `npx tsc --noEmit` behave as before.

### Wave 2 — content (parallel)

- [x] `T2` — j01 · Basics drill (FR-1, FR-2, FR-3, FR-7)
  - Files: `drills/j01-basics/{LESSON.md,src/*.js,test/*.test.js}`, `.staging/solutions/drills/j01-basics/src/*.js`
  - Estimate: medium
  - Kind: docs
  - Depends: T1
  - Notes: Solution first → green → copy to `.staging` → convert back to the starter (red, loads).
- [x] `T3` — j02 · Objects & arrays drill (FR-1, FR-2, FR-4, FR-7)
  - Files: `drills/j02-objects-arrays/…`, `.staging/solutions/drills/j02-objects-arrays/src/*.js`
  - Estimate: medium
  - Kind: docs
  - Depends: T1
- [x] `T4` — j03 · Functions & modules drill (FR-1, FR-2, FR-5, FR-7)
  - Files: `drills/j03-functions-modules/…`, `.staging/solutions/drills/j03-functions-modules/src/*.js`
  - Estimate: medium
  - Kind: docs
  - Depends: T1
- [x] `T5` — j04 · Async & fetch drill (FR-1, FR-2, FR-6, FR-7)
  - Files: `drills/j04-async-fetch/…`, `.staging/solutions/drills/j04-async-fetch/src/*.js`
  - Estimate: medium
  - Kind: docs
  - Depends: T1
- [x] `T6` — `guides/JS-REFRESHER.md` (FR-8)
  - Files: `guides/JS-REFRESHER.md`
  - Estimate: medium
  - Kind: docs

### Wave 3 — integrate and check

- [x] `T7` — README, PDFs, selfcheck (FR-9, AC-1–AC-9)
  - Files: `README.md`, `drills/d01-array-methods/LESSON.md` (a one-line pointer), `drills/j0*/LESSON.pdf`, `drills/j0*/HINTS.pdf`, `guides/JS-REFRESHER.pdf`
  - Estimate: medium
  - Kind: docs
  - Depends: T2, T3, T4, T5, T6
  - Notes:
    - Run `bash scripts/build-pdfs.sh j0` and `bash scripts/build-pdfs.sh guides`.
    - The `solutions` overlay (FR-10) is applied from `.staging` after the PR merges, the same as for 001.

---

## Legend

- `[ ]` Pending
- `[~]` In Progress
- `[x]` Complete
- `[!]` Failed
- `[>]` Deferred
