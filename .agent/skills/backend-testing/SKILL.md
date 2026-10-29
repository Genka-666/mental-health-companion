---
name: backend-testing
description: Use when writing or running tests for the API, ML service, rules, or database.
---

# Backend Testing Instructions
- Use `pytest` and FastAPI `TestClient`.
- Temporary SQLite file or in-memory DB per test run.
- Mock the Gemini client in all tests. Tests must NEVER call the real API.
- Cover `/predict`, score range 0-10, rule outputs, what-if deltas, `/history`, `DELETE /me`, `X-Session-Id` validation, budget exhaustion, fallback handling.
- Run `pytest -q` after changes and report results.
