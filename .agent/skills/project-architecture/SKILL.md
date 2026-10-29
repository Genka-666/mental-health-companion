---
name: project-architecture
description: Use when starting work, adding files, or deciding where code belongs in the Mental Health Companion monorepo.
---

# Project Architecture Instructions
- Follow the folder layout in PLAN.md Section 5 exactly.
- Backend code lives in `backend/app`, split into `routers/` (HTTP only), `services/` (logic), `schemas.py` (Pydantic), `db.py` (storage).
- Routers never contain business logic; they validate, call a service, and return a schema.
- Frontend code lives in `frontend/src` with `pages/`, `components/`, `styles/`.
- Record any deviation in `docs/DECISIONS.md`.
