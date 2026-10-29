import pytest
import os
import uuid
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app import db
from app.config import settings
from app.services import llm


@pytest.fixture(autouse=True)
def mock_gemini(monkeypatch):
    """Every test uses a fake provider unless it explicitly replaces the client."""
    provider = MagicMock()
    provider.models.generate_content.return_value.text = (
        '{"reply":"I hear you. What has been on your mind?","risk":"none"}'
    )
    monkeypatch.setattr(llm, "_genai_client", provider)
    monkeypatch.setattr(settings, "gemini_api_key", "")
    return provider

@pytest.fixture(autouse=True)
def setup_test_db(tmp_path, monkeypatch):
    test_db_path = str(tmp_path / "test_app.db")
    monkeypatch.setattr(settings, "database_path", test_db_path)
    db.init_db(test_db_path)
    yield test_db_path

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def sample_session_id():
    return str(uuid.uuid4())

@pytest.fixture
def valid_predict_payload():
    return {
        "age": 21,
        "gender": "Female",
        "country": "India",
        "academic_level": "Undergraduate",
        "most_used_platform": "Instagram",
        "purpose_of_use": "Entertainment",
        "avg_daily_usage_hours": 5.5,
        "daily_unlocks": 140,
        "study_hours": 4.0,
        "physical_activity_hours": 0.5,
        "sleep_hours_per_night": 5.5,
        "stress_level": "High"
    }
