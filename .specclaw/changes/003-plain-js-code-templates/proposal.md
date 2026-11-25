# Proposal: Condensed exam refresher + plain-JS code templates

**Created:** 2026-11-25
**Status:** 🟡 Draft

## Problem

The ACSD in-class test is today (25 Nov 2026). `guides/REFRESHER.md` has 1,255 lines, too long to revise on exam day. Its 35 code blocks are TypeScript/TSX (15 `ts`, 20 `tsx`). The student is new to JS and "can't code React at all". Type annotations add noise to the templates they need to memorise. They asked for:
1. plain-JavaScript versions of the code templates ("JS templates where necessary")
2. "a more condensed refresher targeted for the exam. keep it short"

## Proposed Solution

**A. New condensed exam refresher** (priority, for today): `guides/ICT-QUICK.md` + `.pdf`.
- Target: 2–4 printed pages. Organised by the mock's sections A–E and their marks.
- Per topic: the rule in one or two lines, plus the exam keyword → answer pairs (for example "calculate a single value" → `reduce`).
- Code templates in **plain JS/JSX** (no types) for the code-writing marks: D1a, D1c, D2b, C3 (React component + props, `useState`, `useEffect` + fetch with loading/error, controlled form, list `.map` with `key`, Router `useNavigate`).
- One short "if they ask for TypeScript" box: where the types go (`props: { title: string }`, `useState<T>()`, `interface`).
- Built with the existing PDF pipeline (`scripts/build-pdfs.sh`).

**B. Plain-JS versions in the long docs:**
- In `guides/REFRESHER.md`, add a plain-JS/JSX block under each `ts`/`tsx` code block that has types. Blocks that are only type declarations get a one-line note instead ("in plain JS, delete this").
- Do the same for the 10 `<pre>` blocks in `guides/ICT-NIGHT-BEFORE.html`.
- Rebuild both PDFs.

## Scope

### In Scope
- New `guides/ICT-QUICK.md` + `guides/ICT-QUICK.pdf`
- `guides/REFRESHER.md` + `REFRESHER.pdf`: plain-JS blocks added beside the TS/TSX blocks
- `guides/ICT-NIGHT-BEFORE.html` + `.pdf`: plain-JS blocks added (the file is untracked now, so this change commits it)
- README: a one-line pointer to `ICT-QUICK`

### Out of Scope
- `guides/EXAM-DAY.md` and `guides/JS-REFRESHER.md` (the user chose REFRESHER + night-before only)
- Drill code and tests (they stay TypeScript)
- `videos/` (stays untracked)
- The student's uncommitted edits in `drills/j01-basics/src/basics.js` and `drills/j02-objects-arrays/src/events.js` (never touched; the work happens in a worktree)

## Impact

- **Size:** bounded (alters existing guides and adds one guide through the existing PDF pipeline; no new subsystem)
- **Files affected:** about 7 (2 new, 5 changed)
- **Complexity:** small to medium
- **Risk:** low. Docs only. The main risk is a JS translation that is wrong (for example a type left in). Mitigation: a check that every JS block parses (esbuild/babel JSX parse).

## Open Questions

- Does A replace B for today? Proposed default: build A first and ship it. B follows in the same change.
- The party panel is skipped at the user's request (time pressure, exam today).

---

**To proceed:** Review this proposal and approve to begin planning.
