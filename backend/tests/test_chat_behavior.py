"""Chat regressions with a fake provider and an isolated usage budget."""

import json

import pytest
from pydantic import ValidationError

from app import db
from app.config import CRISIS_REPLY, settings
from app.schemas import ChatMessage
from app.services import llm
from app.services.safety import detect_crisis


@pytest.mark.parametrize("reply_fields", [
    {}, {"reply": ""}, {"reply": "   "}, {"reply": None},
    {"reply": 123}, {"reply": "x" * 2001},
])
def test_crisis_flag_takes_precedence_over_invalid_reply(mock_gemini, reply_fields):
    mock_gemini.models.generate_content.return_value.text = json.dumps({
        "risk": "crisis", **reply_fields,
    })

    reply, crisis, remaining = llm.call_gemini_chat([
        {"role": "user", "content": "I need someone to talk to."},
    ])

    assert (reply, crisis) == (CRISIS_REPLY, True)
    assert remaining == settings.max_llm_calls - 1
    assert db.get_llm_calls() == 1
    mock_gemini.models.generate_content.assert_called_once()


@pytest.mark.parametrize("content", [" ", "\n\t", "\u2003"])
def test_blank_messages_are_rejected(content):
    with pytest.raises(ValidationError):
        ChatMessage(role="user", content=content)


def test_recent_context_starts_with_user_and_keeps_latest_turn(mock_gemini):
    # The browser includes an initial greeting; a truncated window can start
    # with an assistant turn. That orphaned turn must not reach the provider.
    messages = [{"role": "assistant", "content": "Welcome"}]
    for turn in range(9):
        messages.extend([
            {"role": "user", "content": f"User turn {turn}"},
            {"role": "assistant", "content": f"Assistant turn {turn}"},
        ])
    messages.append({"role": "user", "content": "The latest question"})

    llm.call_gemini_chat(messages)

    sent = mock_gemini.models.generate_content.call_args.kwargs["contents"]
    assert len(sent) <= 10
    assert sent[0] == {"role": "user", "parts": [{"text": "User turn 5"}]}
    assert sent[-1] == {"role": "user", "parts": [{"text": "The latest question"}]}
    assert [message["role"] for message in sent] == [
        "user", "model", "user", "model", "user", "model", "user", "model", "user",
    ]
    assert messages[0]["content"] == "Welcome"


@pytest.mark.parametrize("content", [
    "I want to k\u200bill myself",
    "I feel ｓｕｉｃｉｄａｌ",
    "I hope I don’t wake up tomorrow",
    "I wish I wouldn't wake up",
    "I cannot keep myself safe tonight",
    "I’m not safe with myself",
])
def test_monitored_crisis_variants(content):
    assert detect_crisis(content) is True


@pytest.mark.parametrize("content", [
    "I don't want to wake up early for class",
    "I hope I don't miss my alarm",
    "I feel overwhelmed and need to sleep",
    "I can't keep my study desk tidy",
])
def test_ordinary_sleep_and_stress_messages_are_not_crisis(content):
    assert detect_crisis(content) is False


def test_blank_request_neither_calls_provider_nor_saves_messages(
    client, sample_session_id, mock_gemini,
):
    response = client.post(
        "/chat", json={"messages": [{"role": "user", "content": " \n\t "}]},
        headers={"X-Session-Id": sample_session_id},
    )

    assert response.status_code == 422
    mock_gemini.models.generate_content.assert_not_called()
    assert db.get_llm_calls() == 0
    conn = db.get_connection()
    try:
        assert conn.execute("SELECT COUNT(*) FROM messages").fetchone()[0] == 0
        assert conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0] == 0
    finally:
        conn.close()


def test_message_is_trimmed_before_storage_and_provider(
    client, sample_session_id, mock_gemini,
):
    response = client.post(
        "/chat", json={"messages": [{"role": "user", "content": "  Hello there \n"}]},
        headers={"X-Session-Id": sample_session_id},
    )

    assert response.status_code == 200
    sent = mock_gemini.models.generate_content.call_args.kwargs["contents"]
    assert sent == [{"role": "user", "parts": [{"text": "Hello there"}]}]
    conn = db.get_connection()
    try:
        row = conn.execute(
            "SELECT content FROM messages WHERE session_id = ? AND role = 'user'",
            (sample_session_id,),
        ).fetchone()
        assert row["content"] == "Hello there"
    finally:
        conn.close()


def test_crisis_bypasses_exhausted_budget_in_long_conversation(
    client, sample_session_id, mock_gemini, monkeypatch,
):
    monkeypatch.setattr(settings, "max_llm_calls", 0)
    messages = [{"role": "assistant", "content": "Welcome"}]
    for _ in range(9):
        messages.extend([
            {"role": "user", "content": "I'm stressed about college"},
            {"role": "assistant", "content": "What feels difficult today?"},
        ])
    messages.append({"role": "user", "content": "I cannot keep myself safe"})

    response = client.post(
        "/chat", json={"messages": messages},
        headers={"X-Session-Id": sample_session_id},
    )

    assert response.status_code == 200
    assert response.json() == {
        "reply": CRISIS_REPLY, "crisis": True, "remaining_calls": 0,
    }
    mock_gemini.models.generate_content.assert_not_called()
    assert db.get_llm_calls() == 0
