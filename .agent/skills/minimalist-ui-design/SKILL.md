---
name: minimalist-ui-design
description: Use when styling the app, choosing colors, typography, spacing, layout, or designing screens and components.
---

# Minimalist UI Design Instructions
- Design tokens in `tokens.css`:
  - Calm sage palette (`--bg: #FAFAF7`, `--surface: #FFFFFF`, `--text: #2B2D2F`, `--muted: #6B7077`, `--accent: #6F8F7B`, `--accent-soft: #E6EEE9`, `--warn: #C9833A`, `--danger: #B5493F`, `--radius: 16px`).
  - Dark mode support via `@media (prefers-color-scheme: dark)`.
- One centered column, `max-width: 560px`, generous padding (24–32px).
- Typography: Inter/DM Sans/system font, line-height 1.6.
- Soft shadows, no harsh borders, subtle transitions (150–250ms).
- Respect `prefers-reduced-motion`.
- Mobile-first with >=44px touch targets.
- Depth rule: In 2D, use size; in 3D, use proximity. Primary CTAs sit closer to camera ($z=0$), background elements at $z=-5$.
- Clean screen specs for Welcome, CheckIn wizard, Result, Chat, History.
