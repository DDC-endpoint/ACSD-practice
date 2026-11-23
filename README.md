# ACSD-practice: ICT practice pack

Practice for the **5COSC026W Advanced Client-Side Development in-class test (ICT)**. It's worth 40% of the module. From the module's mock paper:
- **90 minutes** (+25 for RAF students), **100 marks**, taken **on Blackboard**. You type answers into the browser, with no editor, no autocomplete and no tests.
- **A** 20 multiple choice · **B** 15 true/false · **C** 5 short answers (3 marks each) · **D** 4 programming/analysis questions (10 marks each) · **E** 5 front-end security questions (2 marks each).
- Topics: React + TypeScript, React Router, fetch/`AbortController`, forms and validation, TanStack Query, Zustand, CSS Grid, HTTP status codes, JWT and auth.

**Teach first, then test.**
- **Drills** teach one skill each with a lesson, then check you with tests that go from red to green.
- **The exam page** rehearses the real thing: a Blackboard-style test with a timer, marked out of 100.
- **Guides** are for the night before and the morning of the test.

## Set up (once)

1. Install **Node.js 24** (LTS) from nodejs.org. Any editor works; VS Code is the easiest.
2. Clone and install:
   ```bash
   git clone https://github.com/DDC-endpoint/ACSD-practice.git
   cd ACSD-practice
   npm install
   ```
3. Check it works with `npm test`. You'll see lots of **red**: that's every drill waiting for you.

> Get updates any time with `git pull`. Stay on `main`; never work on the `solutions` branch.

## 1 · Do a drill

1. Open `drills/dNN-…/LESSON.md`. In VS Code, use **Open Preview** (`Ctrl+Shift+V`). Read **The idea** and the **Worked example**.
2. Do **Your task** in `src/…`. Each `// TODO dNN-n` says what to write. Open the **Hints** one at a time, and only when you're stuck.
3. Run that drill's tests until they're all green:
   ```bash
   npm test -- d05
   ```
   Use `npx vitest d05` to re-run them automatically on every save.
4. **Write it from memory.** The ICT has no editor, so close the file and write the key lines on paper.
5. Answer the **Viva questions** the way you'd type them into a Section C/D box, then open the answers.

Each drill has a PDF too: `LESSON.pdf` (lesson and questions only) and `HINTS.pdf` (hints and answers).

| Drill | Skill | Mock questions | Min |
|---|---|---|---|
| d01 | array methods (`map`, `filter`, `find`, `reduce`, `some`/`every`), `Promise.all` | A1 A7 B3 **C1** | 25 |
| d02 | TypeScript: `interface`, `type`, optional `?`, union `\|`, narrowing | A3 A8 A14 B2 B13 **C2** | 25 |
| d03 | React props, `useState`, conditional rendering, lists and keys | A4 | 25 |
| d04 | custom Hooks and the Rules of Hooks | B4 | 25 |
| d05 | React Router: shared layout + `<Outlet />`, `useParams`, `useNavigate`, `useSearchParams` | A2 A6 A10 A18 B1 B8 B11 **C3 D1** | 30 |
| d06 | fetch + `useEffect` + `AbortController`, service module, status codes 401/403/204 | A5 A13 A19 B5 **C5 D2** | 30 |
| d07 | form validation, POST/PUT with headers + `JSON.stringify` | A17 B9 B10 **D3** | 30 |
| d08 | TanStack Query: `useQuery`, `staleTime`, `useMutation`, `invalidateQueries` | A11 A15 B6 **C4 D4** | 30 |
| d09 | Zustand: stores, actions, selectors; Zustand vs TanStack Query | A12 B7 B14 **D4** | 25 |
| d10 | JWT `exp`, protected routes, roles, authN vs authZ, 401 vs 403, HTTPS, untrusted data | B15 **E1–E5** | 30 |
| d11 | CSS `grid-template-areas`, `minmax`, `clamp`, `:focus-visible` | A9 A16 A20 B12 | 20 |

Every one of the mock's 49 questions is covered by at least one drill. **Bold** marks the written-answer questions (C, D) and Section E.

## 2 · Sit a mock (exam conditions)

Open **`exam/index.html`** in Chrome or Edge: double-click it, or drag it into the browser. It runs from the file with no internet and no install.

1. Pick a paper:
   - **Mock 1** is the module's own mock (`ACSD_Mock_ICT_In-Class_Test.docx`), word for word, with a full answer key.
   - **Mock 2** has new questions on the same blueprint, so you can't just remember the answers.
2. Pick a mode:
   - **Exam:** a 90-minute countdown that keeps running through a refresh, auto-submits at 0, and shows results only after you submit. **Do this one before Wednesday.**
   - **Practice:** no timer. A **Check** button on each question shows the answer and why.
3. After you submit:
   - Sections A, B and E are marked exactly.
   - Sections C and D are marked against a rubric, giving a **provisional** score. The page shows the model answer and ticks the rubric points it found in your answer. **Tick or untick them honestly**, and the total updates.
   - Answers autosave in your browser, and past attempts appear on the start screen.

## 3 · Guides

- **[Exam-day guide](guides/EXAM-DAY.pdf)** ([Markdown](guides/EXAM-DAY.md)): the format, a minute-by-minute plan, MCQ/TF traps, how to write code answers in a text box, and a night-before checklist.
- **[Concept refresher](guides/REFRESHER.pdf)** ([Markdown](guides/REFRESHER.md)): every mock topic, each with a snippet and an **"In the exam:"** one-liner, plus a table of MCQ traps. Read it on the morning of the test.

## The plan (Mon 23 → Wed 25 Nov)

| When | Do |
|---|---|
| Mon night | d01, d02 (warm-up: arrays + types). Then sleep. |
| Tue morning | d05 → d06 → d07. These are D1/D2/D3, worth 30 marks. |
| Tue midday | d08 → d09 (D4 + C4), then d10 (Section E + B15). |
| Tue afternoon | d03, d04, d11 (quicker). Read the lessons if you're short on time. |
| Tue evening | **Mock 1 in Exam mode, 90 min, timed.** Review every wrong answer. Redo the drill behind your weakest section. |
| Wed morning | **Mock 2** in Practice mode (or Exam if there's time). Then the refresher's **Traps** table on the way in. |

**If you're behind:**
1. Never skip d05–d09: they carry Section D (40 marks).
2. Read d03/d04/d11 instead of coding them.
3. Always sit Mock 1 timed.

## Check your answers

The model answers live on the `solutions` branch. **Don't check out `solutions`**; compare against it instead:
```bash
git fetch origin solutions
git diff main origin/solutions -- drills/d05-react-router
```
Or browse the `solutions` branch on GitHub.

## Friends: fork it and sit the mocks

1. On GitHub, click **Fork**. **Untick "Copy the `main` branch only"**, so you also get `solutions`.
2. Clone **your** fork, then run `npm install`.
3. Open `exam/index.html` and sit Mock 1 in Exam mode. The drills work the same way for you.
4. Get updates: on GitHub click **Sync fork**, then `git pull`.

## For maintainers

- `bash scripts/selfcheck.sh` checks that:
  - every starter type-checks, every drill starts red, and every test file loads
  - the exam marking tests pass, and the exam page has no network loads and no branding
  - `solutions` is all green and differs only under `drills/*/src/`
- `bash scripts/build-pdfs.sh` rebuilds every PDF from the Markdown. It needs Chrome or Edge.
- The exam page is `exam/index.html` + `exam.css` + `app.js` (UI) + `marking.js` (marking) + `papers/*.js` (questions and answers). It uses classic scripts so it works from `file://`.
