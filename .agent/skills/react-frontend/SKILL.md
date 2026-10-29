---
name: react-frontend
description: Use when creating or editing React pages, components, state, routing, or the API client in the frontend.
---

# React Frontend Instructions
- Vite + React, functional components, hooks only. No Redux.
- Simple screen state in `App.jsx` (`welcome -> checkin -> result -> chat -> history`).
- `session.js`: on first load, create `crypto.randomUUID()` and store it in `localStorage` under `mhc_session_id`.
- `api.js`: a single `request()` helper that adds `X-Session-Id`, handles JSON, and maps errors. Base URL from `import.meta.env.VITE_API_BASE`.
- Loading, empty, and error states on every async view.
- Chat keeps history in component state, auto-scrolls, disables send while waiting, shows `TypingDots`.
- Accessible: labels, focus states, `aria-live`.
