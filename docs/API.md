# Mental Health Companion — API Specification

The Mental Health Companion backend is built with FastAPI. It provides deterministic wellbeing scoring via a trained scikit-learn pipeline, habit-based suggestions, a crisis safety layer, and supportive conversational chat powered by Google Gemini.

## Base URL
- Local: `http://localhost:8000`
- Production: `https://<your-render-app>.onrender.com`

---

## Authentication & Sessions
- **Authentication**: None. No passwords, user profiles, or OAuth tokens are used.
- **Session Identification**: All endpoints except `GET /health` require an `X-Session-Id` header with a valid UUIDv4 string.
- The session id is generated in the client browser (`localStorage`), sent with requests, and used as a partition key for assessments and messages.

---

## Error Handling
Standard error format:
```json
{
  "detail": "Error description message",
  "code": "ERROR_CODE"
}
```

Common status codes:
- `200 OK`: Successful request.
- `400 Bad Request`: Missing or malformed `X-Session-Id` header, or invalid chat sequence.
- `422 Unprocessable Entity`: Input validation failure (out-of-range numeric values or unrecognized categories).

---

## Endpoints

### 1. Health Check
`GET /health`

Verifies server status. Does not require `X-Session-Id`.

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 2. Predict Wellbeing Score
`POST /predict`

Computes a habit-based wellbeing score (0.0–10.0), assigns a score band (`Low`, `Moderate`, `Good`), derives up to 4 deterministic practical tips, runs "what-if" simulations, and records the assessment for the caller's session.

**Headers:**
`X-Session-Id: 550e8400-e29b-41d4-a716-446655440000`

**Request Body:**
```json
{
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
```

**Response (200 OK):**
```json
{
  "score": 5.67,
  "band": "Moderate",
  "tips": [
    {
      "id": "stress_high",
      "title": "Unwind tension and connect",
      "body": "Try a 5-minute deep breathing exercise when overwhelmed, and reach out to someone you trust."
    },
    {
      "id": "night_scroll",
      "title": "Wind down before bed",
      "body": "Replacing one late-night scrolling session with calming music or reading can improve deep sleep."
    },
    {
      "id": "sleep_low",
      "title": "Protect your sleep",
      "body": "Try a consistent bedtime; even +30 min may help restore mental clarity."
    },
    {
      "id": "usage_high",
      "title": "Create screen-free pauses",
      "body": "Try a screen-free hour before bed or setting gentle app limits for restful evenings."
    }
  ],
  "what_if": [
    {
      "label": "Sleeping 1 hour more",
      "delta": 0.23
    },
    {
      "label": "Using phone 1 hour less",
      "delta": 0.12
    },
    {
      "label": "Adding 30 min daily activity",
      "delta": 0.08
    }
  ],
  "disclaimer": "This is a habit-based estimate, not a diagnosis. Support companion, not a therapist. Not medical advice."
}
```

---

### 3. Supportive Chat
`POST /chat`

Sends conversation history to the "Saathi" AI companion. Includes pre-LLM crisis keyword filtering, budget enforcement, and fallback handling.

**Headers:**
`X-Session-Id: 550e8400-e29b-41d4-a716-446655440000`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I feel so overwhelmed with my upcoming examinations."
    }
  ]
}
```

**Standard Response (200 OK):**
```json
{
  "reply": "It sounds like exam pressure is feeling really intense right now. Have you been able to take a short break today to catch your breath?",
  "crisis": false,
  "remaining_calls": 48
}
```

**Crisis Detection Response (200 OK, Zero LLM Calls Made):**
```json
{
  "reply": "I'm really glad you told me, and I'm sorry it hurts this much right now. You deserve support from a real person. In India you can call Tele-MANAS at 14416, or 112 if you are in immediate danger. If you can, please reach out to someone you trust and stay with them. I'm here to listen too.",
  "crisis": true,
  "remaining_calls": 48
}
```

---

### 4. Check-in History
`GET /history`

Retrieves all previous assessments for the caller's session ordered chronologically.

**Headers:**
`X-Session-Id: 550e8400-e29b-41d4-a716-446655440000`

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "score": 5.67,
      "band": "Moderate",
      "created_at": "2026-10-28T10:15:00+00:00"
    },
    {
      "id": 2,
      "score": 6.85,
      "band": "Moderate",
      "created_at": "2026-10-29T11:20:00+00:00"
    }
  ]
}
```

---

### 5. Delete My Data
`DELETE /me`

Permanently deletes the session record in SQLite and cascade-deletes all associated assessment rows and chat messages.

**Headers:**
`X-Session-Id: 550e8400-e29b-41d4-a716-446655440000`

**Response (200 OK):**
```json
{
  "deleted": true
}
```
