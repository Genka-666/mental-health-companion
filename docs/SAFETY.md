# Mental Health Companion — Safety & Guardrails Architecture

## 1. Core Safety Principles
1. **Not a Clinical Tool**: The companion is strictly an educational wellbeing self-reflection tool. It never claims to be a doctor, therapist, or diagnostic device.
2. **Pre-LLM Safety Interception**: After request validation, the latest user message passes through a deterministic keyword crisis filter before a language model is invoked. This does not guarantee detection of every expression of distress or danger.
3. **Hard-Coded Crisis Response**: If the keyword filter detects a monitored phrase, the server returns a fixed helpline response without making an LLM API call. A valid Gemini risk classification of `crisis` also selects that fixed response.
4. **Zero Improvised Crisis Advice**: Language models are not allowed to improvise crisis intervention instructions or advice.
5. **Clear Persistent Disclaimers**: Disclaimers are displayed on the Welcome screen, Result screen, Chat screen, and in the global footer.
6. **Data Minimization & Erasure**: The app does not request account credentials. Messages may still contain personal information supplied by the visitor. A confirmation dialog allows deletion of app-server records, including for chat-only visitors. Messages are processed by Google Gemini and app deletion does not delete provider-retained records.

---

## 2. Verified Indian Helplines
Helpline numbers are centralized in `backend/app/config.py`:
- **Tele-MANAS (Government of India National Mental Health Helpline)**: `14416` (24x7, toll-free, multi-lingual)
- **Tele-MANAS Alternate Toll-Free**: `1-800-891-4416`
- **National Emergency Number**: `112`

---

## 3. Pre-LLM Keyword Filter (`backend/app/services/safety.py`)
Incoming text is normalized with Unicode NFKC and case folding; invisible formatting characters are removed, and punctuation is replaced with spaces before scanning. This handles selected compatibility forms such as full-width Latin text and zero-width characters inside words, rather than every possible obfuscation.

### English Phrases Monitored:
- `"kill myself"`
- `"end my life"`
- `"want to die"`
- `"suicide"`, `"suicidal"`
- `"self harm"`, `"hurt myself"`
- `"no reason to live"`
- `"don't want to be here anymore"`
- `"better off without me"`
- `"cut myself"`, `"hang myself"`, `"slit my wrists"`, `"overdose"`
- `"wish i was dead"`, `"can't go on living"`
- `"wish i wouldn't wake up"`, `"hope i don't wake up"` and selected expanded-contraction variants
- `"can't keep myself safe"`, `"cannot keep myself safe"`, `"not safe with myself"`

### Hinglish Phrases Monitored:
- `"mar jana chahta"`, `"mar jana chahti"`
- `"jeena nahi chahta"`, `"jeena nahi chahti"`
- `"khud ko khatam"`
- `"jaan de dunga"`, `"jaan de dungi"`
- `"marne ka mann"`
- `"zindagi khatam"`
- `"khudkushi"`, `"aatmhatya"`

---

## 4. Nuanced Handling of Normal Distress
Safety filters intentionally distinguish between crisis phrases and everyday sadness or stress:
- Statements such as *"I had a bad day"*, *"I feel low today"*, or *"I am overwhelmed by exams"* do **not** trigger crisis mode.
- Instead, they route to the supportive AI listener with empathetic reflections and gentle coping questions.

---

## 5. System Prompt Boundaries (`backend/app/services/prompts.py`)
The system prompt strictly commands the companion ("Saathi") to:
- Never diagnose conditions or use medical labels as conclusions.
- Never prescribe medication, supplements, or dosages.
- Never describe methods of self-harm.
- Refuse requests to act as a medical practitioner.
- Return structured JSON with a `risk` classification (`none`, `elevated`, or `crisis`).

---

## 6. Audit & Test Results
The tests cover monitored crisis phrases, selected Hinglish phrases, selected everyday distress phrases, and the fixed-response path. Additional chat tests cover invalid response schemas, LLM-reported crisis risk and budget exhaustion.

During the current revision, the existing 16 pure keyword assertions and four additional phrasing/boundary assertions passed in isolation. All 36 backend pytest cases then passed in the user's normal terminal, including the API crisis path and new Gemini-output tests. These selected cases do not establish comprehensive crisis detection, clinical safety or resistance to all prompt attacks. Prompt instructions are safeguards, not guarantees of model behavior.

Never return malformed Gemini output as raw text. Validate the risk classification first: a valid `crisis` flag selects the fixed crisis reply even when generated reply text is missing or invalid. For `none` or `elevated`, the reply must also satisfy the Pydantic schema, including a non-empty string; otherwise use the fixed error fallback. Invalid JSON or an invalid/missing risk flag also uses the error fallback. Logs may include exception types, numeric HTTP status codes and fixed messages, but must exclude provider error strings, API keys and chat text. Two provider-failure tests verify those logging boundaries.

After the chat refinement, all **64 backend tests passed**, including 23 new cases covering independent crisis classification, Unicode variants, ordinary stress, whitespace validation, context bounds and crisis handling with an exhausted budget. Tests use a default fake provider and temporary databases; they do not verify live model response quality.
