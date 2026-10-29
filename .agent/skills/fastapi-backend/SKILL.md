---
name: fastapi-backend
description: Use when writing or changing FastAPI endpoints, Pydantic schemas, CORS, or app startup for the backend.
---

# FastAPI Backend Instructions
- Use Pydantic v2 models with `Field` constraints (min/max length, ranges).
- Read `X-Session-Id` from the header; reject missing or malformed ids with 400.
- Validate ids as UUID4 format. This is NOT authentication.
- CORS origins come from `CORS_ORIGINS` env var, not `"*"` in production.
- Add `GET /health` returning `{"status": "ok"}`.
- Return consistent error JSON: `{"detail": "...", "code": "..."}`.
- Load the ML model once at startup, not per request.
