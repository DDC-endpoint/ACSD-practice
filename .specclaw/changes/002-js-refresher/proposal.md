# Proposal: JavaScript refresher (stage 1: the JS the ICT needs)

**Created:** 2026-11-24
**Status:** 🟡 Draft

## Problem

The pack's lessons assume the learner already knows JavaScript. d01 starts at `reduce` and `Promise.all`, and `guides/REFRESHER.md` §1 starts at array methods. The learner said they need to **start from JavaScript itself** ("I need to start from there"), and they describe themselves as a beginner who learns by coding first and looking things up.

Without a JS on-ramp, every React, TanStack Query and fetch topic in d02–d11 sits on syntax they can't read yet:
- arrow functions
- destructuring
- spread
- `import`/`export`
- `async`/`await`

The ICT is **tomorrow (Wed 25 Nov 2026)**, so stage 1 has to be done in about 60–90 minutes tonight.

## Proposed Solution

Stage 1 (this change) has two parts.

**1. Four JavaScript on-ramp drills** that come **before d01**. They use the same format as d01–d11: a `LESSON.md` that opens with a task, `// TODO` markers in `src/`, Vitest tests that go from red to green, hints and viva questions, and LESSON/HINTS PDFs.
- **j01 · Basics:**
  - `let`/`const`
  - primitive types and `typeof`
  - `===` vs `==`
  - truthy and falsy
  - `if`/ternary
  - `for`/`for…of`
  - functions and `return`
- **j02 · Objects & arrays:**
  - object and array literals
  - dot vs bracket access
  - destructuring (with defaults)
  - spread/rest
  - template literals
  - `?.` and `??`
  - *copy-and-change instead of mutating*, the rule React state depends on
- **j03 · Functions & modules:**
  - arrow functions, including the implicit return and `({ … })` to return an object
  - callbacks and functions passed as values (the bridge to `map`/`filter` in d01)
  - default vs named `import`/`export`
- **j04 · Async:**
  - what a Promise is
  - `async`/`await`
  - `try`/`catch`
  - `fetch` with the `res.ok` check and `res.json()`
  - `JSON.stringify` and `JSON.parse`
  - `fetch` doesn't throw on 404/500

  Tests stub `fetch`, so no network is needed.

Each drill links its ideas to the ICT mock questions and to the later drill that uses them (j02 → d03/d09 state updates; j03 → d01/d05; j04 → d06/d07).

**2. `guides/JS-REFRESHER.md` + `.pdf`.** This is a short reference for looking things up while doing the drills.
- It has one section per drill topic, each with a snippet, an **In the exam:** line, and a "you'll see this in React as…" line.
- It ends with a JS-traps table.
- It's written in the same voice as `REFRESHER.md`, with links to MDN and nothing copied from it.

**README:** a "Start here if JavaScript is new" row/section that puts j01–j04 ahead of d01 in tonight's plan.

## Scope

### In Scope
- 4 drills (`drills/j01…j04`, each with `LESSON.md`, `src`, `test`, LESSON/HINTS PDFs), aimed at about 20 min each.
- `guides/JS-REFRESHER.md` + `.pdf`.
- README changes: start-here section, drill table, tonight's plan.
- The `solutions` branch gets the model answers for j01–j04.
- Any updates the PDF build and `selfcheck.sh` need so they pick up the new drills.

### Out of Scope
- **Stage 2, the full from-scratch JS course, comes after the ICT as a follow-up change (003).** It covers:
  - DOM and events
  - classes and `this`
  - closures in depth
  - error types
  - longer exercises aimed at the coursework (due 7 Jan)
- New questions on the exam page (`exam/index.html`).
- Changes to d01–d11 content, apart from a "before this, do j0x" link if needed.
- TypeScript on-ramp material, which d02 already covers.

## Impact

- **Size:** bounded. It adds drills and a guide using the pack's existing drill, guide and PDF pipeline, with no new subsystem.
- **Files affected:** about 25 (4 drills × src/test/lesson/PDFs, the guide, README, maybe the scripts)
- **Complexity:** small to medium
- **Risk:** low. The content is additive. The only risk is time: it has to be finished tonight to help.

## Open Questions

- Drill IDs: `j01–j04` (a separate JS track before d01), or renumber as `d00a–d00d`? Defaulting to `j01–j04`, if the scripts accept it.
- Drill source language: plain `.js`, so it's pure JavaScript, or `.ts` without annotations? Defaulting to `.js`, if the tsconfig/Vitest setup allows it.
