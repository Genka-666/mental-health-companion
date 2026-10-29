import joblib
import pandas as pd
import warnings
from pathlib import Path
from ..config import settings, TOP_COUNTRIES

# Global model instance
_model = None

def get_model():
    global _model
    if _model is None:
        model_path = Path(settings.model_path)
        if not model_path.exists():
            # Fallback to root or look relatively
            alt_path = Path(__file__).resolve().parent.parent.parent.parent / "Mental_Health_Model.pkl"
            if alt_path.exists():
                model_path = alt_path
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            _model = joblib.load(str(model_path))
    return _model

def _format_input_row(inputs: dict) -> pd.DataFrame:
    country = inputs.get("country", "Other")
    country_group = country if country in TOP_COUNTRIES else "Other"
    
    return pd.DataFrame([{
        'Age': inputs.get('age', 20),
        'Gender': inputs.get('gender', 'Female'),
        'Country': country,
        'Academic_Level': inputs.get('academic_level', 'Undergraduate'),
        'Most_Used_Platform': inputs.get('most_used_platform', 'Instagram'),
        'Purpose_Of_Use': inputs.get('purpose_of_use', 'Entertainment'),
        'Avg_Daily_Usage_Hours': float(inputs.get('avg_daily_usage_hours', 4.0)),
        'Daily_Unlocks': int(inputs.get('daily_unlocks', 100)),
        'Study_Hours': float(inputs.get('study_hours', 4.0)),
        'Physical_Activity_Hours': float(inputs.get('physical_activity_hours', 1.0)),
        'Sleep_Hours_Per_Night': float(inputs.get('sleep_hours_per_night', 7.0)),
        'Stress_Level': inputs.get('stress_level', 'Medium'),
        'Grouped_country': country_group
    }])

def predict_score(inputs: dict) -> float:
    model = get_model()
    df = _format_input_row(inputs)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        raw_pred = model.predict(df)[0]
    
    score = round(float(raw_pred), 2)
    # Clip to 0.0 - 10.0 scale
    return max(0.0, min(10.0, score))

def predict_with_changes(inputs: dict, changes: dict) -> float:
    modified_inputs = dict(inputs)
    modified_inputs.update(changes)
    return predict_score(modified_inputs)
