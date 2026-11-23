# CLAUDE.md — ACSD-practice

Practice pack for the ACSD (5COSC026W) in-class test (ICT): **25 Nov 2026**, 90 min, 100 marks, on Blackboard. Sections: A 20 MCQ · B 15 True/False · C 5 × 3 short answer · D 4 × 10 programming/analysis · E 5 × 2 security.

## Session rules
- **Start of session:** read `HANDOFF.md`. **End of session:** update it (current state, next steps, dated log entry).
- Use SpecClaw for build work (`/specclaw:propose` → plan → build → verify → pr). Conventions live in `.specclaw/context.md`.
- The learner codes first and looks things up, and is a self-described TS/React beginner. Lessons lead with a task and stay beginner-friendly.
- Never put solution bodies on `main`. `solutions` = `main` + completed `drills/*/src/` files only.
- The student's own drill work may sit uncommitted in their tree. **Never commit it.** Use a git worktree for git work.

## Commands
- `npm test` (all) · `npm test -- d05` (one drill) · `npm run typecheck` · `bash scripts/selfcheck.sh` · `bash scripts/build-pdfs.sh`
- Exam page: open `exam/index.html` in Chrome/Edge (works from `file://`, offline).

## Related
- Module materials: `D:\year-2-prep\ACSD\` (mock: `00_Module_Info/ACSD_Mock_ICT_In-Class_Test.docx`).
- Sister pack: `D:\OOP-practice` (same structure, Java).
