from fastapi import APIRouter, Depends, HTTPException
from ..schemas import ChatRequest, ChatResponse
from ..services.safety import detect_crisis
from ..services.llm import call_gemini_chat
from ..config import CRISIS_REPLY, settings
from .. import db
from .deps import get_session_id

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest, session_id: str = Depends(get_session_id)):
    last_msg = req.messages[-1]
    if last_msg.role != "user":
        raise HTTPException(
            status_code=400,
            detail={"detail": "The last message in conversation must be from the user.", "code": "LAST_MSG_NOT_USER"}
        )

    # Always persist user message
    db.save_message(session_id, "user", last_msg.content)

    # 1. Pre-LLM crisis safety check
    if detect_crisis(last_msg.content):
        # Hard-coded crisis reply: ZERO LLM calls made!
        current_calls = db.get_llm_calls()
        remaining = max(0, settings.max_llm_calls - current_calls)
        db.save_message(session_id, "assistant", CRISIS_REPLY)
        return ChatResponse(
            reply=CRISIS_REPLY,
            crisis=True,
            remaining_calls=remaining
        )

    # 2. Call Gemini
    messages_payload = [m.model_dump() for m in req.messages]
    reply, is_crisis, remaining = call_gemini_chat(messages_payload)

    # Persist assistant reply
    db.save_message(session_id, "assistant", reply)

    return ChatResponse(
        reply=reply,
        crisis=is_crisis,
        remaining_calls=remaining
    )
