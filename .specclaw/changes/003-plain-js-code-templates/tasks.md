# Tasks: Condensed exam refresher + plain-JS code templates

**Change:** 003-plain-js-code-templates
**Created:** 2026-11-25
**Total Tasks:** 5

## Summary
A first (the short exam sheet, today), then B (plain-JS versions in the long docs).

## Tasks

### Wave 1 — A: condensed exam refresher

- [x] `T1` — Write `guides/ICT-QUICK.md` + README pointer, build `ICT-QUICK.pdf`
  - Files: guides/ICT-QUICK.md, guides/ICT-QUICK.pdf, README.md
  - Estimate: medium
  - Kind: docs
  - Notes: FR-1..4. ≤ 4 pages. Plain JS/JSX only, plus one TS box. Check AC-1, AC-2.

### Wave 2 — B: plain-JS versions in the long docs

- [x] `T2` — Add Plain JS blocks to `guides/REFRESHER.md`, rebuild PDF
  - Files: guides/REFRESHER.md, guides/REFRESHER.pdf
  - Estimate: medium
  - Kind: docs
  - Depends: T1
  - Notes: FR-5, AC-3, AC-4.
- [x] `T3` — Add Plain JS blocks to `guides/ICT-NIGHT-BEFORE.html`, rebuild PDF via headless Chrome
  - Files: guides/ICT-NIGHT-BEFORE.html, guides/ICT-NIGHT-BEFORE.pdf
  - Estimate: small
  - Kind: docs
  - Depends: T1
  - Notes: FR-6, AC-3.
- [x] `T4` — Run the checks (esbuild parse, PDF check, selfcheck)
  - Files: none
  - Estimate: small
  - Kind: test
  - Depends: T2, T3
  - Notes: AC-2..AC-6.

### Wave 3 — user follow-up (2026-11-25)

- [x] `T5` — Night-before sheet JS-first: Template 4 JS only with a TS note; C1 JS; C2 kept TS (the question asks for an interface); TanStack `isPending` (v5) + JSON header on PUT
  - Files: guides/ICT-NIGHT-BEFORE.html, guides/ICT-NIGHT-BEFORE.pdf
  - Estimate: small
  - Kind: docs
  - Notes: The user asked "why isn't the night before doc templates also Javascript where possible?"

---

## Legend
- `[ ]` Pending · `[~]` In Progress · `[x]` Complete · `[!]` Failed · `[>]` Deferred
