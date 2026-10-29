"""Gemini chat with a shared attempt budget and validated structured replies."""

import logging
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, ValidationError

from .. import db
from ..config import BUDGET_FALLBACK, CRISIS_REPLY, LLM_ERROR_FALLBACK, settings
from .prompts import SYSTEM_PROMPT

logger = logging.getLogger(__name__)
_genai_client = None


class GeminiRisk(BaseModel):
    """Read the safety classification independently of generated reply text."""

    model_config = ConfigDict(strict=True, str_strip_whitespace=True)
    risk: Literal["none", "elevated", "crisis"]


class GeminiReply(GeminiRisk):
    """Only well-formed non-crisis replies may reach the UI."""

    reply: str = Field(min_length=1, max_length=2000)


def get_genai_client():
    """Create the server-side client lazily, with a bounded single attempt."""
    global _genai_client
    if _genai_client is None and settings.gemini_api_key:
        from google import genai
        from google.genai import types

        _genai_client = genai.Client(
            api_key=settings.gemini_api_key,
            http_options=types.HttpOptions(
                timeout=60000,
                retry_options=types.HttpRetryOptions(attempts=1),
            ),
        )
    return _genai_client


def set_genai_client(mock_client):
    """Inject a test client without using the live API."""
    global _genai_client
    _genai_client = mock_client


def remaining_calls() -> int:
    """Read the remaining shared attempt budget."""
    return max(0, settings.max_llm_calls - db.get_llm_calls())


def call_gemini_chat(messages: list[dict]) -> tuple[str, bool, int]:
    """Make at most one counted provider attempt and reject malformed output."""
    if remaining_calls() == 0:
        return BUDGET_FALLBACK, False, 0

    try:
        client = get_genai_client()
        if client is None:
            return LLM_ERROR_FALLBACK, False, remaining_calls()
        from google.genai import types

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=2048,
            response_mime_type="application/json",
            response_schema=GeminiReply,
            thinking_config=(
                types.ThinkingConfig(thinking_level=types.ThinkingLevel.LOW)
                if settings.gemini_model.removeprefix("models/") == "gemini-3.8-flash"
                else None
            ),
        )
    except Exception as exc:
        logger.warning("Gemini client setup failed (%s)", type(exc).__name__)
        return LLM_ERROR_FALLBACK, False, remaining_calls()

    recent = messages[-10:]
    while recent and recent[0]["role"] != "user":
        recent = recent[1:]
    contents = [
        {
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": msg["content"]}],
        }
        for msg in recent
    ]
    if not db.reserve_llm_call(settings.max_llm_calls):
        return BUDGET_FALLBACK, False, 0

    try:
        response = client.models.generate_content(
            model=settings.gemini_model, contents=contents, config=config,
        )
        output = response.text or ""
        risk = GeminiRisk.model_validate_json(output)
        if risk.risk == "crisis":
            return CRISIS_REPLY, True, remaining_calls()
        parsed = GeminiReply.model_validate_json(output)
    except ValidationError:
        logger.warning("Gemini returned an invalid reply schema")
        return LLM_ERROR_FALLBACK, False, remaining_calls()
    except Exception as exc:
        # Never log provider exception strings: they can contain request data.
        code = getattr(exc, "code", None)
        status = (
            f"HTTP {code}"
            if type(code) is int and 400 <= code <= 599
            else "no HTTP status"
        )
        logger.warning("Gemini request failed (%s; %s)", type(exc).__name__, status)
        return LLM_ERROR_FALLBACK, False, remaining_calls()

    return parsed.reply, False, remaining_calls()
