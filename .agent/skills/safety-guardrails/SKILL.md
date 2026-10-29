---
name: safety-guardrails
description: Use whenever code touches chat, user messages, crisis handling, disclaimers, helplines, or model prompts. Always apply before shipping chat features.
---

# Safety Guardrails Instructions
- `safety.py` exposes `detect_crisis(text) -> bool` using a normalized (lowercased, punctuation-stripped) keyword/phrase list.
- Includes phrases: "kill myself", "end my life", "want to die", "suicide", "suicidal", "self harm", "hurt myself", "no reason to live", "don't want to be here anymore", "better off without me", and Hinglish phrases like "mar jana chahta", "jeena nahi chahta", "khud ko khatam".
- `CRISIS_REPLY` is a fixed, warm, short message with Tele-MANAS 14416, 112, and encouragement to reach a trusted person in `config.py`.
- Crisis replies skip the LLM entirely and set `crisis=true` so the UI shows the HelpBanner.
- The model may also return `risk: "crisis"`; treat it the same way.
- Model must never diagnose, prescribe, give harm methods, or promise secrecy.
- Normal sadness ("I feel low") must receive an empathetic reply, NOT crisis blocking.
- Show disclaimer on Chat page and footer of every screen.
