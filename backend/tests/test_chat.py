import json

import pytest
from unittest.mock import MagicMock
from app.services import llm
from app.config import BUDGET_FALLBACK, LLM_ERROR_FALLBACK, settings
from app import db

def test_chat_success(client, sample_session_id, monkeypatch):
    # Mock Gemini client
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = '{"reply": "I hear how demanding your study load is. Taking a short walk might give you a breather.", "risk": "none"}'
    mock_client.models.generate_content.return_value = mock_resp
    
    monkeypatch.setattr(llm, "_genai_client", mock_client)
    
    initial_calls = db.get_llm_calls()

    response = client.post(
        "/chat",
        json={"messages": [{"role": "user", "content": "I have so many assignments due tomorrow"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert "I hear how demanding" in data["reply"]
    assert data["crisis"] is False
    assert data["remaining_calls"] == settings.max_llm_calls - 1
    assert db.get_llm_calls() == initial_calls + 1

def test_chat_budget_exhaustion(client, sample_session_id, monkeypatch):
    # Set current calls to MAX
    conn = db.get_connection()
    with conn:
        conn.execute("UPDATE llm_usage SET calls = ? WHERE id = 1;", (settings.max_llm_calls,))
    conn.close()

    mock_client = MagicMock()
    monkeypatch.setattr(llm, "_genai_client", mock_client)

    response = client.post(
        "/chat",
        json={"messages": [{"role": "user", "content": "Hello"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == BUDGET_FALLBACK
    assert data["remaining_calls"] == 0
    # Client should never have been invoked
    mock_client.models.generate_content.assert_not_called()

def test_chat_raw_text_json_fallback(client, sample_session_id, monkeypatch):
    # Model returns plain text instead of JSON
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = 'Take a deep breath and go one step at a time.'
    mock_client.models.generate_content.return_value = mock_resp
    
    monkeypatch.setattr(llm, "_genai_client", mock_client)

    response = client.post(
        "/chat",
        json={"messages": [{"role": "user", "content": "I feel anxious"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == LLM_ERROR_FALLBACK
    assert data["crisis"] is False

def test_chat_api_exception_fallback(client, sample_session_id, monkeypatch):
    # Model raises network exception
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = RuntimeError("Network error")
    
    monkeypatch.setattr(llm, "_genai_client", mock_client)

    response = client.post(
        "/chat",
        json={"messages": [{"role": "user", "content": "Are you there?"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == LLM_ERROR_FALLBACK

def test_chat_invalid_last_message_role(client, sample_session_id):
    response = client.post(
        "/chat",
        json={"messages": [{"role": "assistant", "content": "How are you?"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 400


@pytest.mark.parametrize("output", [
    "[]", "null", "{}",
    '{"reply": "", "risk": "none"}',
    '{"reply": "   ", "risk": "none"}',
    '{"reply": 123, "risk": "none"}',
    '{"reply": "Hi", "risk": "unknown"}',
    '{"reply": "Hi", "risk": null}',
    '{"reply": "Hi"}',
])
def test_chat_malformed_output_uses_fixed_fallback(client, sample_session_id, monkeypatch, output):
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value.text = output
    monkeypatch.setattr(llm, "_genai_client", mock_client)
    response = client.post("/chat", json={"messages": [{"role": "user", "content": "Hello"}]}, headers={"X-Session-Id": sample_session_id})
    assert response.status_code == 200
    assert response.json()["reply"] == LLM_ERROR_FALLBACK
    assert db.get_llm_calls() == 1


def test_llm_crisis_flag_returns_fixed_reply(client, sample_session_id, monkeypatch):
    from app.config import CRISIS_REPLY
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value.text = json.dumps({"reply": "An improvised reply", "risk": "crisis"})
    monkeypatch.setattr(llm, "_genai_client", mock_client)
    response = client.post("/chat", json={"messages": [{"role": "user", "content": "I feel unsafe"}]}, headers={"X-Session-Id": sample_session_id})
    assert response.json()["crisis"] is True
    assert response.json()["reply"] == CRISIS_REPLY


def test_failed_provider_attempt_consumes_budget_without_retry(client, sample_session_id, monkeypatch):
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = RuntimeError("Unavailable")
    monkeypatch.setattr(llm, "_genai_client", mock_client)
    monkeypatch.setattr(settings, "max_llm_calls", 1)
    payload = {"messages": [{"role": "user", "content": "Hello"}]}
    headers = {"X-Session-Id": sample_session_id}
    assert client.post("/chat", json=payload, headers=headers).json()["remaining_calls"] == 0
    assert client.post("/chat", json=payload, headers=headers).json()["reply"] == BUDGET_FALLBACK
    mock_client.models.generate_content.assert_called_once()


def test_missing_api_key_does_not_consume_budget(client, sample_session_id, monkeypatch):
    monkeypatch.setattr(llm, "_genai_client", None)
    monkeypatch.setattr(settings, "gemini_api_key", "")
    response = client.post("/chat", json={"messages": [{"role": "user", "content": "Hello"}]}, headers={"X-Session-Id": sample_session_id})
    assert response.json()["reply"] == LLM_ERROR_FALLBACK
    assert db.get_llm_calls() == 0
