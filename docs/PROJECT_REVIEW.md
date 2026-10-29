# Project review — 29 October 2026

This is the historical baseline review. A subsequent implementation addresses several findings below; see [implementation notes](IMPLEMENTATION_NOTES.md) for changes and current verification limits.

The project has a complete MVP implementation, but its current runtime and deployment readiness are unverified. Several functional issues need fixing before publication. This review covers the source, training notebook, dataset, existing tests, configuration examples, and deployment documentation. No application behavior was changed during the review.

## Product and application versions

**Mansik Santulan** is a student habit and wellbeing companion. **Saathi** is its Gemini-powered chat companion. The intended flow is welcome → ten-screen check-in → score, suggestions and what-if estimates → optional chat and history.

There are two implementations in this folder:

| Location | Purpose | Deployment relevance |
| --- | --- | --- |
| `frontend/` and `backend/` | Current React application and full FastAPI API | Use these for the companion project. |
| Root `index.html`, `style.css`, `script.js`, `main.py`, `requirements.txt` | Earlier score-only application | Different API response format; no companion chat/history. Root JavaScript points to an existing Render hostname whose availability was not tested. |

Deploying the folder root without deliberate configuration risks selecting the earlier application. The root Python API returns `predicted_mental_health_score`; the current React application expects `score`, `band`, `tips`, `what_if`, and `disclaimer`.

## Current architecture

| Component | Implementation |
| --- | --- |
| User interface | React 18, Vite 5, plain CSS, sage palette, automatic dark theme, reduced-motion support |
| Screens | Welcome, CheckIn, Result, Chat, History; navigation uses React state rather than URL routes |
| API | FastAPI, Pydantic validation, CORS, startup model loading and database initialization |
| Scoring | A saved scikit-learn preprocessing and random forest pipeline, loaded through joblib |
| Suggestions | Ordered Python rules, at most four tips, no Gemini calls |
| What-if estimates | Predictions with altered sleep, screen time or activity, compared with the original score |
| Chat | Server-side `google-genai` client; recent conversation context; JSON reply and risk classification |
| Safety | English/Hinglish keyword screening before Gemini; fixed crisis response; LLM crisis flag also selects the fixed reply |
| Storage | SQLite tables: `sessions`, `assessments`, `messages`, `llm_usage`; foreign-key cascading deletion |
| Session identity | Browser-generated UUID in `localStorage`, sent as `X-Session-Id`; no login |

The global Gemini usage counter belongs to the whole installation, not each visitor. Its configured default is 50 successful calls. A fresh database resets it.

### API contract

| Endpoint | Behavior |
| --- | --- |
| `GET /health` | Health response; no session header required. Startup must load the model and initialize SQLite first. |
| `POST /predict` | Validates 12 inputs, predicts a score clipped to 0–10, returns tips and what-if estimates, saves the assessment. |
| `POST /chat` | Accepts 1–20 messages, each 1–2,000 characters; last message must be from the user. Saves the latest turn. |
| `GET /history` | Returns the session's assessment scores, bands and timestamps, oldest first. |
| `DELETE /me` | Removes the session and its stored assessments/messages. Does not reset the global usage counter. |

Score bands are Low below 5, Moderate from 5 through 7, and Good above 7. The browser renders these values; it does not calculate predictions itself.

## Model and dataset

- CSV: 5,000 rows, 13 columns, including 12 source inputs and the `Mental_Health_Score` target.
- Observed ages: **18–24**. Observed target scores: **3.6–9.4**. The UI accepts ages 14–60 and the API accepts 10–100, substantially beyond the observed training population.
- Preprocessing: log transform and scaling for study hours, scaling for other numeric inputs, ordinal stress encoding, and one-hot encoding for categorical inputs. Less common countries map to `Other`.
- Notebook split: 70% training, 30% test, random seed 42. The export cell saves the default random forest pipeline, rather than the tuned model.
- Saved notebook metrics for that model: test **R² 0.8774**, **MAE 0.3477**, **RMSE 0.4640**. These are recorded notebook outputs, not metrics rerun during this review; R² is not percentage classification accuracy.
- Both model copies are byte-identical, **25,695,907 bytes** each. Their embedded scikit-learn version is **1.9.0**. Backend requirements currently allow `scikit-learn>=1.4.0`, which does not reproduce the training environment. Runtime compatibility needs verification and dependency pinning. Model loading currently suppresses warnings.
- The supplied materials do not establish clinical validation or dataset provenance. Scores and what-if differences should remain clearly labeled as estimates; they cannot establish that changing a habit will cause a particular outcome.

## Findings to resolve

