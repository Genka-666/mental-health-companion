"""Provider failures should be diagnosable without leaking request data."""

import logging
from unittest.mock import MagicMock

import pytest
from google.genai import errors

from app.config import LLM_ERROR_FALLBACK
from app.services import llm


@pytest.mark.parametrize("error_type,code", [(errors.ServerError, 503), (errors.ClientError, 403)])
def test_provider_log_contains_status_without_sensitive_details(monkeypatch, caplog, error_type, code):
    private_marker = "do-not-log-provider-message-or-key"
    error = error_type(code, {"error": {"code": code, "message": private_marker}})
    mock = MagicMock()
    mock.models.generate_content.side_effect = error
    monkeypatch.setattr(llm, "_genai_client", mock)

    with caplog.at_level(logging.WARNING, logger=llm.__name__):
        reply, crisis, _ = llm.call_gemini_chat([
            {"role": "user", "content": "do-not-log-chat-content"},
        ])

    assert reply == LLM_ERROR_FALLBACK
    assert crisis is False
    assert f"HTTP {code}" in caplog.text
    assert private_marker not in caplog.text
    assert "do-not-log-chat-content" not in caplog.text


@pytest.mark.parametrize("model", [
    "gemini-3.8-flash", "models/gemini-3.8-flash", "gemini-2.5-flash",
    "gemini-3.5-flash-lite", "models/gemini-3.5-flash-lite",
])
def test_reply_uses_supported_thinking_settings(monkeypatch, model):
    from app.config import settings
    from google.genai import types

    mock = MagicMock()
    mock.models.generate_content.return_value.text = '{"reply":"A supportive reply.","risk":"none"}'
    monkeypatch.setattr(llm, "_genai_client", mock)
    monkeypatch.setattr(settings, "gemini_model", model)

    reply, crisis, _ = llm.call_gemini_chat([{"role": "user", "content": "Hello"}])

    assert reply == "A supportive reply."
    assert crisis is False
    config = mock.models.generate_content.call_args.kwargs["config"]
    # Current Gemini models use provider defaults for sampling parameters.
    assert config.temperature is None
    if model.removeprefix("models/") == "gemini-3.8-flash":
        assert config.thinking_config.thinking_level == types.ThinkingLevel.LOW
    else:
        assert config.thinking_config is None
