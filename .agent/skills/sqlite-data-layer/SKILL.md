---
name: sqlite-data-layer
description: Use when creating tables, writing queries, saving check-ins or messages, or implementing history and delete-my-data.
---

# SQLite Data Layer Instructions
- Use parameterized queries only. Never format SQL with f-strings.
- Schema:
  ```sql
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    inputs_json TEXT NOT NULL,
    score REAL NOT NULL,
    band TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user','assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS llm_usage (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    calls INTEGER NOT NULL DEFAULT 0
  );
  ```
- Enable `PRAGMA foreign_keys = ON` on every connection.
- `DELETE /me` removes the session row; cascade deletes its assessments and messages.
- Keep the DB file in `backend/data/app.db` and gitignore it.
