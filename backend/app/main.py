from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import init_db
from .services.model_service import get_model
from .routers import predict, chat, history, me

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and load model into memory
    init_db()
    get_model()
    yield
    # Shutdown

app = FastAPI(
    title="Mental Health Companion API",
    version="1.0.0",
    description="Backend API for student wellbeing companion with ML predictions and Gemini chat",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "X-Session-Id"],
)

# Health endpoint (no auth/session required)
@app.get("/health")
def health():
    return {"status": "ok"}

# Register routers
app.include_router(predict.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(me.router)
