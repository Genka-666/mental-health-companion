import uuid

def test_history_and_delete_cascade(client, sample_session_id, valid_predict_payload):
    # 1. Initially history is empty
    resp = client.get("/history", headers={"X-Session-Id": sample_session_id})
    assert resp.status_code == 200
    assert resp.json()["items"] == []

    # 2. Add prediction
    p_resp = client.post("/predict", json=valid_predict_payload, headers={"X-Session-Id": sample_session_id})
    assert p_resp.status_code == 200

    # 3. Add second prediction
    valid_predict_payload2 = dict(valid_predict_payload, sleep_hours_per_night=8.0)
    client.post("/predict", json=valid_predict_payload2, headers={"X-Session-Id": sample_session_id})

    # 4. Check history returns 2 items
    h_resp = client.get("/history", headers={"X-Session-Id": sample_session_id})
    assert h_resp.status_code == 200
    items = h_resp.json()["items"]
    assert len(items) == 2
    assert "score" in items[0]
    assert "band" in items[0]
    assert "created_at" in items[0]

    # 5. Different session should not see this session's history
    other_session = str(uuid.uuid4())
    other_resp = client.get("/history", headers={"X-Session-Id": other_session})
    assert other_resp.status_code == 200
    assert other_resp.json()["items"] == []

    # 6. DELETE /me
    del_resp = client.delete("/me", headers={"X-Session-Id": sample_session_id})
    assert del_resp.status_code == 200
    assert del_resp.json() == {"deleted": True}

    # 7. Check history is now empty
    h_after = client.get("/history", headers={"X-Session-Id": sample_session_id})
    assert h_after.status_code == 200
    assert h_after.json()["items"] == []
