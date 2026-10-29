import json
from fastapi import APIRouter, Depends
from ..schemas import PredictRequest, PredictResponse, TipItem, WhatIfItem
from ..services.model_service import predict_score
from ..services.recommendations import get_band, generate_tips, generate_what_if
from ..config import DISCLAIMER
from .. import db
from .deps import get_session_id

router = APIRouter(tags=["predict"])

@router.post("/predict", response_model=PredictResponse)
def predict_endpoint(data: PredictRequest, session_id: str = Depends(get_session_id)):
    inputs_dict = data.model_dump()
    
    score = predict_score(inputs_dict)
    band = get_band(score)
    tips_raw = generate_tips(inputs_dict)
    what_if_raw = generate_what_if(inputs_dict, score)
    
    # Save assessment in DB
    db.save_assessment(
        session_id=session_id,
        inputs_json=json.dumps(inputs_dict),
        score=score,
        band=band
    )
    
    return PredictResponse(
        score=score,
        band=band,
        tips=[TipItem(**t) for t in tips_raw],
        what_if=[WhatIfItem(**w) for w in what_if_raw],
        disclaimer=DISCLAIMER
    )
