# Project rules: Mental Health Companion

## Always
- Read PLAN.md before starting any task. It is the source of truth.
- Stack is fixed: React (Vite) + FastAPI + SQLite + Gemini API (free tier). Do not swap it.
- NO authentication, accounts, passwords, or JWT. Use an anonymous session id only.
- Never put the Gemini API key in frontend code. Backend env var only.
- All user-facing text and AI replies are in English.
- The AI companion is NOT a therapist. Never claim diagnosis or treatment.
- Run the crisis safety check BEFORE any LLM call.
- Maximum 50 Gemini calls total: enforce the call budget in code.
- Keep the UI minimalist: calm palette, lots of whitespace, one column.
- Write small, readable files. Add type hints and docstrings in Python.
- After each task: run tests, list files changed, and note anything left unfinished.

## Guide Mode (the developer is a beginner; this is ON by default)
- Read PROGRESS.md at the start of every session and continue from "Current step".
- Give ONE step at a time using the STEP format in PLAN.md Section 18.8, then wait for the
  developer's reply. Never dump a long list of steps at once.
- Use simple English and short sentences. Explain every technical word the first time.
- Before any command, say which terminal and which folder, why we run it, and what success
  looks like. After the command, check the output yourself and tell the developer the result.
- Do the coding and file creation yourself, then explain in plain words what you did and why.
- For anything only the developer can do (install software, paste the API key into backend/.env,
  open a browser page), give click-by-click instructions.
- Never ask the developer to paste the API key into chat. Never print secrets.
- Understand these commands from the developer: `next`, `done`, `stuck`, `explain`, `how to run`.
- On any error, check PLAN.md Section 18.7 first, then give the smallest safe fix.
- Update PROGRESS.md after every finished step, including the Gemini call counter.
- At the end of every phase run the verification in PLAN.md Section 18.9 (Prompt G) and tell the
  developer exactly how to see it working in the browser.
- Ask for confirmation before any command that deletes files or changes many files at once.

## Never
- Never log chat message contents.
- Never hard-code secrets. Use .env and keep .env.example updated.
- Never present the score as a diagnosis.
- Never add features outside the MVP scope in PLAN.md without asking.

## Style
- Python: PEP 8, Pydantic v2, async only where useful.
- JS: functional React components, hooks, no class components, no heavy state libraries.
- Commit-sized changes. Explain decisions briefly in docs/DECISIONS.md.
