# Spec: ACSD ICT practice pack

## Overview
A public practice repo for the ACSD in-class test (ICT): 25 Nov 2026, 90 min, 100 marks, sat on Blackboard. It has three parts:
- 11 test-driven React/TS drills
- a Blackboard-style self-marking exam page with two mock papers
- a concept refresher

It is modelled on `D:\OOP-practice`: teach first, then test, with the answers on a `solutions` branch. The learner codes first and looks things up, and calls themselves a TS/React beginner. Every lesson leads with a task and stays beginner-friendly.

## Requirements

### Functional Requirements
- **FR-1 Tooling.** One npm project at the root.
  - Stack: React 19 + TypeScript + Vite + Vitest (jsdom) + Testing Library, plus `react-router`, `@tanstack/react-query` and `zustand`. All versions are pinned exactly.
  - `npm test` runs everything. `npm test -- d05` runs one drill. `npm run typecheck` runs `tsc --noEmit`.
- **FR-2 Drills.** Each of the 11 drills, `drills/dNN-<slug>/`, contains:
  - `LESSON.md`: front matter (`id`, `title`, `mock`: the list of mock question ids), then `## The idea`, `## Worked example`, `## Your task`, `## Hints` (numbered, `<details>`), `## Viva questions` (with answers in `<details>`).
  - `src/`: starter files with `// TODO dNN-n:` markers. Unfinished bodies `throw new Error("TODO dNN-n")`, or render a placeholder.
  - `test/`: tests named `"1. …"`, `"2. …"` that fail on the starter and pass on the solution.
- **FR-3 Drill topics:**

  | Drill | Topic |
  |---|---|
  | d01 | array methods + `Promise.all` |
  | d02 | TS types |
  | d03 | React state and conditional rendering |
  | d04 | custom Hooks |
  | d05 | React Router |
  | d06 | fetch + `AbortController` + service + status codes |
  | d07 | forms/validation + POST/PUT |
  | d08 | TanStack Query |
  | d09 | Zustand |
  | d10 | JWT/auth/security |
  | d11 | CSS grid/`clamp`/`minmax`/`:focus-visible` |

  The mapping to mock questions is the one in proposal.md.
- **FR-4 Exam page.** `exam/index.html` opens straight from disk (`file://`), offline, with no build step.
  - A start screen offers a paper (Mock 1 / Mock 2) and a mode (Exam / Practice).
  - The layout copies a Blackboard test: a title bar, a timer, an "N of 45 answered" progress count, numbered question cards showing points, radio buttons for MCQ/TF, monospace text areas for code, and **Save and Submit**.
  - It carries no Blackboard name, logo or trade dress colours.
- **FR-5 Papers.**
  - Mock 1 reproduces the module mock verbatim: 20 MCQ + 15 TF + 5 short answer + 4 programming (with parts a–d) + 5 security = 100 marks.
  - Mock 2 has new questions on the same blueprint and topic spread, also 100 marks.
  - Each item carries its answer or model answer plus a one-line explanation.
- **FR-6 Marking.**
  - MCQ, TF and E items are marked exactly.
  - Each C/D part has rubric points (`text`, `marks`, `patterns`: a regex list with an `all` or `any` match). Matched points are auto-ticked, and the part's score is the ticked marks, capped at its maximum.
  - Scores are labelled "provisional (auto)". The student can tick or untick any point, and the totals update live.
- **FR-7 Modes.**
  - Exam mode: a 90-minute countdown from a stored absolute deadline. Refreshing doesn't pause it. It auto-submits at 0 and shows results only after submit.
  - Practice mode: no timer, with a **Check** button per question that shows the result and the explanation.
