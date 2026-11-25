# Learnings: 002-js-refresher

Build learnings, spec gaps, and patterns discovered.

**Categories:** spec_gap | design_gap | pattern | best_practice | agent_issue

---

## [L1] agent_issue — specclaw-build finalize merged locally despite selfcheck ...

**When:** 2026-11-23 19:12 UTC
**Category:** agent_issue
**Priority:** medium
**Status:** pending

### Detail
specclaw-build finalize merged locally despite selfcheck failing (repeat of 001 learning)

### Action
Skip finalize in this repo; go build → verify → pr

---

## [L2] design_gap — scripts/pdf/build.mjs + style.css modified but not in the...

**When:** 2026-11-25 04:24 UTC
**Category:** design_gap
**Priority:** medium
**Status:** pending

### Detail
scripts/pdf/build.mjs + style.css modified but not in the spec file map: an opt-in compact guide mode was needed to hit the <=4 page target

### Action
Include the PDF pipeline in the file map when a page budget is set

---

## [L3] best_practice — build-pdfs.sh filter matches folder names only, so 'guide...

**When:** 2026-11-25 04:24 UTC
**Category:** best_practice
**Priority:** low
**Status:** pending

### Detail
build-pdfs.sh filter matches folder names only, so 'guides' rebuilds every guide PDF; restore untouched PDFs with git checkout afterwards

### Action
Add a per-file filter to build.mjs

---
