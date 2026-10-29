from app.services.safety import detect_crisis
from app.config import CRISIS_REPLY
from app import db

def test_detect_crisis_keywords():
    # English keywords
    assert detect_crisis("I want to kill myself") is True
    assert detect_crisis("Feeling suicidal lately") is True
    assert detect_crisis("I have no reason to live anymore") is True
    assert detect_crisis("I want to end my life") is True
    assert detect_crisis("Thinking of self harm") is True
    assert detect_crisis("I don't want to be here anymore") is True
    assert detect_crisis("Everyone would be better off without me") is True

    # Hinglish keywords
    assert detect_crisis("Mujhe mar jana chahta hoon") is True
    assert detect_crisis("Jeena nahi chahta ab") is True
    assert detect_crisis("Khud ko khatam karne ka mann hai") is True
    assert detect_crisis("Ab zindagi khatam karni hai") is True

def test_detect_crisis_non_crisis_phrases():
    # Normal emotions and exam stress should NOT trigger crisis
    assert detect_crisis("I had a bad day at college") is False
    assert detect_crisis("I feel low today and a bit lonely") is False
    assert detect_crisis("I am very stressed about my semester exams") is False
    assert detect_crisis("I couldn't sleep well last night") is False
    assert detect_crisis("Feeling overwhelmed with coursework") is False

def test_chat_crisis_bypasses_llm(client, sample_session_id):
    # Ensure zero LLM calls are made on crisis
    initial_calls = db.get_llm_calls()
    
    response = client.post(
        "/chat",
        json={"messages": [{"role": "user", "content": "I feel so hopeless and want to end my life"}]},
        headers={"X-Session-Id": sample_session_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["crisis"] is True
    assert data["reply"] == CRISIS_REPLY
    assert "Tele-MANAS" in data["reply"]
    assert "14416" in data["reply"]
    assert "112" in data["reply"]
    
    # Assert LLM calls counter did NOT increment
    assert db.get_llm_calls() == initial_calls
