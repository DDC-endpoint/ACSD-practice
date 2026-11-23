# Verify report: 002-js-refresher

**Verdict:** PASS (after remediation; the first pass was PARTIAL. See "Remediation" at the end)

All ACs are met (AC-4 judged by the simulation). One must-fix teaching error blocks PASS: the j03 lesson, starter comment and hint claim that `=> { x: x, y: y }` "returns undefined". With two or more properties it is a **SyntaxError**, not `undefined`. The j03 PDFs carry the same wrong text, so they need a rebuild after the fix.

## AC table

| AC | Status | Evidence |
|---|---|---|
| AC-1 | Met | `npx tsc --noEmit` clean on HEAD (re-run). Simulated post-merge solutions tree was tsc-clean (per brief). |
| AC-2 | Met | Re-run `npx vitest run drills/j0` on the starters: 5 files load, 38 failed / 1 passed. The one pass is j04 test 10, which only exercises the GIVEN `countEvents`. All failures are the thrown TODO error or assertions, with no loader crashes. |
| AC-3 | Met | Existing local `solutions` branch is green (per brief). I also swapped in `.staging/solutions/drills/j0*/src/*.js` and re-ran: 39/39 pass. |
| AC-4 | Met by simulation | The local `solutions` branch lacks the j files until post-merge sync, as with change 001. The simulated tree (147/147 tests, diff only under `drills/*/src`) is accepted. The selfcheck regex `drills/[dj][0-9]{2}-` is correct. |
| AC-5 | Met | `check.mjs` PASS 838/838 (per brief). 4 x LESSON.pdf, 4 x HINTS.pdf and `guides/JS-REFRESHER.pdf` exist. **Rebuild the j03 PDFs after the must-fix edit.** |
| AC-6 | Met | Every j LESSON.md has H1, `> **Exam link:**`, The idea, Worked example, Your task, Hints, Viva questions in order. All FR-3 to FR-6 topics appear in the matching drill. j03 has 3 "In React you'll see this as" lines against 5 in the others, but FR-2 says "where one applies". |
| AC-7 | Met | README has section 0 with the j-rows, the "New to JS? First" plan row, a "behind" item 0, and the section 3 Guides link to `JS-REFRESHER.pdf`. |
| AC-8 | Met except AC-4 | Selfcheck AC-4 fails only on the pending branch sync (see AC-4). |
| AC-9 | Met | The only d01 source change is the one-line pointer in `LESSON.md`, plus the regenerated d01 PDFs, which are built from LESSON.md. |

Restore check: I swapped the staging solutions in and ran mutation variants. All were caught: `bookSeat` mutating, `addEvent` using `push`, `capacityOf` using `||`, and a missing `res.ok` check. I then restored the starters. `git status` shows only the pre-existing `.specclaw` changes and no drill files modified.

## Content accuracy findings

1. **MUST-FIX. `drills/j03-functions-modules/LESSON.md:51`** says `const toPoint = (x, y) => { x: x, y: y };` gives "undefined". I ran it: with two or more properties it is `SyntaxError: Unexpected token ':'`. Only the single-property form `{ id: 1 }` parses as a label plus expression and returns `undefined`. The same wrong claim appears in:
   - `drills/j03-functions-modules/src/format.js:22` ("you get undefined"). The starter comment describes `{ id, label }`, which has two properties.
   - Hint 3 (`LESSON.md:225`). It tells the learner that test 3 "says `undefined`" after they write `=> { id: event.id, label: event.title }`. That code fails to parse, so the whole `format.js` module fails to load and every format test fails with a transform error, not `undefined`.

   Correct version: use a single-property example for the "returns undefined" demo, for instance `(e) => { id: e.id }`. This is how `guides/JS-REFRESHER.md` does it, and the guide is correct. Alternatively say "with one property you get `undefined`; with several it is a SyntaxError". In Hint 3, say "you get a SyntaxError (red text about an unexpected `:`)".

2. **SHOULD-FIX. `drills/j04-async-fetch/LESSON.md:23` and the snippets that follow** say "`fetch` works in both" (the browser console and node) and "Try snippets yourself", but the snippets use `fetch("/api/events")`. A relative URL fails in node (`Failed to parse URL from /api/events`, ERR_INVALID_URL), and on a blank browser tab it also fails. The same applies to the guide's async snippets, which sit under "How to try code". Fix: tell the learner these URLs only work inside the drill's tests, and to try a real public URL such as `https://jsonplaceholder.typicode.com/todos/1` for a live call.

3. **SHOULD-FIX. `guides/JS-REFRESHER.md` traps table, `sort` mutates row**, recommends `items.toSorted(...)` with no caveat. `toSorted` is ES2023. This repo's tsconfig has `lib: ES2022`, so `toSorted` does **not typecheck** here, and `drills/d01-array-methods/LESSON.md:91` explicitly says to use `[...arr].sort(...)`. NFR-3 requires consistency with d01. Fix: show `[...items].sort(...)` first and add "(`toSorted` exists in newer JS but not in this project's ES2022 settings)".

4. **SHOULD-FIX (minor). Falsy list "exactly six"**: `drills/j01-basics/LESSON.md` truthy section ("Exactly these") and the viva answer ("Exactly six"). `-0` and `0n` (BigInt zero) are also falsy. Harmless for the ICT. Change to "these six are the ones you'll meet" to stay literally true.

