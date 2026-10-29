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
    assert "Take a deep breath" in data["reply"]
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
