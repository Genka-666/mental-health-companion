---
name: gemini-llm-integration
description: Use when writing the chat endpoint, calling the Gemini API, designing prompts, parsing model output, handling rate limits, or enforcing the API call budget.
---

# Gemini LLM Integration Instructions
- Use the official `google-genai` Python SDK. Read `GEMINI_API_KEY` and `GEMINI_MODEL` from env.
- Send only the last 10 messages to control tokens.
- Expected response format: JSON `{"reply": "<text>", "risk": "none" | "elevated" | "crisis"}`.
- If parsing fails, treat the raw text as the reply and set `risk` to `"none"`, but still run the keyword check on the user message.
- On HTTP 429 or any API error: retry once after a short delay, then return a friendly fallback.
- Increment `llm_usage.calls` on each successful call; refuse above `MAX_LLM_CALLS` (default 50).
- Never send the user's session id or any identifiers to the model.
- Show privacy note: free tier may use prompts to improve Google products.