- **FR-8 Persistence.** Answers, paper, mode, deadline and overrides autosave to `localStorage` under a per-paper key. A finished attempt goes into a history list with its date and score. **Reset attempt** clears the current one.
- **FR-9 Results.** A total out of 100, a score per section, and per-question review: your answer, the correct or model answer, the explanation and the rubric checklist.
- **FR-10 Guides.** `guides/REFRESHER.md` covers every mock topic with a snippet and a one-line exam answer. `guides/EXAM-DAY.md` covers the ICT format, a time plan per section, and answering technique for MCQ, TF and written code. Both have PDFs.
- **FR-11 README.** Set-up (Node 24, `npm install`), the drill flow, the exam page, a "Friends: fork it" section, a two-day plan (Mon 23 → Wed 25), and a drill → mock question map.
- **FR-12 Solutions.** The `solutions` branch is `main` plus the completed `drills/*/src/` files.

### Non-Functional Requirements
- **NFR-1** Matches the module stack: React 19 and TS strict, as in the CampusEvents `package.json`.
- **NFR-2** The exam page uses no network requests and no external URLs (no CDN or fonts), and works in Chrome/Edge from `file://`.
- **NFR-3** Exam page content (question text, answers) lives in data files separate from the UI, so the marking can be tested in Node.
- **NFR-4** Lesson tone is beginner-friendly. MDN, the React docs, TanStack and Zustand docs are linked, never copied.

## Acceptance Criteria
- [ ] **AC-1** On `main`: `npm ci` and `npm run typecheck` succeed.
- [ ] **AC-2** On `main`: every drill has at least one failing test, and no drill's test file fails to load (failures are assertions or TODO throws, never syntax or import errors).
- [ ] **AC-3** On `solutions`: `npm test` passes in full and `npm run typecheck` succeeds.
- [ ] **AC-4** `git diff main solutions --name-only` lists only paths under `drills/*/src/`.
- [ ] **AC-5** Every `LESSON.md` has the front matter and the five sections. Every mock question id A1–E5 appears in at least one drill's `mock:` list, except pure recall items, which are listed in the README instead.
- [ ] **AC-6** `exam/` contains no `http(s)://` resource loads (script, link, img or fetch). The page renders from `file://`.
- [ ] **AC-7** Mock 1 and Mock 2 each have 45 items. Section totals are 20/15/15/40/10 and the paper total is 100 (checked by a test).
- [ ] **AC-8** Marking test: for both mocks, entering all the model/correct answers scores 100, and all-blank scores 0. For every C/D part, a listed wrong answer scores at most half of that part.
- [ ] **AC-9** In a browser: Exam mode shows a countdown that survives a reload and auto-submits at 0. Practice mode's Check shows feedback. Unticking a rubric point lowers the total.
- [ ] **AC-10** `guides/REFRESHER.pdf` and `guides/EXAM-DAY.pdf` are built, and the PDF check passes.
- [ ] **AC-11** `grep -ri blackboard exam/` finds only the comment that explains the layout's inspiration (the word never renders in the UI).
- [ ] **AC-12** The public GitHub repo `DDC-endpoint/ACSD-practice` has `main` and `solutions` pushed.

## Edge Cases
- Code answers with any whitespace, quote style or semicolons, `const` vs `let`, arrow vs function: the rubric regexes normalise whitespace and accept the alternatives.
- The timer runs out while the tab is hidden: on the next tick or load, it auto-submits if `now >= deadline`.
- Corrupt or old `localStorage` data: a `version` field is checked, and on a mismatch the attempt is reset rather than crashing.
- Ambiguous mock items (A7, A12): the intended answer is marked, and a "Note" explains the nuance.
- `localStorage` unavailable (private mode): the page still works, without autosave.

## Dependencies
- Node 24 + npm (installed: v24.15.0 / 11.16.0). Chrome or Edge for the PDFs (OOP-practice's pipeline, ported).
- `gh` authenticated as `DDC-endpoint`.

## Notes
- TanStack Query and Zustand are barely covered in the lectures we have (one TanStack mention in L03). They're taught at the depth the mock tests: `useQuery`/`queryKey`/`staleTime`/`useMutation`/`invalidateQueries`; `create`/selectors/actions.
- Grounding: the module stack comes from `year-2-prep/ACSD/03_Code/ACSD_W03_CampusEvents_Frontend_Project.zip:package.json` (`"react": "^19.2.8"`, `"typescript": "~6.0.2"`, `"vite": "^8.3.0"`).
