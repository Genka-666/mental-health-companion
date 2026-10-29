# /safety-audit Workflow
1. Apply skills: `safety-guardrails`, `red-team-safety-testing`.
2. Run safety tests in `backend/tests/test_safety.py`.
3. Check keyword list coverage (English and Hinglish).
4. Verify crisis queries bypass LLM and return Tele-MANAS helpline and 112.
5. Report findings and update `docs/SAFETY.md`.
