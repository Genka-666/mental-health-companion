# Architecture & Technical Decision Record (ADR)

## Working live chat model — 29 October 2026

- Use `gemini-3.5-flash-lite` as the default and local demo model after a counted 3.8 Flash request returned HTTP 503 and the same key successfully generated a reply with 3.5 Flash-Lite. Model listing alone does not prove generation availability. A subsequent request through the running `/chat` endpoint returned a valid reply in 13.43 seconds.
- Align both example environments with the verified default, preserving the `GEMINI_MODEL` override. Keep one provider attempt per chat turn, existing atomic budget reservations and the current request deadlines.
- Omit custom sampling parameters. Google's [troubleshooting guide](https://ai.google.dev/gemini-api/docs/troubleshooting) says Gemini 3.6+ ignores them and plans to reject them; provider defaults also work with the selected model. Google documents [structured output support for 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite).
- Three live diagnostic attempts consumed three shared budget slots; the observed total was 8/50. The generated test session was removed. All 66 automated tests pass without live requests. A successful basic reply does not establish general response quality or future provider availability.

## Chat behavior refinement — 29 October 2026

- Validate the provider's risk flag separately from its reply. A valid crisis flag takes precedence over malformed or missing reply text and selects the existing fixed response. Non-crisis output still requires a valid reply; malformed JSON and invalid classifications retain the error fallback.
- Trim surrounding chat whitespace and reject empty messages before storage or provider calls. Keep the existing request/response fields and bounded conversation window.
- Normalize compatibility Unicode forms and invisible formatting characters in the phrase filter, and add selected explicit danger phrases. Retain ordinary-stress regression cases and document the filter's limits.
- Guide the model to follow the supplied context, listen when advice is unwanted, avoid repeating declined suggestions, and treat conversation content as unable to override system boundaries. These are prompt instructions; live response quality remains to be checked.
- Supply a fake Gemini client by default across backend tests. All 64 tests pass with temporary databases and no live provider calls.

## Reliability and interface revision — 29 October 2026

- Keep React, Vite, FastAPI, SQLite, anonymous sessions and Gemini. No new runtime frontend dependencies were added.
- Use warm ivory and green, an Lora/DM Sans typography pairing, one centered content column, shared styles and reusable SVG icons. The shared content column is 620px and the outer header is wider to give navigation more room. This deliberately increases the earlier 560px design target while preserving one-column forms.
- Use native HTML dialogs for keyboard focus containment, Escape handling and focus return. Keep the chat mounted while navigating to preserve conversation state in memory; page reload intentionally resets it.
- Hold data deletion until current UI chat/history requests finish, block navigation during deletion, and reset the displayed prediction and chat afterward. Deletion remains available for sessions with no assessments and for history error states.
- Reserve each Gemini request atomically in SQLite before sending it. Count failed provider attempts, disable SDK retries, and use a bounded request timeout. The cap remains shared across the installation.
- Require a typed, non-empty Gemini reply and an explicit allowed risk flag. Malformed responses use the fixed fallback instead of being returned raw. A valid crisis flag still selects the fixed crisis response.
- Live testing identified HTTP 504 with the original 20-second provider deadline. Increase the Gemini deadline to 60 seconds and the browser chat deadline to 75 seconds (other browser requests stay at 30 seconds). Use the documented `low` thinking level for the configured Gemini 3.8 Flash model, and allow 2,048 output tokens to leave room for reasoning plus the short JSON reply. Other model overrides retain their default thinking settings. Live success is still being verified.
- Pin scikit-learn to the artifact's embedded 1.9.0 version and stop suppressing model warnings. Full runtime compatibility still requires a successful dependency install and model-load test.
- The earlier Render/Vercel plan remains a proposed deployment path, not a completed deployment. Local SQLite requires durable backend storage; using Vercel for the backend would require an explicit persistence change.

## 1. Google Gemini API for Conversational Support
- **Decision**: Use Google Gemini API via official `google-genai` SDK.
- **Rationale**:
  - Free tier access without mandatory credit card registration.
  - Native JSON mode ensures clean structured output `{reply, risk}`.
  - High empathy and context sensitivity for student emotional support.
- **Budget Control**: Enforced server-side cap of 50 total LLM calls with graceful fallback messages.

---

## 2. No Authentication / Accounts
- **Decision**: Avoid all forms of login, registration, passwords, JWTs, and OAuth. Use an anonymous client-generated UUIDv4 stored in browser `localStorage` and transmitted via `X-Session-Id`.
- **Rationale**:
  - Lowers friction for students seeking emotional support.
  - Eliminates risks associated with storing personally identifiable student credentials.
  - Enables instant "Delete my data" cascading deletion.

---

## 3. Deterministic Suggestions & Rule Engine
- **Decision**: All habit suggestions and score bands are computed deterministically via Python business logic rather than generated by an LLM.
- **Rationale**:
  - Eliminates hallucinations in health tips.
  - High speed, zero token cost, 100% testable.
  - Protects the 50-call LLM budget exclusively for the chat companion.

---

## 4. SQLite for Local Persistence
- **Decision**: Single-file SQLite database with foreign key cascades.
- **Rationale**:
  - Zero deployment overhead.
  - Immediate local development without Docker or external DB services.
  - Ephemeral on free tiers like Render, which fits demo showcases.

---

## 5. React + Vite + Plain CSS Design Tokens
- **Decision**: React with Vite, zero heavy component frameworks, pure CSS tokens in `tokens.css` with calm sage palette and dark mode support.
- **Rationale**:
  - Fast builds (< 1 second).
  - Lightweight bundle size (~191 KB).
  - Clean tactile interface with soft rounded corners and respectful micro-interactions.
- **User Rule Compliance**: Integrated 3D depth scale (`perspective: 1000px`, background layer at `translateZ(-5px)`, interactive cards and controls at `translateZ(0px)`).
