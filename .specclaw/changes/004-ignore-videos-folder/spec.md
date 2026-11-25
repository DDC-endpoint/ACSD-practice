# Spec: Ignore the local-only videos/ folder in git

**Change:** 004-ignore-videos-folder
**Created:** 2026-11-25
**Status:** 🟡 Draft

## Overview

Git stops showing the local-only `videos/` project (about 1 GB, 1,160+ files) as pending changes. The user chose to keep it out of the public repo.

## Requirements

### Functional Requirements

- **FR-1:** The root `.gitignore` ignores the top-level `videos/` directory.

### Non-Functional Requirements

- **NFR-1:** No file inside `videos/` is deleted, moved or changed.
- **NFR-2:** Nothing else in the main working tree is touched. That includes the student's drill edits and the 003 state files.

## Acceptance Criteria

- **AC-1:** `git check-ignore videos/out` succeeds (exit 0).
- **AC-2:** `git status --porcelain -uall` lists no paths under `videos/`.
- **AC-3:** The diff against `main` touches only `.gitignore` and `.specclaw/` change files.

## Edge Cases

- No `videos/` path is tracked today (`git ls-files videos` is empty), so nothing needs untracking.

## Dependencies

None.

## Approach

Append a commented `videos/` entry to the root `.gitignore`. Build it in a worktree (`../ACSD-wt004`), following `.specclaw/context.md`: "When the student has uncommitted work in the main tree, build in a separate worktree".

File map:
- `.gitignore` (modify)

## Notes

The user decided on 2026-11-25 that the whole video project stays local-only.
