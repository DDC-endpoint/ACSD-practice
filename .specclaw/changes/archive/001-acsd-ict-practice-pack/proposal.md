# Proposal: ACSD ICT practice pack (drills + Blackboard-style mock exam)

**Created:** 2026-11-23
**Status:** 🟡 Draft

## Problem

The ACSD in-class test (ICT, 40% of 5COSC026W) is on **Wednesday 25 Nov 2026**, two days away. Nothing is prepared for it. Facts from the module's mock (`year-2-prep/ACSD/00_Module_Info/ACSD_Mock_ICT_In-Class_Test.docx`):

- 90 minutes and 100 marks, sat on **Blackboard**.
- A: 20 MCQ. B: 15 True/False. C: 5 short answers (3 marks each). D: 4 programming/analysis questions (10 marks each). E: 5 front-end security questions (2 marks each).
- Topics: JS array methods and Promises, TypeScript types/interfaces/unions, React components, conditional rendering and custom Hooks, React Router (layouts, `Outlet`, `useParams`, `useNavigate`, `useSearchParams`), fetch with `useEffect`/`AbortController`, API service modules, HTTP status codes, forms, validation and CRUD (POST vs PUT), TanStack Query (`staleTime`, `invalidateQueries`), Zustand (stores, selectors), CSS (`grid-template-areas`, `minmax`, `clamp`, `:focus-visible`), JWT and authN vs authZ.

The student calls themselves a beginner at TS/React and learns by coding first and looking things up. The mock is a Word file with no answer key, so it can't be self-marked, and it doesn't rehearse the Blackboard interface. TanStack Query and Zustand hardly appear in the lectures we have (one TanStack mention in L03), yet the mock tests them.

## Proposed Solution

A new public repo, `D:\ACSD-practice` → `github.com/DDC-endpoint/ACSD-practice`, modelled on `OOP-practice` (teach first, then test).

1. **Drills (built first; the user's priority).** One Vite + React 19 + TypeScript project, matching the module's CampusEvents stack, with Vitest, jsdom and Testing Library. Each `drills/dNN-*/` folder has:
   - `LESSON.md`: the idea, a worked example, the task, hints, viva questions and an "exam link" naming which mock questions the drill covers
   - TODO source files
   - tests that start red and go green
   - `npm test dNN` runs one drill
   - the model answers on a `solutions` branch

   Proposed drills, each mapped to the mock:

   | Drill | Skill | Mock questions |
   |---|---|---|
   | d01 | array methods: `map`/`filter`/`reduce`/`find`/`some`, `Promise.all` | A1, A7, B3, C1 |
   | d02 | TS: `interface`, `type`, optional `?`, union `\|`, typed functions | A3, A8, A14, B2, B13, C2 |
   | d03 | React: props, `useState`, conditional rendering, lists and keys | A4 |
   | d04 | custom Hooks and the Rules of Hooks | B4 |
   | d05 | React Router: route config, shared layout + `Outlet`, `useParams`, `useNavigate`, `useSearchParams` | A2, A6, A10, A18, B1, B8, B11, C3, D1 |
   | d06 | fetch: `useEffect` + `AbortController`, loading/error/data, service module, status codes 200/201/204/401/403/404 | A5, A13, A19, B5, C5, D2 |
   | d07 | forms: validation function, controlled inputs, POST/PUT with headers + `JSON.stringify` | A17, B9, B10, D3 |
   | d08 | TanStack Query: `useQuery`, query keys, `staleTime`, `useMutation`, `invalidateQueries` | A11, A15, B6, C4, D4 |
   | d09 | Zustand: `create`, selectors, actions; what belongs in Zustand vs TanStack Query | A12, B7, B14, D4 |
   | d10 | auth: decode a JWT's `exp`, expiry check, protected route, roles, authN vs authZ, server-side enforcement, untrusted API data | B15, E1–E5 |
   | d11 | CSS: `grid-template-areas`, `minmax`, `clamp`, `:focus-visible` (tests read the CSS file) | A9, A16, A20, B12 |

2. **Blackboard-style exam page** (`exam/index.html`). One self-contained offline HTML file. It copies Blackboard's test layout but not its name or logo.
   - **Mock 1** is the module mock verbatim, with an answer key Claude writes. **Mock 2** has new questions on the same blueprint.
   - **Exam mode:** a 90-minute countdown stored as an absolute deadline, with auto-submit. **Practice mode:** no timer, and you can check each question.
   - **Marking:** A, B and E are marked exactly. C and D are marked against rubric points with regex checks, giving a *provisional* score. The page then shows the model answer, and you can tick or untick any rubric point to override.
   - Results are given per section, and answers autosave to `localStorage`.
   - `exam/marking.test.ts` checks that the model answers score full marks and that known-wrong answers score low.
   - The design goes through the `/webdev` skill.

3. **Guides:** `guides/REFRESHER.md` + PDF (every concept with a snippet and a one-line answer, for the morning of the test) and a short `EXAM-DAY.md`. The PDF pipeline is adapted from OOP-practice's `scripts/build-pdfs.sh`.

4. **README:** set-up (Node 24, `npm install`), drill flow, the exam page, "Friends: fork it", and a 2-day plan.

**Build order:** drills d01–d11 → exam page + Mock 1 → Mock 2 → guides → README/PDFs → GitHub.

## Scope

### In Scope
- The repo and its tooling: `package.json`, Vite/Vitest/TS config, `.gitignore`, `CLAUDE.md`, `HANDOFF.md`.
- 11 drills with lessons, TODOs, tests, and solutions on a `solutions` branch.
- The exam page with Mock 1 and Mock 2, plus its marking test.
- The refresher and exam-day guides (Markdown + PDF).
- README.
- A public GitHub repo with `main` and `solutions` pushed.
- In year-2-prep: link the pack from `ACSD/README.md` and update `HANDOFF.md`.

### Out of Scope
- Running or type-checking code typed into the exam page (the user chose rubric checks + self-mark).
- Blackboard branding.
- Bootstrap and the HTML5/CSS3 lecture detail beyond what the mock tests.
- The ASP.NET backend. Drills mock `fetch`; nothing needs a live API.
- The ACSD coursework (7 Jan) and the study site.

## Impact

- **Size:** architectural (a new repo with its own drill framework, exam page and marking engine)
- **Files affected:** about 90–110 new (11 drills × about 5 files, the exam page, guides, config)
- **Complexity:** large in content, medium in code
- **Risk:** medium.
  - **Time:** it must be usable by Tue 24 Nov evening. Mitigation: drills ship and get committed first, in waves, so each finished drill is usable straight away.
  - **Content correctness:** a wrong answer-key entry teaches a wrong fact. Mitigation: every key entry and lesson claim gets a one-line reason, and ambiguous mock items are flagged in the UI.
  - **Library drift:** TanStack Query v5 and Zustand v5 APIs. Pin exact versions and write lessons against them.

## Open Questions

- Ambiguous items in the module mock: A7's wording mixes up `Promise.all` and `allSettled`, and A12 says "the store's generated Hook". Proposed default: mark the intended answer (A and C) and show a note on the nuance.
- Heuristic marking will misjudge some free text. Proposed default: label C/D scores "provisional", with a one-click override per rubric point.
- TanStack Query and Zustand aren't in the lectures we have. Proposed default: teach them from the official docs (linked, not copied) at the depth the mock tests.
