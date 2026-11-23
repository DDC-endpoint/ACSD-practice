# Drill agent brief (shared by T2–T7)

You build drills for **ACSD-practice**: a practice pack for a university React + TypeScript in-class test (ICT). The test is on **Wed 25 Nov 2026**, so ship working drills fast. You are one of several agents working in parallel in the same working tree.

## Hard rules
- Work only in `D:\ACSD-practice`. Touch **only** your own drill folders (`drills/dNN-*`) and `.staging/solutions/drills/dNN-*/`.
- **No git commands that change state.** Don't commit, checkout, branch or stash. The lead commits.
- **Don't edit** `package.json`, configs, or other drills. If you truly need a new dependency, stop and say so in your report.
- Everything you need is installed: react 19.3, react-router-dom 7.18, @tanstack/react-query 5.108, zustand 5.1, vitest 5 (globals on, jsdom), @testing-library/react + user-event + jest-dom.

## Read first
1. Your task's payload: `.specclaw/changes/001-acsd-ict-practice-pack/contexts/<TASK>.md`. It includes the spec, the design and the guardrails.
2. `.specclaw/context.md`: the conventions (TODO markers, test naming, fetch stubbing, QueryClient per test, store reset).
3. `templates/LESSON.md`: the lesson format. Front matter and section headings are **exact**, because a PDF pipeline parses them.
4. `.specclaw/changes/001-acsd-ict-practice-pack/mock1-source.txt`: the module's mock paper. Your drill's `mock:` ids point into it. Make the drill teach **exactly** what those questions test.
5. A tone and depth example from the sister pack: `D:\OOP-practice\drills\d05-sorting\LESSON.md` (Java, but the same lesson style).
6. Optional: the module's own code, as zips in `D:\year-2-prep\ACSD\03_Code\`. `ACSD_W07_CampusEvents_Frontend_Auth_and_Admin_Files.zip` has `src/services/*.ts`, `src/types/*.ts`, `AuthContext` and `RequireAuth`. To read one, unzip it into a NEW temp dir (for example `$TEMP/acsd-<task>`), never inside the repo. Mirror the module's style where it fits (service modules, `types/` interfaces, `fetch` with `async/await`).

## Learner
- A self-described TS/React **beginner** who learns by coding first and looking things up.
- Lessons stay short and concrete. Lead with the idea in plain words and one small snippet per idea. Link MDN, react.dev, tanstack.com or zustand docs; never copy them.
- The ICT has **no editor**: answers are typed into Blackboard text boxes, and there are MCQ/True-False questions. So:
  - Every lesson's "Your task" ends with a **write it from memory** step.
  - Viva questions are phrased like ICT questions ("What does `staleTime` control?", "Explain the difference between 401 and 403"). The answers are written the way you'd answer them for full marks: 2–4 sentences or a short code snippet.
  - Include 3–6 viva questions, and include traps the MCQs set (for example: `find` returns the first match only, not all of them).

## Workflow per drill (same as OOP-practice)
1. Write the **full solution** in `drills/dNN-slug/src/`, plus tests in `drills/dNN-slug/test/`. Aim for 4–8 tests named `"1. …"`, `"2. …"`. Run `npx vitest run drills/dNN` until it's **all green**.
2. Copy the completed `src/` files to `.staging/solutions/drills/dNN-slug/src/`, at the same relative paths.
3. Turn `src/` back into the **starter**:
   - Keep the types, signatures, imports and exports.
   - Replace bodies the learner writes with `// TODO dNN-n: <clear instruction>` plus `throw new Error("TODO dNN-n")`.
   - Components that the learner writes return `<p>TODO dNN-n</p>`.
   - Give the learner some scaffolding: types and helper code that isn't the skill being drilled stay filled in.
4. Run `npx vitest run drills/dNN` on the starter. **At least one test, ideally every TODO's test, must FAIL, and every test file must load** (no import or syntax errors).
5. `npx tsc --noEmit` must show **no errors in your drill's files** on both the starter and the solution. Ignore errors in other drills' folders; other agents are mid-flight.
6. Write `LESSON.md` from the template. Fill in the front matter (`mock: [...]`) and an `> **Exam link:**` line that quotes the relevant mock questions briefly.

## Report (your final message)
- Files created, the test list, and the starter result (N failing / M total).
- Anything the lead should know (assumptions, a mock item you think is ambiguous).
- End with this footer, outside any code fence, with real values from your last solution-state run. Run it with the solution in place (temporarily copy `.staging` back, run, then restore the starter), or simply report the solution run from step 1 if it was your last full run:

## Verification
Command: npx vitest run drills/dNN drills/dMM
Exit: 0
Output (tail): <last ≤20 lines>

The repo must be left in the **starter** state.
