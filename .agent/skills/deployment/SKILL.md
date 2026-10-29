---
name: deployment
description: Use when preparing environment files, hosting the backend or frontend, configuring CORS, or troubleshooting production issues.
---

# Deployment Instructions
- Backend: Render free web service (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`, root dir `backend`).
- Frontend: Vercel or Netlify (`VITE_API_BASE=<backend url>`).
- Env vars: `GEMINI_API_KEY`, `GEMINI_MODEL`, `MAX_LLM_CALLS`, `CORS_ORIGINS`.
- Commit `.env.example`, NEVER `.env`.
- Note ephemeral SQLite on Render free tier.
