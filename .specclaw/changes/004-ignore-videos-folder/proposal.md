# Proposal: Ignore the local-only videos/ folder in git

**Created:** 2026-11-25
**Status:** 🟡 Draft

## Problem

`videos/` is untracked and holds about 1 GB in 1,160+ files: a TTS cache (708 files), HyperFrames `out/` (397 files), MP4 renders (568 MB), music, chapter JSON and build tools. All of it shows as pending in git, which buries the few changes that matter. The user decided (2026-11-25) to keep the whole video project local-only, for three reasons: the repo is public, the MP4s go over GitHub's file limits, and the music licence is unknown.

## Proposed Solution

Add a `videos/` line, with a one-line comment, to the root `.gitignore`.

## Scope

### In Scope
- One `videos/` entry in `.gitignore`.

### Out of Scope
- Committing any video sources (chapters/, tools/, _template/).
- The student's drill work (`drills/j01-basics`, `drills/j02-objects-arrays`). It is never committed.
- The uncommitted `.specclaw/changes/003-plain-js-code-templates/` state files.
- Deleting or moving anything inside `videos/`.

## Impact

- **Size:** bounded (spike / bounded / architectural)
- **Files affected:** 1 (estimated)
- **Complexity:** small (small / medium / large)
- **Risk:** low (low / medium / high)

## Open Questions

- None.

---

**To proceed:** Review this proposal and approve to begin planning.