| Priority | Finding and evidence | Required outcome |
| --- | --- | --- |
| Before deployment | `frontend/src/pages/Chat.jsx` sends the entire visible conversation. Starting with its greeting, the 11th normal user message sends 22 messages; `backend/app/schemas.py` permits at most 20. Crisis messages at that point also fail validation before reaching the safety handler. | Bound the transmitted conversation while preserving the newest user message; verify a long conversation and crisis handling after it. |
| Before deployment | `frontend/src/pages/History.jsx` renders the deletion control only when an assessment exists. A chat-only visitor has stored messages but cannot reach deletion. | Make deletion available independently of assessment count, including when history loading fails. |
| Before deployment | `frontend/src/session.js` creates a new UUID on every call when browser storage is unavailable. This was reproduced directly in Node. | Keep one fallback ID in memory for the page session and rotate it only on reset. |
| Before deployment | `backend/app/services/llm.py` checks usage and increments it in separate operations, after the API call. Concurrent requests can exceed the cap; failed attempts/retries are not counted. | Reserve attempts atomically and define/enforce the budget against actual external attempts. |
| Before deployment | Gemini JSON parsing accepts an unvalidated object and returns raw output when parsing fails. Wrong field types, missing fields or non-object JSON can yield empty replies, errors or unvalidated text. | Validate the output schema and use the fixed error fallback for malformed responses; add targeted tests. |
| Before deployment | No `.env`, `backend/.env`, or `frontend/.env` exists here. The default frontend API target is `http://localhost:8000`. The backend permits local origins by default. | Configure the real HTTPS API URL and exact frontend CORS origins; provide the Gemini key only to the backend. |
| Before deployment | `backend/app/config.py` defaults to `gemini-3.8-flash`, while the root/backend environment templates use `gemini-2.5-flash`. | Align documentation and defaults, then verify access with the chosen account. Google currently limits 2.5 access for new projects; see the model documentation below. |
| Before deployment | SQLite needs durable shared storage. Current database initialization writes into the backend tree by default. | Choose a host with a persistent disk for the current backend, or explicitly approve and implement external storage for a Vercel backend. |
| Before public use | The welcome page says private/anonymous, but does not explain that chat context goes to Google. `docs/SAFETY.md` overstates what keyword checks and prompt instructions guarantee. | Explain data processing accurately, avoid confidentiality guarantees, and document safety limits. |
| Before public use | Keyword screening checks only the latest user message and cannot reliably recognize all indirect crisis phrasing. A manual probe with indirect wording was not detected. Existing tests mainly exercise phrases already in the list. | Expand meaningful safety tests, validate the LLM risk fallback, and avoid claiming comprehensive crisis detection. |
| Reliability | Chat lives only in component state and resets when navigating away. The score remains in `App` state after server data deletion, so returning to chat can reuse the deleted score. | Define expected conversation persistence and clear relevant application state after deletion. |
| Reliability | No fetch timeout, provider timeout configuration, or application rate limit is implemented. UUID parsing forces version 4 rather than verifying the supplied version. | Add appropriate timeouts, abuse controls and strict UUID validation within the existing anonymous-session design. |
| Usability | Mobile layout and keyboard behavior need browser verification. Header controls do not have a mobile layout rule; dialogs lack explicit focus management. | Check narrow screens and keyboard navigation with the running app. |
| Reproducibility | Backend dependencies have broad minimum versions and no lockfile; this environment lacks the Python packages and installed frontend dependencies. `.git` is an empty read-only directory and `git status` fails. | Establish a reproducible environment, rerun verification, and arrange a working source repository before Git-based deployment. |

## Verification performed

| Check | Result |
| --- | --- |
| Python source syntax | Passed for all 22 Python files using the standard-library parser. |
| Existing pure safety test functions | Both executed in isolation against the actual safety module: 16 assertions passed. This is not a full pytest run. |
| Browser session helper | Direct Node probe confirmed a stable ID with storage and changing IDs without storage. |
| Model artifacts | Both copies exist and have matching SHA-256 hashes; the serialized version marker was inspected without loading the model. |
| Existing backend tests | 18 test functions are present. Full pytest execution is blocked by missing dependencies. |
| Frontend dependency installation | Attempted `npm ci` with a temporary cache; failed. Logs show registry DNS errors (`EAI_AGAIN`). |
| Frontend production build | Attempted `npm run build`; failed because `vite` is unavailable after dependency installation failed. |
| Backend dependency installation | Created an isolated virtual environment in `/tmp` and attempted installation; the configured package source returned no available FastAPI distribution. |
| Live Gemini, loaded-model prediction, API integration, browser layout | Not verified in this environment. No live Gemini calls were made. |

Installed runtimes here are Python **3.14.0** and Node **22.22.2**. Historical Windows runtime/build/test claims in `PROGRESS.md` describe a different environment and are not current verification.

## Vercel deployment path

The frontend deployment settings are straightforward once its build passes:

- Root directory: `frontend`
- Framework: Vite
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_BASE=https://<deployed-backend-host>`; this value is embedded at build time.
- Backend environment: `GEMINI_API_KEY`, a verified `GEMINI_MODEL`, `MAX_LLM_CALLS`, `CORS_ORIGINS=https://<frontend-host>`, and an absolute durable `DATABASE_PATH`.

The existing project plan specifies a separate Python backend and Vercel frontend. Keeping SQLite requires a backend host with persistent storage; a temporary free filesystem would lose assessments, messages and the shared budget counter on replacement.

Vercel also supports FastAPI deployments. Hosting this backend there requires adapting its persistence to a shared external database and checking the Python dependency/model bundle and startup constraints. That is an architecture change to plan explicitly, rather than solving persistence with a `/tmp` database. No deployment was created during this review.

Official references checked on the review date:

- [Vercel FastAPI deployment and supported entrypoints](https://vercel.com/docs/frameworks/backend/fastapi)
- [Vercel explanation of SQLite and ephemeral function storage](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel)
- [Google Gemini model names and access notes](https://ai.google.dev/gemini-api/docs/models)

## Proposed work order

1. Restore dependency installation, choose a compatible Python environment, load the existing model and run the 18 backend tests plus the frontend build.
2. Fix long-chat requests, session fallback, data deletion and Gemini response validation/budget handling, with targeted regression checks.
3. Run the full user journey locally: prediction, suggestions, chat, crisis flow, history and deletion; verify mobile and keyboard behavior.
4. Configure durable backend hosting, production environment variables and CORS; deploy the frontend on Vercel and repeat the live checks.
