---
name: ml-model-serving
description: Use when loading the scikit-learn model, mapping inputs to the model's DataFrame columns, running predictions, or retraining a leaner model.
---

# ML Model Serving Instructions
- The existing model is a scikit-learn pipeline expecting a DataFrame with columns:
  `Age, Gender, Country, Academic_Level, Most_Used_Platform, Purpose_Of_Use, Avg_Daily_Usage_Hours, Daily_Unlocks, Study_Hours, Physical_Activity_Hours, Sleep_Hours_Per_Night, Stress_Level, Grouped_country`.
- `Grouped_country` = the country if it is in the top-10 list (`['Other','India','USA','Canada','Australia','UK','Germany','Mexico','Turkey','France']`), otherwise `"Other"`.
- Pin the required `scikit-learn`, `pandas`, `joblib` in `requirements.txt`.
- Wrap prediction in a function `predict_score(inputs) -> float` rounded to 2 decimals and clipped to the 0–10 range.
- Provide `predict_with_changes(inputs, changes)` for what-if simulations.
- Do not claim causation anywhere. Say "associated with".
