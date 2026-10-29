from fastapi import APIRouter, Depends
from ..schemas import HistoryResponse, HistoryItem
from .. import db
from .deps import get_session_id

router = APIRouter(tags=["history"])

@router.get("/history", response_model=HistoryResponse)
def get_history_endpoint(session_id: str = Depends(get_session_id)):
    rows = db.get_history(session_id)
    return HistoryResponse(
        items=[HistoryItem(**r) for r in rows]
    )
