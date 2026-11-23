---
id: exam-day
module: ACSD
kind: guide
title: ACSD ICT exam-day guide
---

# ACSD ICT · Exam-day guide

The in-class test (ICT) is on **Wednesday 25 Nov 2026**. It's worth **40%** of 5COSC026W, it runs **90 minutes** (+25 for RAF students) and it's out of **100 marks**. You sit it **on Blackboard**, not in Word, with no editor, no autocomplete and no tests. Everything below comes from the module's mock paper.

## The paper at a glance

| Section | What | Marks | Suggested time | Answer by |
|---|---|---|---|---|
| A | 20 multiple choice (1 mark each) | 20 | 15 min | picking one option |
| B | 15 true/false (1 mark each) | 15 | 10 min | picking True or False |
| C | 5 short answers (3 marks each) | 15 | 15 min | typing 1–3 lines of code or 2–3 sentences |
| D | 4 programming + analysis (10 marks each) | 40 | 40 min | typing code and explanations, in parts a–d |
| E | 5 front-end security (2 marks each) | 10 | 10 min | MCQ and true/false |

Section D is **40% of the paper**. Protect its 40 minutes.

## Minute-by-minute plan

| Clock | Do |
|---|---|
| 0–2 | Read the instructions. Check the timer shows on Blackboard. |
| 2–15 | **Section A.** About 40 seconds each. Unsure? Pick your best guess, flag it and move on. |
| 15–25 | **Section B.** Look for absolute words (see the traps below). |
| 25–35 | **Section E.** It's quick: MCQ/TF on security. Doing it now banks 10 marks before the long questions. |
| 35–75 | **Section D.** 10 minutes per question. Do the part you know best first, so every question gets some marks. |
| 75–88 | **Section C.** 2–3 minutes each. These are D in miniature, and the drills cover all of them. |
| 88–90 | Check that every question has an answer (no blanks: a guess can score, a blank can't). Submit. |

> Prefer doing it in paper order? That's fine. Then put a hard stop on A + B at the 25-minute mark.

## Multiple choice and true/false technique

- **Read the last line of the stem first.** "Which Hook…", "Which status code…". Then read the scenario.
- **Strike the absurd options.** Most questions have two that are plainly unrelated (for example "Database migration" or "CSS font loading" for a rendering question).
- **Absolute words usually make a statement FALSE:** *guarantees, never, always, every, exclusively, requires every, interchangeable, automatically trustworthy*. For example:
  - "Client-side validation **guarantees**…" → False.
  - "Zustand **requires every** component to subscribe to the **entire** store" → False.
  - "TanStack Query and Zustand are **interchangeable**… **exclusively**…" → False.
- **Soft words usually make it TRUE:** *can, may, generally, helps, can be used*. For example:
  - "PUT **can be used** when updating" → True.
  - "HTTPS **helps protect** tokens" → True.
- **Known traps:**
  - `find()` returns the **first** match only; `filter()` returns all of them.
  - 401 means *not authenticated*; 403 means *authenticated but not allowed*.
  - 204 means success with **no body**.
  - `string | number` is "either"; `string & number` is impossible (`never`).
  - `staleTime` is how long cached data counts as **fresh**.
  - `invalidateQueries` marks the data stale so it **refetches**.
  - `<Outlet />` is where child routes render inside a layout.

## Written answers (Sections C and D)

Blackboard gives you a plain text box. Marking is for **logically correct** solutions, so small syntax slips don't sink you, but the marker must be able to see each required piece.

1. **Give each required piece a line.** If the question lists requirements (loading message, error message, count, abort on unmount), make each one visible in the code. A short `// loading` comment helps the marker find it.
2. **Use the exact names the question gives.** "Store the result in a variable named `total`" → `const total = …`. "An interface named `Product`" → `interface Product`.
3. **Match the marks.** A 2-mark "explain" needs 2 points in 2–3 sentences. A 4-mark code part needs every listed requirement covered.
4. **Name the Hook or function, *and* say what it does.** "Name the Hook and describe its use" needs both: `useNavigate()` returns a `navigate` function, and you call `navigate("/settings")` after saving.
5. **Indent with two spaces.** Tab may jump out of the text box. Keep the code short; imports only if the question is about them.
6. **Explanations: claim, then reason.** "A service module keeps the fetch logic in one place, **so** every component reuses the same code, and a change to the URL or the headers happens once."

## The night before

- [ ] Sit **Mock 1** in **Exam** mode on the exam page (`exam/index.html`). Then review every wrong answer.
- [ ] Re-read the **Refresher** sections for the topics you lost marks on.
- [ ] Write the four big answers from memory on paper: D1 router config, the D2 fetch + `AbortController` component, the D3 validate + POST, and D4 Zustand vs TanStack Query.
- [ ] Check your Blackboard login works, and that you know which room or lab you're in and when.
- [ ] Sleep. A tired brain misreads the MCQs.

## On the day

- Charge your laptop, or plan for a lab machine, and bring your student ID.
- Read the refresher's **Traps** table on the way in.
- In the room: no notes and no AI. Close everything except Blackboard.
- **Don't refresh the Blackboard test page.** If anything breaks, put your hand up straight away.
- Answer **every** question. There's no negative marking in the mock's instructions.