5. **NIT. `drills/j03-functions-modules/LESSON.md` section 6**: "Forget the `{ }` on a named import and you get `undefined` or an error. Add them to a default import and you get the same." In real ESM, a missing named or default export is a **SyntaxError at link time**. `undefined` happens only in some bundlers. The wording is vague, not wrong.

6. **NIT. j01 and j02 "paste into the console"**: re-pasting a snippet that has `const event = ...` into the same Node REPL session throws "Identifier 'event' has already been declared". Chrome allows it. One sentence ("in node, restart it if you see 'already been declared'") would help.

7. **NIT. Guide section 6 and j04 section 2**: "`useEffect` cannot take an `async` callback". Precisely, it can be written but returns a Promise, which React warns about. Fine as beginner shorthand.

Facts I checked and found correct:
- `typeof` results, including `null`, arrays and functions.
- Truthy/falsy lists and the `{events.length && ...}` trap.
- `??` vs `||`, and defaults applying only to `undefined`, not `null`.
- Implicit return rules.
- Named vs default import syntax, `as`, and the mixed import line.
- `fetch` rejection semantics.
- 204 gives `SyntaxError: Unexpected end of JSON input` on `res.json()` (verified).
- `JSON.stringify` output string.
- `const` semantics.
- Worked-example outputs: `shelfLabel`, `countOnLoan`, the playlist example, `makeCounter`, `addVat(10) === 12`, and `runTwice` giving `"HEY!!"`.
- The exam quotes (C1, D2, D3), with the D2 quote abridged using "...".
- The d06 and d07 cross-references.

## Other findings

- **Tests test the stated concept.**
  - j02 copy tests use `structuredClone` snapshots, `toEqual` and `not.toBe`. The mutation experiment confirmed they catch `++`, `push` and `||`.
  - j04 tests 2, 4 and 6 assert rejection with the status in the message. Removing the `res.ok` check makes all three fail.
  - j04 test 5 asserts that `json` is never called, so the 204 handling is verified.
  - j03 test 7 spies on `Array.prototype.filter` and `map`, which enforces hand-written loops, and restores in `finally`.
- **Starter accident risks.** Only j04 test 10 passes on the starter, and that is by design (GIVEN functions).
- **Over-constrained tests (nit).**
  - j04 test 5 uses `toHaveBeenCalledWith("/api/events/5", { method: "DELETE" })`. A learner who adds headers to the DELETE fails with a confusing diff.
  - j03 test 2 uses `not.toMatch(/return/)` on `String(fn)`. It works, but would break if a learner put the word `return` in a comment inside the arrow body.
- **Pre-solved parts of starters (nit).**
  - j02 `summary` ships with the destructured, defaulted parameter list already written, so that skill is read, not written.
  - Starter comments for j02-4 and j02-5 contain the full answer lines, and the j02 idea section (sections 4 and 6) shows the same patterns as those tasks.
  - This fits "lead with what to type", and the write-from-memory step covers it, but those parts of j02 are lighter than the 25 minutes claimed.
- **Hints.** No hint leaks inside the LESSON body outside `## Hints`. The Hints sections do give full answers in places (j01 hint 7, j02 hint 7, j03 hints 7 and 8). Each is collapsed and labelled, which is acceptable.
- **Timing.** j01 (20 min, 9 tests, 7 idea sections), j02 (25) and j04 (25, which also introduces Promises, `fetch` and POST) are plausible but at the upper end for a true beginner. j03 (20) is fine. The total of about 90 minutes is honest, and the README "behind" fallback (j02 + j04) is sensible.
- **PDF freshness.** After fixing finding 1 (and 2 to 4), rebuild the affected LESSON/HINTS PDFs and `guides/JS-REFRESHER.pdf` with `bash scripts/build-pdfs.sh`, then re-run `check.mjs`.
- **Config changes.** `vitest.config.ts`, `selfcheck.sh` and `build.mjs` changes are minimal and match the spec. The `build.mjs` id casing keeps `j01` lowercase.


## Remediation (orchestrator, commit 866ef9d)

**Must-fix**
- **j03, the `({})` trap.** `LESSON.md` now shows that one property gives `undefined` and two properties give a `SyntaxError`. Hint 3 is retitled and its text corrected. The `format.js` TODO comment is corrected in both the starter and the solution.

**Should-fix**
- **j04 lesson and guide §5.** Both now say that relative `fetch("/api/events")` URLs only work in the tests and the app. For trying `fetch` live they give a full public URL.
- **Guide traps table.** It now shows the spread form `[...items].sort(...)` first, with a note that `toSorted` isn't in this project's ES2022 settings.
- **j01.** The falsy wording now reads "These six are the falsy values you'll meet" and "Six to remember".

**Nits:** left as they are.

**Re-run after the fixes**
- `npx tsc --noEmit`: clean.
- `npx vitest run drills/j0`: 38 failing and 1 passing on the starters, as expected.
- j03 with the staged solution swapped in: 10/10 pass.
- `node scripts/pdf/check.mjs`: PASS 838/838. The j01, j03 and j04 PDFs and `guides/JS-REFRESHER.pdf` were rebuilt.
