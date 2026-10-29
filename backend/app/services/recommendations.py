from ..config import SCORE_BANDS
from .model_service import predict_with_changes

def get_band(score: float) -> str:
    if score < SCORE_BANDS["LOW_MAX"]:
        return "Low"
    elif score <= SCORE_BANDS["MODERATE_MAX"]:
        return "Moderate"
    else:
        return "Good"

def generate_tips(inputs: dict) -> list[dict]:
    sleep = float(inputs.get("sleep_hours_per_night", 7.0))
    usage = float(inputs.get("avg_daily_usage_hours", 4.0))
    unlocks = int(inputs.get("daily_unlocks", 100))
    activity = float(inputs.get("physical_activity_hours", 1.0))
    study = float(inputs.get("study_hours", 4.0))
    stress = inputs.get("stress_level", "Medium")
    purpose = inputs.get("purpose_of_use", "Entertainment")
    
    candidate_tips = []

    # Priority 1: High stress
    if stress in ["High", "Very High"]:
        candidate_tips.append({
            "id": "stress_high",
            "title": "Unwind tension and connect",
            "body": "Try a 5-minute deep breathing exercise when overwhelmed, and reach out to someone you trust."
        })

    # Priority 2: Night scrolling & low sleep combo
    if purpose == "Entertainment" and usage > 4.0 and sleep < 6.5:
        candidate_tips.append({
            "id": "night_scroll",
            "title": "Wind down before bed",
            "body": "Replacing one late-night scrolling session with calming music or reading can improve deep sleep."
        })

    # Priority 3: Low sleep
    if sleep < 6.0:
        candidate_tips.append({
            "id": "sleep_low",
            "title": "Protect your sleep",
            "body": "Try a consistent bedtime; even +30 min may help restore mental clarity."
        })
    elif sleep > 9.5:
        candidate_tips.append({
            "id": "sleep_high",
            "title": "Balance your sleep routine",
            "body": "Very long sleep can go with low mood; consider setting a regular morning wake time."
        })

    # Priority 4: Very high screen time
    if usage > 5.0:
        candidate_tips.append({
            "id": "usage_high",
            "title": "Create screen-free pauses",
            "body": "Try a screen-free hour before bed or setting gentle app limits for restful evenings."
        })

    # Priority 5: Low activity
    if activity < 0.5:
        candidate_tips.append({
            "id": "activity_low",
            "title": "Gentle daily movement",
            "body": "A 15–20 minute walk outside is a realistic, refreshing start for mood and energy."
        })

    # Priority 6: High unlocks
    if unlocks > 150:
        candidate_tips.append({
            "id": "unlocks_high",
            "title": "Reduce notification checks",
            "body": "Try batching notifications or placing your phone across the room during focus time."
        })

    # Priority 7: Excessive study hours
    if study > 8.0:
        candidate_tips.append({
            "id": "study_high",
            "title": "Pace your study blocks",
            "body": "Long uninterrupted study can deplete stamina; try a 50-minute study / 10-minute break rhythm."
        })

    # Return at most 4 tips
    return candidate_tips[:4]

def generate_what_if(inputs: dict, base_score: float) -> list[dict]:
    what_ifs = []
    
    # 1. Sleep +1h
    current_sleep = float(inputs.get("sleep_hours_per_night", 7.0))
    if current_sleep < 9.0:
        new_score = predict_with_changes(inputs, {"sleep_hours_per_night": min(10.0, current_sleep + 1.0)})
        delta = round(new_score - base_score, 2)
        what_ifs.append({
            "label": "Sleeping 1 hour more",
            "delta": delta
        })

    # 2. Screen time -1h
    current_usage = float(inputs.get("avg_daily_usage_hours", 4.0))
    if current_usage > 1.5:
        new_score = predict_with_changes(inputs, {"avg_daily_usage_hours": max(0.5, current_usage - 1.0)})
        delta = round(new_score - base_score, 2)
        what_ifs.append({
            "label": "Using phone 1 hour less",
            "delta": delta
        })

    # 3. Physical activity +0.5h
    current_act = float(inputs.get("physical_activity_hours", 0.5))
    if current_act < 3.0:
        new_score = predict_with_changes(inputs, {"physical_activity_hours": current_act + 0.5})
        delta = round(new_score - base_score, 2)
        what_ifs.append({
            "label": "Adding 30 min daily activity",
            "delta": delta
        })

    return what_ifs
