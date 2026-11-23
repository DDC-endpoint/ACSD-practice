# Spec: JavaScript refresher (stage 1: the JS the ICT needs)

**Change:** 002-js-refresher
**Created:** 2026-11-24
**Status:** 🟡 Draft

## Overview

This change adds a plain-JavaScript on-ramp **before d01**:
- four test-driven drills, `j01`–`j04`, in the pack's existing drill format
- a look-up guide, `guides/JS-REFRESHER.md` + PDF

It's for a learner starting JS from scratch the night before the ICT (Wed 25 Nov 2026), who codes first and looks things up. Stage 2, the full course, is a separate later change.

## Approach

- **Design decision:** the j-drills are **pure JavaScript**. They use `src/*.js` and `test/*.test.js`, so the learner never sees a type annotation, and `tsconfig.json` doesn't change: tsc ignores `.js` because `allowJs` is off. Vitest runs them once its `include` also matches `*.test.js`.
- File map:
  - `drills/j01-basics/`, `drills/j02-objects-arrays/`, `drills/j03-functions-modules/`, `drills/j04-async-fetch/`, each with `LESSON.md`, `src/*.js`, `test/*.test.js` and the built `LESSON.pdf`/`HINTS.pdf`
  - `guides/JS-REFRESHER.md` + `guides/JS-REFRESHER.pdf`
  - `vitest.config.ts`: the include matches `drills/**/test/**/*.test.{ts,tsx,js}`
  - `scripts/selfcheck.sh`: the AC-2 drill regex becomes `([dj]\d\d)`, and the AC-4 path regex becomes `drills/[dj][0-9]{2}-`
  - `scripts/pdf/build.mjs`: the id casing keeps `j01` lowercase, like `d01`
  - `README.md`: a "Start here if JavaScript is new" section, j-rows in the drill table, and j01–j04 first in tonight's plan
  - `drills/d01-array-methods/LESSON.md`: an optional one-line pointer back to j01–j04
  - `solutions` branch: completed `drills/j0*/src/*.js`

## Requirements

### Functional Requirements

- **FR-1:** Each j-drill follows the `templates/LESSON.md` structure:
  - front matter with `id: jNN`, `module: ACSD`, `kind: drill`, `title`, `difficulty: 1`, `timeMinutes` ≤ 25, `mock` and `tasks`
  - `# jNN · Title`
  - an `> **Exam link:**` line
  - `## The idea`, `## Worked example` (a different scenario from the task), `## Your task` (ending with "write it from memory"), `## Hints` (`<details>`) and `## Viva questions` (`<details>`)
- **FR-2:** Lesson voice. Lessons are beginner-level and lead with what to type. Each `###` idea has a snippet and a "In React you'll see this as …" line where one applies. They link to MDN and never copy it.
- **FR-3: j01 · Basics.** Covers:
  - `let`/`const` (reassignment vs mutation)
  - primitive types and `typeof`
  - `===` vs `==`
  - truthy/falsy (`0`, `""`, `null`, `undefined`, `NaN`)
  - `if`/`else` and the ternary
  - `for` and `for…of`
  - declaring a function and `return`
- **FR-4: j02 · Objects & arrays.** Covers:
  - object and array literals
  - dot vs bracket access
  - object and array destructuring with defaults and renaming
  - spread to copy and change objects and arrays without mutating them
  - rest parameters
  - template literals
  - optional chaining `?.` and nullish `??` vs `||`
- **FR-5: j03 · Functions & modules.** Covers:
  - arrow functions: implicit return, and `({ … })` to return an object
  - callbacks and passing functions as values, which leads into `map`/`filter` in d01
  - functions that return functions (lightly)
  - named vs default `export`/`import`, with a second module file in `src/`
- **FR-6: j04 · Async & fetch.** Covers:
  - what a Promise is
  - `async`/`await`
  - `try`/`catch`/`finally`
  - `fetch` + `res.ok` + `res.json()`
  - `fetch` doesn't throw on 404/500
  - POST with `method`, the `Content-Type` header and `JSON.stringify`
  - `JSON.parse`

  Tests stub `fetch` with `vi.stubGlobal` and restore it in `afterEach`. No network is used.
- **FR-7: Starter conventions** (as in `.specclaw/context.md`):
  - `// TODO jNN-n: …` comments
  - unfinished bodies `throw new Error("TODO jNN-n")`
  - numbered test names `test("1. …")`
  - tests import only from `../src/...`
- **FR-8:** `guides/JS-REFRESHER.md` has `kind: guide` front matter. It has one `##` section per drill topic, each idea with a snippet, an **In the exam:** line and a "In React:" line. It ends with a JS-traps table. It's built to PDF by the existing pipeline.
- **FR-9:** The README adds a "Start here if JavaScript is new" section (j01 → j04 → d01), j-rows in the drill table, and j01–j04 at the top of tonight's plan. It links the new guide in §3 Guides.
- **FR-10:** The `solutions` branch carries completed `drills/j0*/src/*.js`, and nothing else differs.

### Non-Functional Requirements

- **NFR-1:** Each drill takes about 15–25 minutes for a beginner, so all four come to about 90 minutes or less.
- **NFR-2:** The tests are deterministic, use no network, and import nothing new. No dependencies are added.
- **NFR-3:** The content is accurate for modern JS (ES2022) and consistent with `guides/REFRESHER.md` §1 and d01.

## Acceptance Criteria

- **AC-1:** `npx tsc --noEmit` passes on `main` and on `solutions`.
- **AC-2:** On `main`, every j-drill has at least one failing test, and every j test file loads (selfcheck AC-2 lists j01–j04).
- **AC-3:** On `solutions`, `npx vitest run` is all green, including j01–j04.
- **AC-4:** `solutions` differs from `main` only under `drills/[dj]NN-*/src/`.
- **AC-5:** `bash scripts/build-pdfs.sh` builds LESSON.pdf and HINTS.pdf for j01–j04 and `guides/JS-REFRESHER.pdf`, and `check.mjs` reports PASS.
- **AC-6:** Each j LESSON.md has every FR-1 section in order, and FR-3–FR-6 topics each appear in their drill.
- **AC-7:** The README contains the start-here section, the j-rows and the plan update, and links `guides/JS-REFRESHER.pdf`.
- **AC-8:** `bash scripts/selfcheck.sh` prints `SELFCHECK PASS`.
- **AC-9:** No d01–d11 file changes, apart from an optional one-line "new to JS? do j01–j04 first" pointer in d01's LESSON.md.

## Edge Cases

- If a drill's `src` is all-TODO, its tests should fail on assertions or the thrown TODO error, not crash the loader.
- j04: `res.ok` is false for a 404 or 500. The tests must check that the learner's code handles it (throws or returns the error path) rather than calling `res.json()` blindly.
- j02: "copy, don't mutate" tests assert that the input object or array is unchanged (`toEqual` against a snapshot taken before the call, plus `not.toBe` for a new reference).

## Dependencies

None new. Uses the existing Vitest/jsdom setup and the PDF pipeline (Node + Chrome/Edge).

## Notes

Stage 2 (out of scope) will be change 003 after the ICT. It covers DOM and events, classes and `this`, closures in depth, error types, and longer exercises aimed at the 7 Jan coursework.
