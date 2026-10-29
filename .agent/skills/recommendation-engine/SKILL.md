---
name: recommendation-engine
description: Use when generating suggestions, tips, score bands, or what-if comparisons after a prediction.
---

# Recommendation Engine Instructions
- Suggestions are deterministic rules, NOT LLM output.
- Rule table (tune thresholds from dataset percentiles):
  - `sleep < 6 h`: Try a consistent bedtime; even +30 min may help.
  - `sleep > 9.5 h`: Very long sleep can go with low mood; consider a regular wake time.
  - `usage > 5 h/day`: Try a screen-free hour before bed or app timers.
  - `unlocks > 150/day`: Try batching notifications to reduce check-ins.
  - `activity < 0.5 h`: A 15–20 minute walk is a small, realistic start.
  - `study > 8 h`: Add short breaks; use a 50/10 rhythm.
  - `stress in {'High', 'Very High'}`: Try a 5-minute breathing exercise; talk to someone you trust.
  - `usage for Entertainment high + sleep low`: Replace one late scroll session with winding down.
- Return at most 4 tips, ordered by estimated impact.
- **What-if:** for each of 2–3 changeable habits (sleep +1 h, usage −1 h, activity +0.5 h), re-run the model and return `{label, delta}`. Phrase as "In this dataset, people with this habit tend to score about X higher", never "this will raise your score".
- **Bands:** `Low` (<5.0), `Moderate` (5.0–7.0), `Good` (>7.0). Derive cut-points in `config.py`. Never use words like "disorder", "depressed", or "unhealthy".
