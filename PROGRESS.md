# Progress tracker (updated by Antigravity after every step)

## Setup
- [x] Python, Node, Git installed and checked
- [x] Antigravity signed in
- [x] Gemini API key configured in backend/.env
- [x] GEMINI.md, 14 skills, 9 workflows created (Phase 0)

## Phases
- [x] Phase 1: Backend core (/health, /predict) working at localhost:8000/docs
- [x] Phase 2: Suggestions, history, delete-my-data working
- [x] Phase 3: Safety + chat working, 18 automated tests pass
- [x] Phase 4: Frontend foundation (Welcome + Check-in wizard) at localhost:5173
- [x] Phase 5: Result, Chat, History pages connected & built with zero errors
- [x] Phase 6: Docs written (API, SAFETY, DECISIONS, DEMO_SCRIPT, README)
- [ ] Phase 7 (optional): Leaner model

## Current step
Resolved the live chat fallback: a diagnostic request to Gemini 3.8 Flash returned HTTP 503, while Gemini 3.5 Flash-Lite returned a valid reply with the same key. Updated the local backend environment, default model and example environments to `gemini-3.5-flash-lite`. The running server reloaded automatically, and a real `/chat` request returned HTTP 200 with a valid non-crisis reply in 13.43 seconds. All **66 backend tests pass** with mocked Gemini calls and temporary databases. Broader conversation-quality review, browser checks and deployment remain pending. Earlier chat refinements and verification are recorded below.

## Notes and problems
The following Windows results are historical; they have not been reproduced in the current Linux environment.

- Python 3.12.7 and Node 22.17.1 verified on Windows machine.
- Scikit-learn model `Mental_Health_Model.pkl` successfully served with top-10 country logic.
- Gemini integration configured with call budget, error fallback, and pre-LLM crisis keyword guardrails.
- 18 pytest tests passing with 100% success rate.
- Frontend builds cleanly via Vite in < 1 second.

### Review on 29 October 2026
- Current runtimes: Python 3.14.0 and Node 22.22.2. No configured `.env` files are present.
- All 22 Python files passed syntax parsing. Two existing safety test functions passed in isolation (16 assertions); this is not a full pytest run.
- Frontend installation failed with registry DNS errors. Production build failed because Vite is missing. Backend installation could not resolve FastAPI from the configured package source; the full suite could not run.
- Confirmed issues include long-chat requests exceeding the API limit, hidden deletion for chat-only visitors, and unstable session IDs when browser storage is unavailable.
- Both model copies are identical and record scikit-learn 1.9.0; exact runtime compatibility needs verification.
- Git commands fail because `.git` is empty in this workspace. Vercel frontend deployment needs an explicit `frontend` root and deployed API URL; backend persistence must be resolved.
- Review changed documentation only. No live Gemini calls were made; historical live usage cannot be verified without the original database.

## Gemini calls used so far
The live-failure investigation used **3 counted provider attempts**: one 3.8 Flash failure, one successful 3.5 Flash-Lite service check and one successful running-API check. The final observed counter was **8 / 50 used, 42 remaining**. The synthetic API session was deleted after verification. Automated tests use fake providers and consume no live calls. The counter is shared across sessions and counts failures; read the runtime database for a fresh count.

## Live chat fallback fix — 29 October 2026
- Reproduced the screenshot's fallback with a generic exam-stress message: Gemini 3.8 Flash returned HTTP 503 in 15.5 seconds. The key was configured and the shared budget was not exhausted.
- Listed available models without making a generation request, then verified `gemini-3.5-flash-lite` with the same key. The direct service returned a valid reply in 14.96 seconds.
- Updated only `GEMINI_MODEL` in gitignored `backend/.env`, preserving the key. Aligned `backend/app/config.py`, root `.env.example` and `backend/.env.example` with the working model.
- Removed the custom temperature from `backend/app/services/llm.py`; Google's current documentation says Gemini 3.6+ ignores sampling overrides and plans to reject them. Existing explicit low thinking for an optional 3.8 override remains supported.
- Extended `backend/tests/test_llm_diagnostics.py` for stable and prefixed 3.5 Flash-Lite names and default sampling settings. **66 tests passed** in 2.21 seconds; `git diff --check` passed. The existing Starlette/httpx deprecation warning remains.
- Verified the automatically reloaded server through `/chat`: HTTP 200, valid non-crisis provider reply, 13.43 seconds. Removed only the synthetic test session; no existing visitor records were changed. No commits, pushes or deployments were made.

## Chat behavior refinement — 29 October 2026
- Changed `backend/app/schemas.py` to trim chat text and reject whitespace-only content before storage or provider calls.
- Changed `backend/app/services/llm.py` to validate risk independently, so a valid crisis flag returns the fixed response even when generated reply text is missing, empty, oversized or the wrong type. Non-crisis malformed responses still use the fixed error fallback.
- Changed `backend/app/services/safety.py` to normalize Unicode compatibility forms and invisible formatting characters, and recognize selected explicit safety and passive-death phrases. This remains a limited phrase filter.
- Changed `backend/app/services/prompts.py` to guide contextual listening, avoid repetitive or declined suggestions, preserve instruction boundaries, and avoid claiming memory beyond the supplied conversation.
- Added `backend/tests/test_chat_behavior.py` and a default mocked provider in `backend/tests/conftest.py`. The new cases cover crisis flags with malformed replies, empty input, stored/provider text normalization, recent user-first context, Unicode phrases, ordinary stress, and crisis handling at the 20-message limit with an exhausted budget.
- Verification: full backend suite **64 passed** in 2.17 seconds; `git diff --check` passed. One existing Starlette/httpx deprecation warning remains. No live API calls, commits, pushes or deployments were made.

## Interface and reliability revision — 29 October 2026
- Implemented new styling and navigation across all five screens, native dialogs, accessible form controls, responsive layouts, dark mode and clearer privacy wording.
- Fixed long-chat payload limits, session fallback, chat-only data deletion, in-memory state reset after deletion, request timeouts, strict Gemini output parsing, UUID validation and atomic provider-call reservations.
- Added seven frontend regression checks and targeted backend regression cases. All 36 backend cases passed in the user's terminal, and the normal Vite build passed with the declared React 18 dependencies. An earlier temporary cached-tool preview was used only before normal dependencies became available.
- Git repository now exists at `https://github.com/Genka-666/mental-health-companion`; initial commit and tracked `origin/main` matched before this work. The earlier empty-repository observation is historical. Current edits have not been committed or pushed.
