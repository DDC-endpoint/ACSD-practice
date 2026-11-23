# Verification Report: 001-acsd-ict-practice-pack

**Verified:** 2026-11-23
**Model:** Opus 5.5 (claude-opus-5-5), independent verify agent
**Verdict:** PASS

## Acceptance Criteria

| AC | Status | Evidence |
|---|---|---|
| AC-1 `npm ci` + typecheck on main | ✅ | Verifier re-ran `bash scripts/selfcheck.sh` (exit 0): `PASS  AC-1 typecheck`. The feature branch HEAD was `9f70209`. |
| AC-2 every drill starts red, all test files load | ✅ | d01 8/8, d02 7/7, d03 8/8, d04 8/8, d05 8/8, d06 8/8, d07 8/8, d08 7/7, d09 7/7, d10 12/12, d11 7/7 failing → `PASS  AC-2` |
| AC-3 solutions branch green + typecheck | ✅ | `PASS  AC-3 solutions: typecheck + all tests green` (88 tests) |
| AC-4 main↔solutions differ only under `drills/*/src/` | ✅ | `PASS  AC-4` |
| AC-5 LESSON front matter + 5 sections; A1–E5 covered | ✅ | All 11 lessons have `id`, `title`, `mock` and the five exact headings. The union of the `mock:` lists covers all 49 mock ids. |
| AC-6 no remote loads; renders from `file://` | ✅ | Selfcheck `PASS  AC-6`. The browser network log shows only 6 `file:///…/exam/…` requests. |
| AC-7 49 items each, 20/15/15/40/10 = 100 | ✅ | `exam/marking.test.ts:70` checks this. The browser start screen shows "49 questions · 100 marks" for both papers. (The AC was corrected from 45 to 49 during build: the mock's own blueprint is 20 + 15 + 5 + 4 + 5.) |
| AC-8 model = 100, blank = 0, wrong ≤ half | ✅ | `exam/marking.test.ts:120`, `:129`, `:136-139`, all passing. |
| AC-9 browser behaviour | ✅ | In an isolated Chrome context: the countdown survives a reload (deadline unchanged, 1:29:42), auto-submit fires when past the deadline, manual submit works, Practice Check shows "Incorrect · Correct answer: B. reduce() …", and unticking a C1 rubric point takes the total from 4 to 3 and persists. No console messages. The test storage keys were removed afterwards. |
| AC-10 guide PDFs built, check passes | ✅ | `guides/REFRESHER.pdf` and `guides/EXAM-DAY.pdf` are tracked. `node scripts/pdf/check.mjs` → `PASS  579/579`. |
| AC-11 "Blackboard" only in a comment | ✅ | One hit: the `exam/exam.css:3` header comment. The UI shows "ACSD practice test". |
| AC-12 `main` + `solutions` pushed | ✅ (main pending PR merge) | The remote has `main`, `solutions` and `specclaw/001-acsd-ict-practice-pack`. `main` gets the content when the PR merges. |

E2E: not configured — no e2e evidence. Lint/build: not configured.

## Content spot-check
- Mock 2:
  - A2: `[3,1,10,2].sort()` gives `[1,10,2,3]`.
  - A7: `length && …` renders 0.
  - A12: `res.json()` on a 204 throws.
  - A13: `fetch` rejects only on a network failure or an abort.
  - A15: `isPending`.
  - A16: `gcTime`.
  - A18: Zustand `set` merges.
  - B12 is False and B13 is False.
  - E1: `exp * 1000`.
  - E2: a 403 keeps the user logged in.
- Mock 1: A5, A13, A15, A16, B3 and B7 are correct.
- Model answers are correct: Mock 1 C4 and D2b, Mock 2 C4 and D4a–d.
- The d05 (react-router v7) and d08 (TanStack v5) lesson claims are accurate.

## Issues Found
1. **(Fixed after verify, docs only.)** `drills/d08-tanstack-query/LESSON.md:199` said the invalidate key "must match … exactly", which contradicted the prefix matching explained at line 92. It now says matching is by prefix. d08 PDFs rebuilt; `check.mjs` PASS 579/579.

## Test Results
- `bash scripts/selfcheck.sh` → `SELFCHECK PASS` (re-run independently by the verifier, exit 0).
- `node scripts/pdf/check.mjs` → `PASS  579/579 checks · 11 drills (LESSON + HINTS) · 0 papers · 2 guides`.

## Summary
**Passed:** 12/12 · **Failed:** 0/12 · **Verdict:** PASS
