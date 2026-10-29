import uuid
import pytest

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_success(client, sample_session_id, valid_predict_payload):
    response = client.post(
        "/predict",
        json=valid_predict_payload,
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert 0.0 <= data["score"] <= 10.0
    assert data["band"] in ["Low", "Moderate", "Good"]
    assert isinstance(data["tips"], list)
    assert len(data["tips"]) <= 4
    assert isinstance(data["what_if"], list)
    assert "disclaimer" in data
    assert "not a diagnosis" in data["disclaimer"].lower()

def test_predict_missing_session_id(client, valid_predict_payload):
    response = client.post("/predict", json=valid_predict_payload)
    assert response.status_code == 400

def test_predict_invalid_session_id(client, valid_predict_payload):
    response = client.post(
        "/predict",
        json=valid_predict_payload,
        headers={"X-Session-Id": "not-a-uuid"}
    )
    assert response.status_code == 400

def test_predict_invalid_data(client, sample_session_id, valid_predict_payload):
    # Age out of range
    bad_payload = dict(valid_predict_payload, age=5)
    response = client.post(
        "/predict",
        json=bad_payload,
        headers={"X-Session-Id": sample_session_id}
    )
    assert response.status_code == 422

    # Negative usage hours
    bad_payload2 = dict(valid_predict_payload, avg_daily_usage_hours=-1.0)
    response2 = client.post(
        "/predict",
        json=bad_payload2,
        headers={"X-Session-Id": sample_session_id}
    )
    assert response2.status_code == 422
