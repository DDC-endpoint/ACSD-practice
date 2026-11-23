# Design: ACSD ICT practice pack

## Technical Approach
A single npm project at the repo root holds all the drills, which gives one `node_modules` and one fast install. Vitest uses jsdom. The exam page is plain HTML/CSS/JS loaded as **classic scripts** (not ES modules), because Chrome blocks module imports over `file://`. The data and marking files use a tiny UMD wrapper, so Vitest can load the same files in Node.

## Architecture

```
ACSD-practice/
  package.json            pinned deps; scripts: test, typecheck, selfcheck, pdf
  tsconfig.json           strict, jsx: react-jsx, include drills/**, exam/**/*.test.ts
  vitest.config.ts        jsdom env, setupFiles: vitest.setup.ts (jest-dom), include drills/**/test/**, exam/**/*.test.ts
  drills/dNN-slug/
    LESSON.md             front matter {id,title,mock:[...]} + 5 sections
    src/*.ts(x)           starter (main) / completed (solutions)
    test/*.test.ts(x)     red on starter, green on solution
  exam/
    index.html            shell + UI markup (classic <script src> tags)
    exam.css              Blackboard-style layout (own colours; no brand assets)
    app.js                UI: start screen, rendering, timer, autosave, results, overrides
    marking.js            pure functions: normalise(), markItem(), markPaper(); UMD → window.ACSDMarking | module.exports
    papers/mock1.js       data: window.ACSD_PAPERS.mock1 = {...}   (UMD)
    papers/mock2.js       data: window.ACSD_PAPERS.mock2 = {...}
    marking.test.ts       AC-7/AC-8: loads the UMD files via createRequire
  guides/REFRESHER.md, EXAM-DAY.md (+ .pdf)
  scripts/pdf/            ported from OOP-practice (build.mjs, check.mjs, lib.mjs, style.css, own package.json)
  scripts/build-pdfs.sh   as in OOP-practice
  scripts/selfcheck.sh    AC-1..AC-4 (+ solutions worktree), AC-6, AC-11
```

### Paper data model (exam/papers/*.js)
```js
{ id: "mock1", title: "ACSD Mock ICT 1", minutes: 90,
  sections: [{ id: "A", title: "Section A - Multiple Choice", intro: "...", items: [
    { id: "A1", type: "mcq", marks: 1, prompt: "...", code?: "...", options: ["reduce()", ...],
      answer: 1, explain: "...", note?: "..." },
    { id: "B1", type: "tf", marks: 1, prompt: "...", answer: true, explain: "..." },
    { id: "C1", type: "written", marks: 3, prompt: "...", code?: "...", parts: [
      { id: "C1", label: "", marks: 3, model: "const total = prices.reduce(...)",
        rubric: [{ text: "Uses reduce", marks: 1, any: ["\\.reduce\\s*\\("] },
                 { text: "Initial value 0", marks: 1, any: [",\\s*0\\s*\\)"] }, ...],
        wrong: ["const total = prices.length"] } ] }
  ]}]}
```
- `type` is one of `mcq | tf | written`. Section E mixes mcq and tf.
- Section D items have parts a–d, each with its own marks and rubric.
- A rubric point may use `all: [...]` (every regex must match) or `any: [...]` (at least one).
- Regexes are strings, compiled with the `i` flag and run against `normalise(answer)`: whitespace collapsed, and smart quotes turned into straight quotes.

### Marking (exam/marking.js)
- `markItem(item, response, overrides)` returns `{ score, max, points: [{ text, marks, auto, ticked }] }`.
- `markPaper(paper, responses, overrides)` returns `{ total, max, bySection }`.
- The functions are pure, with no DOM, so they can be tested.

### UI state (localStorage key `acsd-ict:<paperId>`)
- `{ version: 1, mode, deadline, responses: {itemId|partId: value}, overrides: {pointKey: bool}, submittedAt }`
- History is kept under `acsd-ict:history`.

## File Changes Map
Everything is new. See the tree above. In `year-2-prep`: `ACSD/README.md` (a link to the pack) and `HANDOFF.md`.

## Data Model Changes
None (no backend).

## API Changes
None.

## Key Decisions
- **KD-1 Several classic-script files instead of one HTML file.** The proposal said "one self-contained file". Splitting it into `index.html` + `app.js` + `marking.js` + `papers/*.js` keeps the papers testable in Node (NFR-3), and still opens from `file://` with no build. The student still opens a single file: `exam/index.html`.
- **KD-2 One npm project for all drills.** Faster to install than per-drill projects, and `npm test -- dNN` filters by path.
- **KD-3 Solutions differ only under `drills/*/src/`.** Same rule as OOP-practice (its context, "solutions may differ only under src/main/"). Exam papers carry their answers on `main` (it's a self-marking page).
- **KD-4 Routing tests use `createMemoryRouter`/`MemoryRouter`. TanStack tests use a fresh `QueryClient` with `retry: false` per test. `fetch` is stubbed with `vi.stubGlobal`.**
- **KD-5 CSS drill tests read the CSS file as text** and check declarations with regexes, because jsdom doesn't compute grid layout.
- **KD-6 No Blackboard branding.** Only the layout is copied: a light grey page, white question cards, a "Question N · X points" header, and a bottom submit bar. Our own neutral colours.
- **KD-7 Build pattern from OOP-practice:** write the full solution first, keep it in `.staging/solutions/` (gitignored), then turn the file back into the starter.

## Grounding sources
- `D:\OOP-practice\.specclaw\context.md`:
  - "Starter TODOs are written `// TODO dNN-n: …`" → adapted as `// TODO dNN-n:` with `throw new Error("TODO dNN-n")`.
  - "Never put solution bodies on `main` or the feature branch. `solutions` may differ only under `src/main/`" → KD-3.
  - "Don't use `position: relative/absolute` in `scripts/pdf/style.css`" → keep this when porting the PDF pipeline.
- `ACSD_W03_CampusEvents_Frontend_Project.zip:package.json`: `"react": "^19.2.8"` → NFR-1.

## Risks & Mitigations
- **R1 Wrong answer-key entries.** Every item carries `explain`. Ambiguous items get a `note`.
- **R2 Regex rubric too strict.** The `wrong` examples and model answers are tested (AC-8). Overrides are always available.
- **R3 Time.** The drills are built in parallel waves. Each drill is independent.
- **R4 Library API drift** (TanStack v5, Zustand v5, react-router v7). Pin the versions and check them with `npm view` at scaffold time. The tests run against the installed versions.
