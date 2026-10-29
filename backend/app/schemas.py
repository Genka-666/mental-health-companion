from pydantic import BaseModel, Field
from typing import Literal

class PredictRequest(BaseModel):
    age: int = Field(..., ge=10, le=100, description="Age between 10 and 100")
    gender: Literal['Male', 'Female']
    country: str = Field(default="India", max_length=100)
    academic_level: Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform: Literal[
        'Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
        'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat'
    ]
    purpose_of_use: Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours: float = Field(..., ge=0.0, le=24.0)
    daily_unlocks: int = Field(..., ge=0, le=1000)
    study_hours: float = Field(..., ge=0.0, le=24.0)
    physical_activity_hours: float = Field(..., ge=0.0, le=24.0)
    sleep_hours_per_night: float = Field(..., ge=0.0, le=24.0)
    stress_level: Literal['Medium', 'Low', 'Very High', 'High']

class TipItem(BaseModel):
    id: str
    title: str
    body: str

class WhatIfItem(BaseModel):
    label: str
    delta: float

class PredictResponse(BaseModel):
    score: float
    band: str
    tips: list[TipItem]
    what_if: list[WhatIfItem]
    disclaimer: str

class ChatMessage(BaseModel):
    role: Literal['user', 'assistant']
    content: str = Field(..., min_length=1, max_length=2000)

class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1, max_length=20)

class ChatResponse(BaseModel):
    reply: str
    crisis: bool
    remaining_calls: int

class HistoryItem(BaseModel):
    id: int
    score: float
    band: str
    created_at: str

class HistoryResponse(BaseModel):
    items: list[HistoryItem]

class DeleteResponse(BaseModel):
    deleted: bool
