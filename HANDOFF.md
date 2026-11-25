# HANDOFF — ACSD-practice

_Update at the end of every session: overwrite the top three sections, append to the log._

**Last updated:** 2026-11-25

## Current state
- **Change `001-acsd-ict-practice-pack`: DONE.** Verify PASS (12/12), PR #1 merged (2026-11-23), archived, tagged `ict-pack-v1`. Repo is public.
- Contents:
  - 11 drills (d01–d11, 88 tests), each with LESSON/HINTS PDFs
  - `exam/index.html`, a self-marking Blackboard-style page with Mock 1 (the module mock verbatim, plus a key) and Mock 2 (new questions), each 49 items and 100 marks, with Exam and Practice modes
  - `guides/REFRESHER` and `guides/EXAM-DAY` (Markdown + PDF)
  - `scripts/selfcheck.sh` → SELFCHECK PASS
- Branches:
  - `main` holds the pack (selfcheck PASS on main).
  - `solutions` = `main` + the completed `drills/*/src`, synced and pushed.

## Next steps
0a. **Change `004-ignore-videos-folder`: PR #4 open, verify PASS.** It adds `videos/` to `.gitignore`. After it merges, `git pull` in the main tree and merge `main` into `solutions` (selfcheck AC-4 fails until then; `merge-tree` is already proven clean). Worktree `../ACSD-wt004` can then be removed.
0. **After the archive PR merges:** merge `main` into `solutions` (in a worktree), push, run `bash scripts/selfcheck.sh`.
1. Support the student through the drills and mocks before the ICT, **Wed 25 Nov 2026**. Review their marked attempts and explain wrong answers.
2. The student's drill work will be uncommitted in their tree. Never commit it, and use worktrees for git work.

## Open questions
- The ICT start time and room (not given).
- Mock items flagged as ambiguous are noted in the page: Mock 1 A7 (all vs allSettled wording) and A12 (the store's generated Hook); Mock 2 B15 ("typically" for `:focus-visible`), A13 and E5.

## Session log
- **2026-11-23:**
  - Repo created and change 001 proposed (panel skipped by the user), planned and built.
  - The build used 6 parallel drill agents, plus an exam page agent, a Mock 2 agent and a refresher agent.
  - The verify agent (with a browser check) passed it. PR #1 opened.
  - Fixes during the build:
    - the item count 45 → 49
    - the selfcheck path normalisation
    - an untracked `.lock`
    - the d08 hint wording (prefix matching)
  - `specclaw-build finalize` merged locally and deleted the branch even though the selfcheck failed. That was undone (local only) and redone via `/specclaw:pr`.
- **2026-11-23 (later):** The user merged PR #1. Merged `main` into `solutions`, selfcheck PASS on main, archived 001 (archive PR), tagged `ict-pack-v1`.
- **2026-11-25:**
  - Q: is the ICT open book? No module doc says. The mock's instructions are silent on notes. Advised assuming closed book; `EXAM-DAY.md:81` ("no notes and no AI") is our assumption, not a module rule.
  - About 1,160 pending files were all from the untracked `videos/` project (~1 GB). The user chose to ignore all of it. Change 004 was proposed (panel skipped by the user) and sized bounded, then planned, built in worktree `../ACSD-wt004`, verified PASS and opened as PR #4.
