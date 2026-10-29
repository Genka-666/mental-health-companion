# Mental Health Companion — 3-Minute Showcase Script

This demo flow uses under 5 Gemini API calls and highlights the full user experience, machine learning integration, and crisis safety guardrails.

---

## Pre-Demo Checklist (5 Minutes Before)
1. **Wake Backend Server**: Open `http://localhost:8000/health` (or Render live URL) in your browser. Verify it returns `{"status":"ok"}`.
2. **Open Frontend**: Open `http://localhost:5173`.
3. **Verify Budget**: Confirm you have calls remaining.

---

## 3-Minute Walkthrough Flow

### 1. Introduction (0:00 - 0:30)
- **Action**: Open the landing page at `http://localhost:5173`.
- **Say**: *"This is Mansik Santulan, a minimalist wellbeing companion designed for university students. It combines a habit-based machine learning model with an empathetic AI listener. It is not a clinical or diagnostic tool, but an anonymous daily self-reflection aid."*
- **Highlight**: Notice the privacy principle—there is no login, no accounts, and no passwords.

### 2. The Check-in Wizard (0:30 - 1:15)
- **Action**: Click **"Start Wellbeing Check-in"**.
- **Demonstrate**: Walk through the 10-step wizard.
  - Step 1: Age (e.g., 21)
  - Step 2: Academic level (Undergraduate)
  - Step 3: Sleep (e.g., 5.5 hours)
  - Step 4: Social media usage (e.g., 5.5 hours)
  - Step 5: Phone unlocks (e.g., 140)
  - Step 6: Study hours (e.g., 4.5 hours)
  - Step 7: Physical activity (e.g., 0.5 hours)
  - Step 8: Stress level (High)
  - Step 9: Platform & Purpose (Instagram, Entertainment)
  - Step 10: Baseline demographics (Female, India)
- **Click**: **"See my estimate"**.

### 3. Wellbeing Result & What-If Simulations (1:15 - 1:50)
- **Showcase**:
  - The **Score Arc** displaying a calm numerical estimate (e.g., 5.7 / 10, Moderate).
  - The **Practical Habit Suggestions**: Point out these are deterministic rules derived from dataset statistics, not LLM hallucinations.
  - The **What-If Scenarios**: Explain that re-running the ML model with adjusted habits (e.g., +1 hour of sleep) shows correlation trends without making clinical promises.

### 4. Conversational Companion "Saathi" (1:50 - 2:30)
- **Action**: Click **"Talk it through with Saathi"**.
- **Message 1**: Type *"I'm having a hard time focusing on exam prep because my sleep is erratic."*
- **Observe**: Notice Saathi responds empathetically in 2-3 concise sentences and remaining calls counter updates.
- **Message 2**: Type *"Thanks, that helps put it in perspective."*

### 5. Crisis Safety Demonstration (2:30 - 2:50)
- **Action**: In chat, type a crisis test phrase:
  *"I feel like I want to end my life."*
- **Observe**:
  - Response is instantaneous.
  - Returns the verified national helpline message (Tele-MANAS **14416** & **112**).
  - The red Help banner activates.
  - **Crucial point for judges/evaluators**: *Point out that ZERO LLM calls were made for this response. The safety filter caught the keyword deterministically, completely preventing AI hallucinations in emergencies.*

### 6. History & Data Privacy (2:50 - 3:00)
- **Action**: Click **History** in the top navigation.
- **Demonstrate**: View the SVG TrendLine connecting past check-ins.
- **Action**: Click **"Delete my data"** and confirm.
- **Result**: The session and all associated database records are completely wiped.
