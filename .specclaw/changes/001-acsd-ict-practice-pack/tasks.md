# Tasks: ACSD ICT practice pack

**Change:** 001-acsd-ict-practice-pack
**Created:** 2026-11-23
**Total Tasks:** 11

## Summary

1. Scaffold the tooling.
2. Build 11 drills in parallel pairs (the user's priority).
3. Build the exam page with Mock 1 and Mock 2.
4. Write the guides, PDFs and README.
5. Assemble `solutions`, run selfcheck, and publish.

## Tasks

### Wave 1 — Scaffold

- [ ] `T1` — Repo tooling + conventions
  - Files: package.json, package-lock.json, tsconfig.json, vitest.config.ts, vitest.setup.ts, .gitignore, CLAUDE.md, HANDOFF.md, .specclaw/context.md, scripts/selfcheck.sh, templates/LESSON.md
  - Estimate: medium
  - Kind: config
  - Notes:
    - Pin exact versions taken from `npm view` (react 19, react-dom, react-router 7, @tanstack/react-query 5, zustand 5, typescript, vite, vitest, jsdom, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, @types/react, @types/react-dom).
    - Scripts: `test` = `vitest run`, `typecheck` = `tsc --noEmit`, `selfcheck`, `pdf`.
    - `selfcheck.sh` covers AC-1..AC-4, AC-6 and AC-11. It checks `solutions` through a temporary worktree.

### Wave 2 — Drills (parallel)

- [ ] `T2` — d01 array methods + Promise.all; d02 TypeScript types
  - Files: drills/d01-array-methods/**, drills/d02-typescript-types/**
  - Estimate: medium
  - Kind: impl
  - Depends: T1
  - Notes: Write the solution first and stage it in `.staging/solutions/`, then reduce to the starter. Mock ids: d01 A1 A7 B3 C1; d02 A3 A8 A14 B2 B13 C2.
- [ ] `T3` — d03 React state + conditional rendering; d04 custom Hooks
  - Files: drills/d03-react-state-rendering/**, drills/d04-custom-hooks/**
  - Estimate: medium
  - Kind: impl
  - Depends: T1
  - Notes: Mock ids: d03 A4; d04 B4.
- [ ] `T4` — d05 React Router
  - Files: drills/d05-react-router/**
  - Estimate: medium
  - Kind: impl
  - Depends: T1
  - Notes: Shared layout + Outlet, `/students/:studentId`, useParams, useNavigate, useSearchParams (mirrors mock D1). Mock ids: A2 A6 A10 A18 B1 B8 B11 C3 D1.
- [ ] `T5` — d06 fetch + AbortController + service + status codes; d07 forms/validation + POST/PUT
  - Files: drills/d06-fetch-abort/**, drills/d07-forms-validation-crud/**
  - Estimate: large
  - Kind: impl
  - Depends: T1
  - Notes: Mirrors mock D2/D3. Mock ids: d06 A5 A13 A19 B5 C5 D2; d07 A17 B9 B10 D3.
- [ ] `T6` — d08 TanStack Query; d09 Zustand
  - Files: drills/d08-tanstack-query/**, drills/d09-zustand/**
  - Estimate: large
  - Kind: impl
  - Depends: T1
  - Notes: Mirrors mock D4/C4. Mock ids: d08 A11 A15 B6 C4 D4; d09 A12 B7 B14 D4.
- [ ] `T7` — d10 JWT/auth/security; d11 CSS
  - Files: drills/d10-auth-jwt-security/**, drills/d11-css-layout/**
  - Estimate: medium
  - Kind: impl
  - Depends: T1
  - Notes: Mock ids: d10 B15 E1–E5; d11 A9 A16 A20 B12.

### Wave 3 — Exam page

- [ ] `T8` — Exam engine + UI + Mock 1
  - Files: exam/index.html, exam/exam.css, exam/app.js, exam/marking.js, exam/papers/mock1.js, exam/marking.test.ts
  - Estimate: large
  - Kind: impl
  - Depends: T1
  - Notes:
    - Design via the /webdev skill: Blackboard-style layout with no branding.
    - Mock 1 is verbatim from the module mock, with the answer key, model answers and rubric.
    - The test covers AC-7/AC-8 for every paper present.
    - Check it in a browser (AC-9).
- [ ] `T9` — Mock 2 paper data
  - Files: exam/papers/mock2.js
  - Estimate: large
  - Kind: impl
  - Depends: T8
  - Notes: Same blueprint and data model, with new questions on the same topic spread.

### Wave 4 — Guides + README

- [ ] `T10` — Refresher + exam-day guide + PDF pipeline + README
  - Files: guides/REFRESHER.md, guides/EXAM-DAY.md, guides/*.pdf, scripts/pdf/**, scripts/build-pdfs.sh, README.md
  - Estimate: large
  - Kind: docs
  - Depends: T2, T3, T4, T5, T6, T7, T8
  - Notes: Port the OOP-practice PDF pipeline. The README has set-up, the drill flow, the exam page, the friends section, a 2-day plan and the drill→mock map.

### Wave 5 — Solutions + publish

- [ ] `T11` — Assemble solutions branch, selfcheck, publish, link from year-2-prep
  - Files: (branch `solutions`), D:\year-2-prep\ACSD\README.md, D:\year-2-prep\HANDOFF.md
  - Estimate: medium
  - Kind: config
  - Depends: T9, T10
  - Notes: Overlay `.staging/solutions` onto `solutions`, run `bash scripts/selfcheck.sh`, create the public repo with `gh`, and push `main` and `solutions`.

---

## Legend

- `[ ]` Pending
- `[~]` In Progress
- `[x]` Complete
- `[!]` Failed
- `[>]` Deferred
