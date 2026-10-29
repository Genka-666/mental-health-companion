from app.services.recommendations import get_band, generate_tips, generate_what_if

def test_band_thresholds():
    assert get_band(4.2) == "Low"
    assert get_band(5.0) == "Moderate"
    assert get_band(6.5) == "Moderate"
    assert get_band(7.0) == "Moderate"
    assert get_band(7.1) == "Good"
    assert get_band(9.5) == "Good"

def test_generate_tips_rules():
    # Test low sleep and high stress
    inputs = {
        "sleep_hours_per_night": 4.5,
        "stress_level": "High",
        "avg_daily_usage_hours": 6.0,
        "daily_unlocks": 200,
        "physical_activity_hours": 0.2,
        "study_hours": 9.0,
        "purpose_of_use": "Entertainment"
    }
    tips = generate_tips(inputs)
    assert len(tips) <= 4
    tip_ids = [t["id"] for t in tips]
    assert "stress_high" in tip_ids
    assert "night_scroll" in tip_ids or "sleep_low" in tip_ids

def test_generate_tips_empty_when_all_healthy():
    inputs = {
        "sleep_hours_per_night": 7.5,
        "stress_level": "Low",
        "avg_daily_usage_hours": 2.0,
        "daily_unlocks": 40,
        "physical_activity_hours": 1.5,
        "study_hours": 4.0,
        "purpose_of_use": "Education"
    }
    tips = generate_tips(inputs)
    # Healthy habits produce no urgent corrective tips
    assert len(tips) == 0

def test_what_if_deltas(valid_predict_payload):
    base_score = 6.0
    what_if = generate_what_if(valid_predict_payload, base_score)
    assert len(what_if) > 0
    for item in what_if:
        assert "label" in item
        assert "delta" in item
        assert isinstance(item["delta"], float)
