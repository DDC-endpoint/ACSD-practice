# Verify report: 003-plain-js-code-templates

**Verdict: PASS**
**Date:** 2026-11-25 · **HEAD:** specclaw/003-plain-js-code-templates · **Verified by:** the orchestrator, inline from the collected evidence. No separate verify agent ran, because of exam-day time pressure. `workflow.code_review` is false.

| AC | Result | Evidence |
|---|---|---|
| AC-1 ICT-QUICK.pdf exists, ≤ 4 pages | ✅ | `pagetext.mjs guides/ICT-QUICK.pdf`: the last page reads "page 4 of 4". Checked visually in Chrome. |
| AC-2 ICT-QUICK JS blocks parse, no TS | ✅ | `parse-js.mjs guides/ICT-QUICK.md` → `PARSE-JS PASS: 7/7` |
| AC-3 added Plain JS blocks parse | ✅ | REFRESHER `PARSE-JS PASS: 20/20` (control: 19/35 TS originals rejected). Night-before `parse-night.mjs` → `RESULT: PASS (10 JS blocks parse; 1 TS block = C2)` |
| AC-4 every typed REFRESHER block has Plain JS or a note | ✅ | `ctrl.mjs`: every block the JSX parser rejects is followed by a Plain JS block or a note (16 blocks, 4 notes) |
| AC-5 PDF check + selfcheck | ✅ (qualified) | `check.mjs` → `PASS 847/847`. Selfcheck: AC-1, AC-2, AC-3, AC-6, AC-7/8 and AC-11 pass. Selfcheck AC-4 FAIL: `git diff HEAD solutions` lists non-drill files. That is structural on any feature branch, because `solutions` lags `main`. Simulated post-sync: `git merge-tree --write-tree solutions HEAD`, then a diff against HEAD, leaves nothing outside `drills/*/src/`, so it **passes once main is merged into solutions** (the documented post-merge step). |
| AC-6 no drill/videos/student files touched | ✅ | `git diff --stat main..HEAD`: only guides/, README.md, scripts/pdf/build.mjs, scripts/pdf/style.css, .specclaw/ |

**Deviations (recorded in learnings.md):**
- The `scripts/pdf/build.mjs` and `style.css` changes were outside the spec's file map: an opt-in `compact: true` guide mode, needed for the page budget. Other guide PDFs are unchanged.
- T5 (user follow-up): the night-before sheet is now JS-first. C2 stays TypeScript because the question asks for an interface. TanStack `isLoading` became `isPending` (v5), matching the other guides.

**Post-merge:** merge `main` into `solutions`, then `bash scripts/selfcheck.sh` must print `SELFCHECK PASS`.
