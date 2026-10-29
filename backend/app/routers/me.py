from fastapi import APIRouter, Depends
from ..schemas import DeleteResponse
from .. import db
from .deps import get_session_id

router = APIRouter(tags=["me"])

@router.delete("/me", response_model=DeleteResponse)
def delete_me_endpoint(session_id: str = Depends(get_session_id)):
    deleted = db.delete_session(session_id)
    return DeleteResponse(deleted=True)
