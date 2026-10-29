# Mansik Santulan — Student Mental Health Companion

A calm, minimal web application where students can reflect on daily habits, receive a habit-based wellbeing estimate from a trained machine learning model, explore practical suggestions and "what-if" habit simulations, and chat with a supportive AI companion powered by Google Gemini.

> **Disclaimer:** Support companion, not a therapist. Not medical advice. This tool provides a habit-based wellbeing estimate learned from a survey dataset of 5,000 students. It does not diagnose, treat, or conclude any mental health conditions.

---

## 🌟 Key Features

1. **Check-in Wizard**: 10 calm, accessible screens with steppers, sliders, and tactile segmented buttons.
2. **ML Wellbeing Score**: Real-time scoring using an existing scikit-learn pipeline (`Mental_Health_Model.pkl`).
3. **Deterministic Suggestions**: Practical tips prioritized by lifestyle impact without LLM hallucinations.
4. **What-If Simulations**: Interactive models showing how adjustments (e.g., +1 hour sleep, −1 hour screen time) relate to wellbeing shifts.
5. **Empathetic AI Companion ("Saathi")**: Powered by Google Gemini with strict ethical boundaries and conversation budget controls.
6. **Multi-Layer Crisis Safety**: Pre-LLM keyword interception covering English and Hinglish phrases, returning instant emergency helpline info (Tele-MANAS **14416**, Emergency **112**) with zero LLM latency or improvisation.
7. **Trend History & Data Deletion**: Anonymous UUID sessions in `localStorage`. No accounts, passwords, or emails. Confirmed "Delete my data" cascade wipe of app-server records. Chat context is processed by Google Gemini.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS design tokens (`tokens.css`), inline SVG charts, mobile-first responsive layout.
- **Backend**: FastAPI (Python 3.11+), Pydantic v2 schemas, SQLite (`data/app.db`) with foreign key cascading.
- **Machine Learning**: Scikit-learn, Pandas, Joblib.
- **AI / LLM**: Google Gemini API via official `google-genai` SDK.
- **Testing**: `pytest`, FastAPI `TestClient`, comprehensive unit & safety test suites.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+** installed (`python --version`)
- **Node.js 18+** installed (`node --version`)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend

# Create & activate a virtual environment (Linux / macOS)
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
python -m pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and configure your GEMINI_API_KEY
cp .env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

On Windows PowerShell, create the environment with `python -m venv .venv`, activate it with `.venv\Scripts\Activate.ps1`, and use `Copy-Item .env.example .env` to create the settings file. Put your Gemini key only in `backend/.env`; never paste it into chat or commit it.

- API Health Check: `http://localhost:8000/health` (returns `{"status":"ok"}`)
- Interactive Swagger Docs: `http://localhost:8000/docs`

---

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```

- Web App: Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

Run the full backend test suite (including prediction validation, rule logic, and safety red-team checks):

```bash
cd backend
pytest -q
```

The backend suite runs against an isolated SQLite database with a default mocked Gemini client. All **66 cases passed** on 29 October 2026, covering prediction, history, deletion, safety, malformed AI output, UUID validation, concurrent budget reservations, model configuration, safe diagnostics and 23 chat behavior regressions. The full suite was run outside the restricted sandbox to avoid its TestClient thread stall. See [progress](PROGRESS.md) for the current verification record and [implementation notes](docs/IMPLEMENTATION_NOTES.md) for the preceding interface revision.

Frontend regression tests do not require installing additional test libraries:

```bash
cd frontend
npm test
```

Eight checks cover session persistence, long conversations, request errors, abort handling and the longer chat deadline. These do not replace browser testing or `npm run build`.

## Current implementation status

The interface has been redesigned with warm ivory and green colors, clearer navigation, an illustrated welcome screen, and consistent check-in, results, chat and history pages. It includes responsive styles, dark mode, native focus-managed dialogs and keyboard-friendly form controls.

Functional changes include bounded chat context, persistent in-memory session fallback, deletion for chat-only visitors, clearing displayed data after deletion, request timeouts, validated Gemini output, and atomic reservation of the shared call budget. Each attempted Gemini request consumes one slot, including provider failures; automatic retries are disabled. Missing-key and pre-LLM crisis responses consume no slots.

Chat is retained in memory while switching screens, and resets on page reload or data deletion. Messages sent to Saathi are processed by Google Gemini; anonymous browser sessions do not imply confidentiality. Deletion removes records from this application's database and does not erase any provider-retained records.

The saved model records scikit-learn 1.9.0, now pinned in `backend/requirements.txt`. Its observed dataset age range is 18–24; estimates outside that range are less reliable. The notebook's recorded default random forest test metrics are R² 0.8774, MAE 0.3477 and RMSE 0.4640. These have not been rerun in this workspace.

The production build and eight frontend regression checks previously passed. The current full backend suite passes all 66 cases. Chat rejects blank messages, preserves valid crisis flags even when reply text is malformed, and normalizes selected Unicode variants in its phrase filter. The prompt emphasizes contextual listening and avoiding repeated advice; broader live quality still needs checking. Live Gemini 3.8 Flash testing returned HTTP 503, following earlier HTTP 504 failures. The default and local configuration now use `gemini-3.5-flash-lite`, verified through the running `/chat` endpoint with a valid reply in approximately 13 seconds. The provider timeout remains 60 seconds and the browser chat timeout remains 75 seconds. Deployment also requires the remaining browser checks and durable backend storage.

---

## 📂 Project Architecture

```
mental-health-companion/
├── PLAN.md                         # Master Plan & source of truth
├── PROGRESS.md                     # Step-by-step progress tracker
├── GEMINI.md                       # Project rules & constraints
├── README.md                       # Main documentation
├── .env.example                    # Environment template
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application & CORS
│   │   ├── config.py               # Settings, helplines, fixed replies
│   │   ├── schemas.py              # Pydantic v2 validation models
│   │   ├── db.py                   # SQLite tables & query helpers
│   │   ├── routers/                # Endpoints (/predict, /chat, /history, /me)
│   │   ├── services/               # Model serving, recommendations, safety, LLM
│   │   └── models/
│   │       └── Mental_Health_Model.pkl
│   ├── data/
│   │   └── app.db                  # Local SQLite database
│   ├── tests/                      # Pytest test suite
│   └── requirements.txt
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── styles/                 # tokens.css & base.css
│       ├── components/             # ScoreArc, TipCard, WhatIfCard, etc.
│       ├── pages/                  # Welcome, CheckIn, Result, Chat, History
│       ├── api.js                  # Fetch client with X-Session-Id
│       └── session.js              # Anonymous UUID session management
│
└── docs/
    ├── API.md                      # Detailed endpoint request/response specs
    ├── SAFETY.md                   # Crisis interception & guardrails guide
    ├── DECISIONS.md                # Architecture Decision Records (ADR)
    └── DEMO_SCRIPT.md              # 3-minute presentation script
```

---

## 🛡️ Emergency Helplines (India)
- **Tele-MANAS**: `14416` (24x7 National Mental Health Helpline, toll-free)
- **Emergency Services**: `112`
