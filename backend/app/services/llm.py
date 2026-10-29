import json
import logging
import time
from typing import Tuple
from ..config import settings, BUDGET_FALLBACK, LLM_ERROR_FALLBACK, CRISIS_REPLY
from .prompts import SYSTEM_PROMPT
from .. import db

logger = logging.getLogger(__name__)

# Lazily initialized genai client
_genai_client = None

def get_genai_client():
    global _genai_client
    if _genai_client is None:
        if settings.gemini_api_key:
            from google import genai
            _genai_client = genai.Client(api_key=settings.gemini_api_key)
    return _genai_client

def set_genai_client(mock_client):
    """Allows mocking in unit tests."""
    global _genai_client
    _genai_client = mock_client

def call_gemini_chat(messages: list[dict]) -> Tuple[str, bool, int]:
    """
    Calls Gemini API with the last messages, enforcing budget and safety parsing.
    Returns: (reply_text, is_crisis, remaining_calls)
    """
    current_calls = db.get_llm_calls()
    remaining = max(0, settings.max_llm_calls - current_calls)

    if remaining <= 0:
        return BUDGET_FALLBACK, False, 0

    client = get_genai_client()
    if client is None:
        return LLM_ERROR_FALLBACK, False, remaining

    # Send only the last 10 messages
    recent_messages = messages[-10:]
    
    # Format messages for google-genai SDK
    # Google GenAI uses contents formatted with parts/role: "user" or "model"
    formatted_contents = []
    for msg in recent_messages:
        role = "user" if msg["role"] == "user" else "model"
        formatted_contents.append({"role": role, "parts": [{"text": msg["content"]}]})

    attempts = 2
    raw_response_text = ""
    for attempt in range(attempts):
        try:
            from google.genai import types
            
            # Using types.GenerateContentConfig for system instruction & JSON response
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=400,
                response_mime_type="application/json",
            )
            
            response = client.models.generate_content(
                model=settings.gemini_model,
                contents=formatted_contents,
                config=config,
            )
            raw_response_text = response.text.strip() if response.text else ""
            break
        except Exception as e:
            logger.warning(f"Gemini API attempt {attempt + 1} failed: {e}")
            if attempt < attempts - 1:
                time.sleep(1.0)
            else:
                return LLM_ERROR_FALLBACK, False, remaining

    # Account for the successful call
    new_total = db.increment_llm_calls()
    remaining = max(0, settings.max_llm_calls - new_total)

    # Parse JSON output {reply, risk}
    try:
        # Strip potential markdown backticks ```json ... ```
        clean_text = raw_response_text
        if clean_text.startswith("```"):
            clean_text = clean_text.strip("`")
            if clean_text.startswith("json"):
                clean_text = clean_text[4:].strip()
        data = json.loads(clean_text)
        reply = data.get("reply", "")
        risk = data.get("risk", "none").lower()
        
        if risk == "crisis":
            return CRISIS_REPLY, True, remaining
        
        return reply, False, remaining
    except Exception as e:
        logger.info(f"JSON parse fallback for model output: {e}")
        # Raw text fallback
        if raw_response_text:
            return raw_response_text, False, remaining
        return LLM_ERROR_FALLBACK, False, remaining
