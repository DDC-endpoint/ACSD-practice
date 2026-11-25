# Verify Report: 004-ignore-videos-folder

**Verdict:** PASS
**Date:** 2026-11-25
**Branch:** specclaw/004-ignore-videos-folder @ ce1d925

## Acceptance Criteria

| AC | Result | Evidence |
|----|--------|----------|
| AC-1 `git check-ignore videos/out` exits 0 | ✅ | Run in the main tree (where videos/ exists) with the branch's `.gitignore`: exit 0, matched `.gitignore:12:videos/` |
| AC-2 no `videos/` paths in `git status --porcelain -uall` | ✅ | 0 paths, down from 1,160+ |
| AC-3 diff against main touches only `.gitignore` + `.specclaw/` | ✅ | `git diff --name-only origin/main...HEAD` → `.gitignore` (the `.specclaw/` artifacts go in at PR time) |

## Gates

- **Lint:** not configured. **Build:** not configured.
- **Tests (`bash scripts/selfcheck.sh`):** 6 of 7 checks pass. **AC-4 FAILs:** "solutions touches: .gitignore". This is the known feature-branch case written up in `.specclaw/context.md` ("Selfcheck AC-4 (`git diff HEAD solutions`) always fails on a feature branch until `solutions` is synced. Prove it before merging with `git merge-tree --write-tree solutions HEAD`"). Proven: `git merge-tree --write-tree origin/solutions HEAD` exits 0 (clean). Merge `main` into `solutions` after the PR merges.
- **E2E:** not configured. No e2e evidence exists, and no AC depends on it.

## Context rules

- The build ran in the worktree `../ACSD-wt004`. No student drill file and no `videos/` file was committed.
- The verifier was run inline instead of as a spawned agent, because the change is one line.
