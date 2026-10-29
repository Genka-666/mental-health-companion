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
7. **Trend History & Complete Privacy**: Anonymous UUID sessions in `localStorage`. No accounts, passwords, or emails. Single-click "Delete my data" cascade wipe.

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

# Create & activate a virtual environment (optional but recommended)
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\activate
# On macOS / Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and configure your GEMINI_API_KEY
copy .env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

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

All 18 unit and safety tests run against an isolated SQLite test database with mocked LLM calls.

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
