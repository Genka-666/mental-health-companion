import sqlite3
import os
from datetime import datetime, timezone
from pathlib import Path
from .config import settings

def get_db_path() -> str:
    path = Path(settings.database_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    return str(path)

def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    target_path = db_path if db_path is not None else get_db_path()
    conn = sqlite3.connect(target_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db(db_path: str | None = None) -> None:
    conn = get_connection(db_path)
    with conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL
        );
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            inputs_json TEXT NOT NULL,
            score REAL NOT NULL,
            band TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS llm_usage (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            calls INTEGER NOT NULL DEFAULT 0
        );
        """)
        # Initialize llm_usage row if not present
        conn.execute("INSERT OR IGNORE INTO llm_usage (id, calls) VALUES (1, 0);")
    conn.close()

def ensure_session(session_id: str, conn: sqlite3.Connection | None = None) -> None:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        now = datetime.now(timezone.utc).isoformat()
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO sessions (id, created_at) VALUES (?, ?);",
                (session_id, now)
            )
    finally:
        if should_close:
            conn.close()

def save_assessment(session_id: str, inputs_json: str, score: float, band: str, conn: sqlite3.Connection | None = None) -> int:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        ensure_session(session_id, conn)
        now = datetime.now(timezone.utc).isoformat()
        with conn:
            cursor = conn.execute(
                """
                INSERT INTO assessments (session_id, inputs_json, score, band, created_at)
                VALUES (?, ?, ?, ?, ?);
                """,
                (session_id, inputs_json, score, band, now)
            )
            return cursor.lastrowid
    finally:
        if should_close:
            conn.close()

def get_history(session_id: str, conn: sqlite3.Connection | None = None) -> list[dict]:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        cursor = conn.execute(
            """
            SELECT id, score, band, created_at
            FROM assessments
            WHERE session_id = ?
            ORDER BY created_at ASC;
            """,
            (session_id,)
        )
        return [dict(row) for row in cursor.fetchall()]
    finally:
        if should_close:
            conn.close()

def save_message(session_id: str, role: str, content: str, conn: sqlite3.Connection | None = None) -> int:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        ensure_session(session_id, conn)
        now = datetime.now(timezone.utc).isoformat()
        with conn:
            cursor = conn.execute(
                """
                INSERT INTO messages (session_id, role, content, created_at)
                VALUES (?, ?, ?, ?);
                """,
                (session_id, role, content, now)
            )
            return cursor.lastrowid
    finally:
        if should_close:
            conn.close()

def delete_session(session_id: str, conn: sqlite3.Connection | None = None) -> bool:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        with conn:
            cursor = conn.execute("DELETE FROM sessions WHERE id = ?;", (session_id,))
            return cursor.rowcount > 0
    finally:
        if should_close:
            conn.close()

def get_llm_calls(conn: sqlite3.Connection | None = None) -> int:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        cursor = conn.execute("SELECT calls FROM llm_usage WHERE id = 1;")
        row = cursor.fetchone()
        return row["calls"] if row else 0
    finally:
        if should_close:
            conn.close()

def increment_llm_calls(conn: sqlite3.Connection | None = None) -> int:
    should_close = False
    if conn is None:
        conn = get_connection()
        should_close = True
    try:
        with conn:
            conn.execute("UPDATE llm_usage SET calls = calls + 1 WHERE id = 1;")
            cursor = conn.execute("SELECT calls FROM llm_usage WHERE id = 1;")
            row = cursor.fetchone()
            return row["calls"] if row else 0
    finally:
        if should_close:
            conn.close()
