import uuid
from fastapi import Header, HTTPException

def get_session_id(x_session_id: str = Header(None, alias="X-Session-Id")) -> str:
    if not x_session_id:
        raise HTTPException(
            status_code=400,
            detail={"detail": "Missing X-Session-Id header", "code": "MISSING_SESSION_ID"}
        )
    try:
        val = uuid.UUID(x_session_id, version=4)
        return str(val)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail={"detail": "Malformed X-Session-Id header. Must be a valid UUIDv4.", "code": "INVALID_SESSION_ID"}
        )
