# Mental Health Companion — Safety & Guardrails Architecture

## 1. Core Safety Principles
1. **Not a Clinical Tool**: The companion is strictly an educational wellbeing self-reflection tool. It never claims to be a doctor, therapist, or diagnostic device.
2. **Pre-LLM Safety Interception**: All incoming messages pass through a deterministic keyword crisis filter *before* any language model is ever invoked.
3. **Hard-Coded Crisis Response**: If any self-harm or suicidal intent is detected, the server returns a fixed, verified helpline response immediately without making an LLM API call.
4. **Zero Improvised Crisis Advice**: Language models are not allowed to improvise crisis intervention instructions or advice.
5. **Clear Persistent Disclaimers**: Disclaimers are displayed on the Welcome screen, Result screen, Chat screen, and in the global footer.
6. **Data Minimization & Erasure**: No user identities or credentials are stored. Users can delete all records with a single click.

---

## 2. Verified Indian Helplines
Helpline numbers are centralized in `backend/app/config.py`:
- **Tele-MANAS (Government of India National Mental Health Helpline)**: `14416` (24x7, toll-free, multi-lingual)
- **Tele-MANAS Alternate Toll-Free**: `1-800-891-4416`
- **National Emergency Number**: `112`

---

## 3. Pre-LLM Keyword Filter (`backend/app/services/safety.py`)
Incoming text is lowercased and stripped of punctuation before scanning.

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
Automated test coverage (`backend/tests/test_safety.py`) verifies:
- [x] Clear crisis phrases trigger the fixed helpline reply.
- [x] Crisis detection results in 0 LLM calls.
- [x] Hinglish crisis phrases are accurately identified.
- [x] Non-crisis emotional low statements do not false-positive.
